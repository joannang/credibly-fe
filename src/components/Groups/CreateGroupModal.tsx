import { Form, FormInstance, Input, Modal, Radio, Space } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';

export type CreateGroupModalProps = {
    isModalVisible: boolean;

    loading: boolean;

    addForm: FormInstance<any>;

    templateSelected: number;

    handleCancel: () => void;

    handleOk: () => void;

    handleTemplateSelected: (event) => void;
};

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
    isModalVisible,
    loading,
    addForm,
    templateSelected,
    handleCancel,
    handleOk,
    handleTemplateSelected,
}) => {
    return (
        <Modal
            title="Create Awardee Group"
            visible={isModalVisible}
            okText="Create"
            width={616}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={loading}
        >
            <Form
                form={addForm}
                layout="horizontal"
                labelAlign="left"
                labelCol={{ span: 6 }}
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
                    validateFirst
                    hasFeedback
                >
                    <div style={{ width: '240px' }}>
                        <Input placeholder="Group Name" />
                    </div>
                </Form.Item>
                <Form.Item
                    label="Certificate Template"
                    name="certificateTemplate"
                    rules={[
                        {
                            required: true,
                            message:
                                'Please select a certificate template for this group!',
                        },
                    ]}
                    validateFirst
                    hasFeedback
                    // getValueFromEvent={handleTemplateSelected}
                >
                    <div style={{ width: '480px' }}>
                        <Radio.Group
                            onChange={handleTemplateSelected}
                            value={templateSelected}
                        >
                            <Space direction="vertical">
                                {/* {certificateTemplates.map((i) => (
                                <Radio value={`${i}`}>
                                    Option A
                                </Radio>
                            ))} */}
                                <Radio value={1000}>
                                    Upload New Template
                                    {/* {certificateTemplates.length === 1000 ? ***upload function here*** : null} */}
                                </Radio>
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
