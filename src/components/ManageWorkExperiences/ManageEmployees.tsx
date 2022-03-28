import { Button, Empty, message, PageHeader, Table, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { AwardeeType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import BaseLayout from '../BaseLayout';
import checkAuthenticated from '../../security/checkAuthenticated';
import styles from './ManageEmployees.module.css';
import { FileProtectOutlined } from '@ant-design/icons';
import AddEmployeeModal from './AddEmployeeModal/AddEmployeeModal';

const ManageEmployees: React.FC = () => {
    const { appStore, uiState } = useStores();
    const [awardees, setAwardees] = useState<AwardeeType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const orgId = JSON.parse(sessionStorage.getItem('user')).id;

    // get awardees in the awardeeGroup to populate table
    useEffect(() => {
        getAwardees();
    }, [uiState.employeesUpdated]);

    const getAwardees = async () => {
        const awardees = await appStore.getAwardeesFromOrganisation(orgId);
        setAwardees(awardees);
        console.log(awardees);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'key',
            sorter: (a, b) => a.id - b.id,
            defaultSortOrder: 'ascend',
            width: '5%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '35%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '50%',
        },
        {
            title: 'Action',
            dataIndex: 'email',
            width: '10%',
            render: (email) => (
                <Tooltip title='Manage Work Experiences'>
                    <Button href={`workExperiences?email=${email}`} icon={<FileProtectOutlined/>}/>
                </Tooltip>
            )
        }
    ];

    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <BaseLayout>
            <div>
                <div className={styles.container}>
                    <PageHeader
                        title="Manage Employees"
                        extra={[
                            <Button
                                key="1"
                                onClick={() => uiState.setModalOpen(true)}
                            >
                                Add Employee
                            </Button>,
                        ]}
                    />
                    {awardees && awardees.length !== 0 ? (
                        <Table
                            rowSelection={rowSelection}
                            dataSource={awardees}
                            columns={columns}
                        />
                    ) : (
                        <Empty description="No employees have been added" />
                    )}
                </div>
            </div>
            <AddEmployeeModal/>
        </BaseLayout>
    );
};

export default checkAuthenticated(observer(ManageEmployees));
