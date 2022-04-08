import { EditOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Empty,
    PageHeader,
    Row,
    Spin,
    Table,
    Tooltip,
    Typography,
} from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useStores } from '../../stores/StoreProvider';
import BaseLayout from '../BaseLayout';
import AddWorkExperienceModal from './AddWorkExperienceModal/AddWorkExperienceModal';
import EditEndDateModal from './EditEndDateModal/EditEndDateModal';
import styles from './ManageWorkExperiences.module.css';

const ManageWorkExperiences: React.FC = () => {
    const { appStore, uiState } = useStores();

    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(false);

    const orgId = JSON.parse(sessionStorage.getItem('user')).id;

    const email = window.location.search.substring(7);

    useEffect(() => {
        getEmployeeWorkExperiences();
    }, [uiState.toggle]);

    // add to blockchain
    const getEmployeeWorkExperiences = async () => {
        setLoading(true);
        const workExperiences = await appStore.getWorkExperiences(email);
        console.log(workExperiences);
        setExperiences(workExperiences);
        setLoading(false);
    };

    const columns = [
        {
            title: 'Organisation',
            dataIndex: 'organisation',
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
            render: (startDate) => <div>{formatDate(startDate)}</div>,
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            render: (endDate) => (
                <div>{endDate._hex == '0x00' ? '-' : formatDate(endDate)}</div>
            ),
        },
        {
            title: 'Action', // action to edit the end date
            dataIndex: 'endDate',
            render: (endDate, position) => (
                <Tooltip title='Edit End Date'>
                    <Button icon={<EditOutlined/>} onClick={() => {uiState.setEditableUser({position, endDate}); uiState.setSecondaryModalOpen(true)}}/>
                </Tooltip>
            )
        }
    ];

    const formatDate = (date) => {
        const decimal = parseInt(date._hex, 16).toString();
        // logic to format the DDMMYYYY
        if (decimal.length > 7) {
            const formattedDate = [
                decimal.slice(0, 2),
                decimal.slice(2, 4),
                decimal.slice(4),
            ].join('-');
            return formattedDate;
        } else {
            const formattedDate = [
                '0' + decimal.slice(0, 1),
                decimal.slice(1, 3),
                decimal.slice(3),
            ].join('-');
            return formattedDate;
        }
    };

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
                                Add Work Experience
                            </Button>,
                        ]}
                    />
                    {loading ? (
                        <Spin className={styles.spin} />
                    ) : (
                        <>
                            {experiences && experiences.length !== 0 ? (
                                <Table
                                    dataSource={experiences}
                                    columns={columns}
                                />
                            ) : (
                                <Empty description="No work experiences have been added" />
                            )}
                        </>
                    )}
                </div>
            </div>
            <AddWorkExperienceModal />
            <EditEndDateModal/>
        </BaseLayout>
    );
};

export default observer(ManageWorkExperiences);
