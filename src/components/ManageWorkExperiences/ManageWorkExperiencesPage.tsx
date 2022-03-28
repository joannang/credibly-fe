import { Button, Card, Col, Empty, PageHeader, Row, Table, Typography } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useStores } from '../../stores/StoreProvider';
import BaseLayout from '../BaseLayout';
import AddWorkExperienceModal from './AddWorkExperienceModal/AddWorkExperienceModal';
import styles from './ManageWorkExperiences.module.css';

const ManageWorkExperiences: React.FC = () => {
    const { appStore, uiState } = useStores();
    
    const [experiences, setExperiences] = useState([]);
    const [position, setPosition] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');

    const orgId = JSON.parse(sessionStorage.getItem('user')).id;
    const uen = JSON.parse(sessionStorage.getItem('user')).uen;

    const email = window.location.search.substring(7);

    useEffect(() => {
        getEmployeeWorkExperiences();
    }, [])

    // add to blockchain
    const getEmployeeWorkExperiences = async() => {
        // console.log(email);
        // const res = await appStore.addWorkExperience(email, 'Software Engineer', 'APAC Senior Developer', '01052022', '9345');
        // console.log(res);

        const workExperiences = await appStore.getWorkExperiences(email);
        console.log(workExperiences);
        setExperiences(workExperiences);
        console.log(experiences);
    }

    const addEmployeeWorkExperience = async() => {
        try {
            const res = await appStore.addWorkExperience(email, position, description, startDate, uen);
            console.log(res);
        } catch (err) {
            console.log(err.message);
        }
    }

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Position',
            dataIndex: 'position', 
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
        }, {
            title: 'End Date',
            dataIndex: 'endDate',
        }
    ];

    return (
        <BaseLayout>
            <div>
                <div className={styles.container}>
                    <PageHeader
                        title={`Manage Work Experiences for ${email}`}
                        extra={[
                            <Button
                                key="1"
                                onClick={() => uiState.setModalOpen(true)}
                            >
                                Add Employee
                            </Button>,
                        ]}
                    />
                    {experiences && experiences.length !== 0 ? (
                        <Table
                            dataSource={experiences}
                            columns={columns}
                        />
                    ) : (
                        <Empty description="No work experiences have been added" />
                    )}
                </div>
            </div>
            <AddWorkExperienceModal/>
        </BaseLayout>
    );
};

export default observer(ManageWorkExperiences);
