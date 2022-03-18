import { DeleteFilled, MinusCircleFilled } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Input, PageHeader, Row } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import * as React from 'react';
import { useState } from 'react';
import { useStores } from '../../stores/StoreProvider';
import styles from './CreateCertificates.module.css';

type AwardeeType = {
    name?: string;
    email?: string;
    date?: string;
};

/**
 * Page to create credentials either manually or via spreadsheet
 */
const CreateCertificates: React.FC = () => {
    const { appStore } = useStores();
    const [currIndex, setCurrIndex] = useState(0);

    const [awardees, setAwardees] = useState<AwardeeType[]>([]); // list of awardees

    /**
     * Remove awardee from list
     */
    const handleDelete = () => {};

    const addRecipient = () => {
        const newRecipient = {
            name: null,
            email: null,
            date: null,
        };
        setAwardees([...awardees, newRecipient]);
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

    const createCerts = () => {};

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
                                    onClick={() => handleDelete()}
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
        <div>
            <div className={styles.container}>
                <PageHeader
                    title="Create Credentials"
                    subTitle="Step 1 of 2"
                    extra={[
                        <Button key="1">
                            Create Credentials via Spreadsheet
                        </Button>,
                    ]}
                />
                <AwardeeList />
                <div className={styles.buttonContainer}>
                    <Button className={styles.button} onClick={addRecipient}>
                        Add Another Recipient
                    </Button>
                    {awardees.length !== 0 && (
                        <Button className={styles.create} onClick={createCerts}>
                            Create Credentials
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default observer(CreateCertificates);
