import { Button, Descriptions, Empty, message, PageHeader, Table } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { AwardeeType, CertificateDetails } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import styles from './CreateCredentials.module.css';
import { create } from 'ipfs-http-client';
import BaseLayout from '../BaseLayout';
import checkAuthenticated from '../../security/checkAuthenticated';
import { IPFS_PROJECT_ID, IPFS_PROJECT_SECRET } from '../../settings';

const auth =
    'Basic ' +
    Buffer.from(IPFS_PROJECT_ID + ':' + IPFS_PROJECT_SECRET).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

const PublishCertificates: React.FC = () => {
    const { appStore } = useStores();
    const [awardees, setAwardees] = useState<AwardeeType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [certName, setCertName] = useState('');

    const [publishToggle, setPublishToggle] = useState(false);

    const groupId = parseInt(window.location.search.substring(4));
    const orgId = JSON.parse(sessionStorage.getItem('user')).id;
    const uen = JSON.parse(sessionStorage.getItem('user')).uen;
    const key = `awardees/${orgId}/${groupId}`;

    // get awardees in the awardeeGroup to populate table
    useEffect(() => {
        getAwardees();
        getCertificateName();
    }, [publishToggle]);

    const getAwardees = async () => {
        // Revised: getting awardees from localStorage so that i can get the issue dates
        const key = `awardees/${orgId}/${groupId}`;
        const awardees = JSON.parse(localStorage.getItem(key)).awardees;
        setAwardees(awardees);
        console.log(awardees);
    };

    const getCertificateName = async () => {
        await appStore.setAwardeeGroups(orgId);
        const groups = await appStore.getAwardeeGroups();
        const group = groups.filter((x) => x.key == groupId);
        setCertName(group[0].certificateName);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Issue Date',
            dataIndex: 'date',
        },
        {
            title: 'Published',
            dataIndex: 'published',
            render: (published) => {
                return <div>{published.toString()}</div>
            }
        }
    ];

    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // create certificates and put on ipfs
    const publishCreds = async () => {
        message.loading({
            content: 'Loading...',
            key: 'loading',
            duration: 60,
        });

        const chosenAwardees = [];
        for (let i = 0; i < selectedRowKeys.length; i++) {
            awardees.map((awardee) => {
                if (awardee.key == selectedRowKeys[i]) {
                    chosenAwardees.push(awardee);
                }
            });
        }

        try {
            const response = await appStore.generateCertificates(
                certName,
                orgId,
                chosenAwardees
            );
            console.log(response);
            const ipfsHashes = [];
            for (let i = 0; i < response.length; i++) {
                const encodedImg = response[i].encodedCertificate;
                // const res = decodeBase64Image(encodedImg);
                // console.log(res);

                const { path } = await client.add(Buffer.from(encodedImg));

                const hash: CertificateDetails = {
                    awardeeName: response[i].awardeeName,
                    dateOfIssue: response[i].issueDate,
                    image: path,
                    certificateName: certName
                }

                ipfsHashes.push(JSON.stringify(hash));

                // const chunks = [];
                // for await (const chunk of client.cat(path)) {
                //     chunks.push(chunk);
                // }
                // console.log(Buffer.concat(chunks).toString());
            }
            const emails = response.map(x => x.awardeeEmail);
            const res = await awardCertificates(ipfsHashes, emails);
            console.log(res);

            updateLocalStorage(emails);

            message.success({
                content: 'Success!',
                key: 'loading',
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    const awardCertificates = async (ipfsHashes: string[], emails) => {
        const res: any = await appStore.bulkAwardCertificates(
            uen, groupId, ipfsHashes, emails
        )
        return res;
    }

    const updateLocalStorage = (emails) => {
        var storageAwardees = JSON.parse(localStorage.getItem(key)).awardees;
        storageAwardees = storageAwardees.map(x => ({
            ...x,
            published: emails.includes(x.email) ? true : x.published,
        }));

        const awardeesToStoreInLocalStorage = {
            organisationId: orgId,
            groupId: groupId,
            awardees: storageAwardees,
        }

        localStorage.setItem(
            `awardees/${orgId}/${groupId}`,
            JSON.stringify(awardeesToStoreInLocalStorage)
        );

        setPublishToggle(!publishToggle);
    }

    function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response: any = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }

        response.type = matches[1];
        response.data = Buffer.from(matches[2], 'base64');

        return response;
    }

    return (
        <BaseLayout>
            <div>
                <div className={styles.container}>
                    <PageHeader
                        title="Create Credentials"
                        subTitle="Step 2 of 2"
                        extra={[
                            <Button
                                key="1"
                                disabled={
                                    selectedRowKeys.length == 0 ? true : false
                                }
                                onClick={publishCreds}
                            >
                                Publish Credentials
                            </Button>,
                        ]}
                    >
                        <Descriptions size="small">
                            <Descriptions.Item>
                                Unpublished Credentials
                            </Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    {awardees && awardees.length !== 0 ? (
                        <Table
                            rowSelection={rowSelection}
                            dataSource={awardees}
                            columns={columns}
                        />
                    ) : (
                        <Empty description="All available credentials have been published" />
                    )}
                </div>
            </div>
        </BaseLayout>
    );
};

export default checkAuthenticated(observer(PublishCertificates));
