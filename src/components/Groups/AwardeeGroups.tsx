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
    const [addForm] = Form.useForm();
    const [templateSelected, setTemplateSelected] = React.useState(1);

    React.useEffect(() => {
        setLoading(true);
        appStore.setAwardeeGroups(organisationId);
        setLoading(false);
    }, []);

    const columns = [
        {
            title: 'Group Name',
            dataIndex: 'groupName',
            key: 'groupName',
            width: 300,
            render: (text) => <a>{text}</a>,
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: number[]) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const organisationId = 1; // hardcoded value for now

    const groups = appStore.getAwardeeGroups();
    // const certificateTemplates = appStore.getCertificateTemplates();
    // get credentials here

    const handleModal = async () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            // to fix
            await appStore.createAwardeeGroup(
                organisationId,
                'Sample Group Name',
                []
            );
            message.success('Success!');
        } catch (err) {
            // uiState.setError(err.error);
            console.log(err);
            if (err) {
                message.error(err.error);
            }
        } finally {
            setLoading(false);
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        addForm.resetFields();
        setIsModalVisible(false);
    };

    const handleTemplateSelected = (e: any) => {
        setTemplateSelected(e.target.value);
    };

    const handleRemoveGroup = async (groupIds: number[]) => {
        setLoading(true);

        try {
            await appStore.removeAwardeeGroup(organisationId, groupIds);
            message.success('Success!');
        } catch (err) {
            // uiState.setError(err.error);
            console.log(err);
            if (err) {
                message.error(err.error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Groups</h1>
            <div className={styles.buttonContainer}>
                <div>
                    <Button
                        type="primary"
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => handleRemoveGroup(selectedRowKeys)}
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
                        addForm={addForm}
                        templateSelected={templateSelected}
                        handleCancel={handleCancel}
                        handleOk={handleOk}
                        handleTemplateSelected={handleTemplateSelected}
                    />
                </div>
                <span style={{ marginLeft: 8 }}>
                    {selectedRowKeys.length > 1
                        ? `${selectedRowKeys.length} groups selected`
                        : selectedRowKeys.length == 1
                        ? `${selectedRowKeys.length} group selected`
                        : ''}
                </span>
            </div>
            <div>
                {groups.length == 0 && (
                    <div style={{ marginBottom: '30px' }}>No groups found!</div>
                )}
                {groups.length != 0 && (
                    <Table
                        rowSelection={{
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={groups}
                    />
                )}
            </div>
        </div>
    );
};

export default observer(AwardeeGroups);
