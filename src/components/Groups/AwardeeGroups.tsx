/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Image, message, Table } from 'antd';
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
    // const organisationId = JSON.parse(sessionStorage.getItem('user')).id;

    const columns = [
        {
            title: 'Certificate Template',
            dataIndex: 'image',
            width: '20%',
            render: (image) => (
                <Image
                    height="100px"
                    width="auto"
                    preview={false}
                    src={`data:image/png;base64,${image}`}
                />
            ),
        },
        {
            title: 'Group Name',
            dataIndex: 'groupName',
            width: '80%',
            render: (text) => <a>{text}</a>,
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (rowKeys: number[]) => {
            setSelectedRowKeys(rowKeys);
        },
    };

    // const getCertificateTemplatesById = async () => {
    //     // const certificateTemplateIdArr = appStore?.awardeeGroups?.map(i=>i.certificateTemplateId) || [];
    //     const certificateTemplateIdArr = [];

    //     for (let i = 0; i < appStore.awardeeGroups.length; i++) {
    //         certificateTemplateIdArr.push(
    //             appStore?.awardeeGroups[i]?.certificateTemplateId
    //         );
    //     }

    //     appStore
    //         .getCertificateTemplatesById(certificateTemplateIdArr)
    //         .then(function (data) {
    //             certificateTemplatesByOrg = data;
    //         })
    //         .then(function () {
    //             for (let j = 0; j < certificateTemplatesByOrg.length; j++) {
    //                 imageEncodedStrings.push(
    //                     certificateTemplatesByOrg[j].image
    //                 );
    //             }
    //             console.log('images', imageEncodedStrings);
    //         });
    // };

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
        async function resetData() {
            await appStore.setAwardeeGroups(organisationId);
            await appStore.setCertificateTemplates(organisationId);
        }
        async function loadCertificateTemplates() {
            await resetData();
            // await getCertificateTemplatesById();
        }
        resetData();
        loadCertificateTemplates();
        setLoading(false);
    }, []);

    return (
        <div>
            <h1>Groups</h1>
            <div className={styles.buttonContainer}>
                <div>
                    {selectedRowKeys.length == appStore.awardeeGroups.length &&
                    selectedRowKeys.length != 0 ? (
                        <Button
                            type="primary"
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => handleRemoveGroups()}
                            loading={loading}
                        >
                            Remove All
                        </Button>
                    ) : selectedRowKeys.length > 1 ? (
                        <Button
                            type="primary"
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => handleRemoveGroups()}
                            loading={loading}
                        >
                            Remove Selected
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => handleRemoveGroups()}
                            loading={loading}
                        >
                            Remove
                        </Button>
                    )}
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
                        rowKey="key"
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
