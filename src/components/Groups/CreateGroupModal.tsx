import { Button, Form, FormInstance, Input, Modal, Radio, Space } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';

export type CreateGroupModalProps = {
    isModalVisible: boolean;

    loading: boolean;

    groupName: string;

    handleGroupName: (e) => void;

    certificateTemplateId: number;

    handleTemplateSelected: (e) => void;

    handleCreateForm: () => void;

    handleCancel: () => void;

    setTemplateSelected: (e) => void;
};

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
    isModalVisible,
    loading,
    groupName,
    handleGroupName,
    certificateTemplateId,
    handleTemplateSelected,
    handleCreateForm,
    handleCancel,
    // setTemplateSelected,
}) => {
    return (
        <Modal
            title="Create Awardee Group"
            visible={isModalVisible}
            okText="Create"
            width={616}
            confirmLoading={loading}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button form="createForm" key="submit" htmlType="submit">
                    Create
                </Button>,
            ]}
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
                    <div style={{ width: '480px' }}>
                        <Radio.Group
                            onChange={(e) => handleTemplateSelected(e)}
                            value={certificateTemplateId}
                        >
                            <Space direction="vertical">
                                {/* {certificateTemplates.map((i) => (
                                <Radio value={`${i}`}>
                                    Option A
                                </Radio>
                            ))} */}
                                <Radio value={1}>Template 1</Radio>
                                <Radio value={2}>Template 2</Radio>
                                <Radio value={3}>Template 3</Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                </Form.Item>
                {/* implementation for awardee selection here */}
            </Form>
        </Modal>
    );
};

export default observer(CreateGroupModal);
