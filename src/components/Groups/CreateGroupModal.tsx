import { Button, Form, Image, Input, Modal, Radio, Space } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';
import styles from './Groups.module.css';

export type CreateGroupModalProps = {
    isModalVisible: boolean;

    loading: boolean;

    groupName: string;

    groupDescription: string;

    handleGroupName: (e) => void;

    certificateTemplateId: number;

    handleTemplateSelected: (e) => void;

    handleGroupDescription: (e) => void;

    handleCreateForm: () => void;

    handleCancel: () => void;

    setTemplateSelected: (e) => void;
};

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
    isModalVisible,
    loading,
    groupName,
    groupDescription,
    handleGroupName,
    certificateTemplateId,
    handleTemplateSelected,
    handleGroupDescription,
    handleCreateForm,
    handleCancel,
}) => {
    const { appStore } = useStores();
    const { TextArea } = Input;
    return (
        <Modal
            title="Create Awardee Group"
            visible={isModalVisible}
            okText="Create"
            width={'650px'}
            confirmLoading={loading}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button
                    form="createForm"
                    key="submit"
                    htmlType="submit"
                    disabled={appStore.certificateTemplates.length == 0}
                >
                    Create
                </Button>,
            ]}
            className={styles.modal}
        >
            <Form
                id="createForm"
                layout="horizontal"
                labelAlign="left"
                labelCol={{ span: 6 }}
                initialValues={{ certificateTemplateId: 1 }}
                onFinish={() => handleCreateForm()}
            >
                <Form.Item
                    label="Group Name"
                    name="groupName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a group name!',
                        },
                    ]}
                >
                    <div style={{ width: '240px' }}>
                        <Input
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => handleGroupName(e)}
                        />
                    </div>
                </Form.Item>

                <div>
                    <Form.Item
                        label="Certificate Template"
                        name="certificateTemplateId"
                        rules={[
                            {
                                required: true,
                                message:
                                    'Please select a certificate template for this group!',
                            },
                        ]}
                    >
                        {appStore.certificateTemplates.length !== 0 ? (
                            appStore.certificateTemplates.map(
                                (certificateTemplate) => (
                                    <Radio.Group
                                        key={certificateTemplate.certificateId}
                                        onChange={(e) =>
                                            handleTemplateSelected(e)
                                        }
                                        value={certificateTemplateId}
                                    >
                                        <Space direction="vertical">
                                            <Radio
                                                value={`${certificateTemplate.certificateId}`}
                                            >
                                                <>
                                                    <div
                                                        className={
                                                            styles.modalCertTemp
                                                        }
                                                    >
                                                        {
                                                            certificateTemplate.certificateName
                                                        }
                                                    </div>
                                                    <p />
                                                    <Image
                                                        height="20vh"
                                                        width="auto"
                                                        preview={false}
                                                        src={`data:image/png;base64,${certificateTemplate.image}`}
                                                    />
                                                </>
                                            </Radio>
                                        </Space>
                                    </Radio.Group>
                                )
                            )
                        ) : (
                            <div>
                                Please upload an certificate template for your
                                organisation to create a group!
                            </div>
                        )}
                    </Form.Item>
                </div>

                <Form.Item
                    label="Group Description"
                    name="groupDescription"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a group description!',
                        },
                    ]}
                >
                    <div style={{ width: '100%' }}>
                        <TextArea
                            rows={4}
                            maxLength={255}
                            placeholder="Group Description"
                            value={groupDescription}
                            onChange={(e) => handleGroupDescription(e)}
                        />
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(CreateGroupModal);
