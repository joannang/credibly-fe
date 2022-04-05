import { Button, Empty, message, PageHeader, Spin, Table, Tooltip } from 'antd';
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
    const [awardees, setAwardees] = useState([]);
    const [loading, setLoading] = useState(false);

    const uen = JSON.parse(sessionStorage.getItem('user')).uen;

    // get awardees in the awardeeGroup to populate table
    useEffect(() => {
        getAwardees();
    }, [uiState.employeesUpdated]);

    const getAwardees = async () => {
        setLoading(true);
        const awardees = await appStore.getEmployeesFromOrganisationContract(uen);
        setAwardees(awardees);
        console.log(awardees);
        setLoading(false);
    };

    const columns = [
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
                    { loading ?
                        <Spin className={styles.spin} />
                        :
<>
                        {awardees && awardees.length !== 0 ? (
                            <Table
                                dataSource={awardees}
                                columns={columns}
                            />
                        ) : (
                            <Empty description="No employees have been added" />
                        )}
                    </>
                    }
                    
                    
                </div>
            </div>
            <AddEmployeeModal/>
        </BaseLayout>
    );
};

export default checkAuthenticated(observer(ManageEmployees));
