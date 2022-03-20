/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, message, Modal, Radio, Space, Table } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';
import CreateGroupModal from './CreateGroupModal';
import styles from './Groups.module.css';

const AwardeeGroups: React.FC = () => {
    const { appStore } = useStores();

    const [loading, setLoading] = React.useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<number[]>([]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [groupName, setGroupName] = React.useState('');
    const [certificateTemplateId, setTemplateSelected] = React.useState(1);

    const organisationId = 1; // hardcoded value for now

    const columns = [
        {
            title: 'Group Name',
            dataIndex: 'groupName',
            width: 300,
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Certificate Template',
            dataIndex: 'certificateTemplateId',
            width: 300,
            render: (text) => <a>{text}</a>,
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (rowKeys: number[]) => {
            console.log(rowKeys);
            setSelectedRowKeys(rowKeys);
        },
    };

    // const certificateTemplates = appStore.getCertificateTemplates();
    // get credentials here

    const handleModal = async () => {
        setIsModalVisible(true);
    };

    const handleGroupName = (e: any) => {
        setGroupName(e.target.value);
    };

    const handleTemplateSelected = (e: any) => {
        setTemplateSelected(e.target.value);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setGroupName('');
        setTemplateSelected(1);
    };

    const handleCreateForm = async () => {
        setLoading(true);

        try {
            await appStore.createAwardeeGroup(
                organisationId,
                groupName,
                certificateTemplateId
            );

            setGroupName('');
            setTemplateSelected(1);

            message.success('Success!');
        } catch (err) {
            // uiState.setError(err.error);
            console.log(err);
            if (err) {
                message.error(err.error);
            }
        } finally {
            await appStore.setAwardeeGroups(organisationId);
            setLoading(false);
            setIsModalVisible(false);
        }
    };

    const handleRemoveGroups = async () => {
        setLoading(true);

        try {
            const groupIds = [].concat(...[selectedRowKeys]);

            await appStore.removeAwardeeGroup(organisationId, groupIds);

            message.success('Success!');
        } catch (err) {
            // uiState.setError(err.error);
            console.log(err);
            if (err) {
                message.error(err.error);
            }
        } finally {
            setSelectedRowKeys([]);
            await appStore.setAwardeeGroups(organisationId);
            setLoading(false);
        }
    };

    React.useEffect(() => {
        setLoading(true);
        async function resetAwardeeGroups() {
            await appStore.setAwardeeGroups(organisationId);
        }
        resetAwardeeGroups();
        setLoading(false);
    }, []);

    return (
        <div>
            <h1>Groups</h1>
            <div className={styles.buttonContainer}>
                <div>
                    <Button
                        type="primary"
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => handleRemoveGroups()}
                        loading={loading}
                    >
                        Remove
                    </Button>
                </div>

                <div className={styles.createButton}>
                    <Button
                        type="primary"
                        onClick={() => handleModal()}
                        loading={loading}
                    >
                        Create
                    </Button>
                    <CreateGroupModal
                        isModalVisible={isModalVisible}
                        loading={loading}
                        groupName={groupName}
                        handleGroupName={handleGroupName}
                        certificateTemplateId={certificateTemplateId}
                        handleTemplateSelected={handleTemplateSelected}
                        handleCreateForm={handleCreateForm}
                        handleCancel={handleCancel}
                        setTemplateSelected={setTemplateSelected}
                    />
                </div>
                <span style={{ marginTop: 8 }}>
                    {selectedRowKeys.length > 1
                        ? `${selectedRowKeys.length} groups selected`
                        : selectedRowKeys.length == 1
                        ? `${selectedRowKeys.length} group selected`
                        : ''}
                </span>
            </div>
            <div>
                {appStore.awardeeGroups.length == 0 && (
                    <div style={{ marginBottom: '30px' }}>No groups found!</div>
                )}
                {appStore.awardeeGroups.length != 0 && (
                    <Table
                        rowKey="id"
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={appStore.awardeeGroups}
                        pagination={{ pageSize: 3 }}
                    />
                )}
            </div>
        </div>
    );
};

export default observer(AwardeeGroups);
