import { DeleteFilled, MinusCircleFilled } from '@ant-design/icons';
import { Button, Card, Col, Input, notification, PageHeader, Row } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import redirect from '../../lib/redirect';
import checkAuthenticated from '../../security/checkAuthenticated';
import { AwardeeType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import BaseLayout from '../BaseLayout';
import styles from './CreateCredentials.module.css';

type AwardeeResponse = {
    key?: number,
    id: number,
    name: string,
    email: string,
    organisationId: number,
    date?: any,
}

/**
 * Page to create credentials either manually or via spreadsheet
 */
const CreateCertificates: React.FC = () => {
    const { appStore } = useStores();
    const [templateId, setTemplateId] = useState(0);

    const [awardees, setAwardees] = useState<AwardeeType[]>([]); // list of awardees

    useEffect(() => {
        getCertificateTemplateId();
    }, []);

    const getCertificateTemplateId = async () => {
        const groupid = parseInt(window.location.search.substring(4));
        const orgId = JSON.parse(sessionStorage.getItem('user')).id;
        await appStore.setAwardeeGroups(orgId);
        const groups = await appStore.getAwardeeGroups();
        const group = groups.filter((x) => x.key == groupid);
        setTemplateId(group[0].certificateTemplateId);
    };

    /**
     * Remove awardee from list
     */
    const handleDelete = (index) => {
        setAwardees(awardees.filter((a, idx) => idx !== index));
    };

    const addRecipient = () => {
        const newRecipient = {
            name: null,
            email: null,
            date: null,
        };
        setAwardees(awardees => [...awardees, newRecipient]);
        console.log(awardees);
    };

    const onChangeName = (e, index) => {
        awardees[index].name = e.target.value;
    };

    const onChangeEmail = (e, index) => {
        awardees[index].email = e.target.value;
    };

    const onChangeDate = (e, index) => {
        awardees[index].date = e.target.value;
    };

    const addIssueDate = (response: AwardeeResponse[]) => {
        for (let i = 0; i < response.length; i++) {
            response[i].date = awardees[i].date;
            response[i].key = response[i].id;
        }
        console.log(response);
    }

    const createCerts = async () => {
        const valid = awardees.every((x) => x.date && x.email && x.name);

        if (awardees.length == 0) {
            return;
        } else if (!valid) {
            setTimeout(() => {
                notification.error({
                    message: 'Please fill in all fields',
                });
            }, 1000);
            return;
        }

        const orgId = JSON.parse(sessionStorage.getItem('user')).id;
        const groupId = parseInt(window.location.search.substring(4));

        try {
            // create awardees
            let response = await appStore.createAwardees(orgId, awardees);
            console.log(response);
            const awardeeIds = response.map((x) => x.id);

            // post awardees to group using awardee ids
            await appStore.addAwardeesToGroup(orgId, groupId, awardeeIds);

            const uen = JSON.parse(sessionStorage.getItem('user')).uen;

            // add awardees to blockchain
            for (let i = 0; i < response.length; i++) {
                await appStore.addAwardeeToOrganisation(
                    uen,
                    response[i].email,
                    response[i].name
                );
            }

            addIssueDate(response);

            // So i can access issue date from the publish certs page
            const key = `awardees/${orgId}/${groupId}`;
            // key already exists, update existing array
            if (localStorage.getItem(key)) {
                const awardees = JSON.parse(localStorage.getItem(key)).awardees;
                response = awardees.concat(response);
            };

            const awardeesToStoreInLocalStorage = {
                organisationId: orgId,
                groupId: groupId,
                awardees: response
            }

            localStorage.setItem(
                `awardees/${orgId}/${groupId}`,
                JSON.stringify(awardeesToStoreInLocalStorage)
            );

            notification.success({
                message: 'Successfully added credentials',
            });

            redirect(`/publishcerts?id=${groupId}`);
        } catch (err) {
            setTimeout(() => {
                notification.error({
                    message: 'Something went wrong, please try again',
                });
            }, 1000);
            return;
        }
    };

    const AwardeeList = () => {
        const items = awardees.map((awardee, index) => {
            return (
                <Col span={24} key={index}>
                    <Card hoverable>
                        <Row gutter={10}>
                            <Col xs={6} md={7} lg={8}>
                                <Input
                                    placeholder="Name"
                                    defaultValue={awardee.name}
                                    onChange={(e) => onChangeName(e, index)}
                                />
                            </Col>
                            <Col xs={7} md={8} lg={8}>
                                <Input
                                    placeholder="Email"
                                    defaultValue={awardee.email}
                                    onChange={(e) => onChangeEmail(e, index)}
                                />
                            </Col>
                            <Col xs={7} md={7} lg={7}>
                                <Input
                                    type="date"
                                    placeholder="Date"
                                    defaultValue={awardee.date}
                                    onChange={(e) => onChangeDate(e, index)}
                                />
                            </Col>
                            <Col>
                                <Button
                                    className={styles.delete}
                                    icon={<MinusCircleFilled />}
                                    onClick={() => handleDelete(index)}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            );
        });
        return (
            <Row gutter={[15, 15]} className={styles.rowContainer}>
                {items}
            </Row>
        );
    };

    return (
        <BaseLayout>
            <div>
                <div className={styles.container}>
                    <PageHeader
                        title="Create Credentials"
                        subTitle="Step 1 of 2"
                    />
                    <AwardeeList />
                    <div className={styles.buttonContainer}>
                        <Button
                            className={styles.button}
                            onClick={addRecipient}
                        >
                            Add {awardees.length == 0 ? 'A' : 'Another'}{' '}
                            Recipient
                        </Button>
                        {awardees.length !== 0 && (
                            <span style={{ justifyContent: 'flex-end' }}>
                                <Button onClick={() => setAwardees([])}>
                                    Reset
                                </Button>
                                &nbsp;
                                <Button
                                    className={styles.create}
                                    onClick={createCerts}
                                >
                                    Create Credentials
                                </Button>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};

export default checkAuthenticated(observer(CreateCertificates));
