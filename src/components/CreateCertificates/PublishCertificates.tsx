import { Button, Descriptions, Empty, PageHeader, Table } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { AwardeeType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import styles from './CreateCredentials.module.css';

const PublishCertificates: React.FC = () => {
    const { appStore } = useStores();
    const [awardees, setAwardees] = useState<AwardeeType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // get awardees in the awardeeGroup to populate table
    useEffect(() => {
        getAwardees();
    }, []);

    const getAwardees = async () => {
        const groupId = 1; // TODO: implement
        const awardees = await appStore.getAwardeesFromGroup(groupId);

        setAwardees(awardees);
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
    ];

    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // create certificates and put on ipfs
    const publishCreds = () => {
        // logic
        // success!
    };

    return (
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
                        <Descriptions.Item>Unpublished Credentials</Descriptions.Item>
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
                ;
            </div>
        </div>
    );
};

export default observer(PublishCertificates);
