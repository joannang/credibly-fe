import {
    Button,
    Form,
    FormInstance,
    Image,
    Input,
    Modal,
    Radio,
    Space,
} from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import styles from './Groups.module.css';

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
}) => {
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
                <Button form="createForm" key="submit" htmlType="submit">
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
                    <div
                    // style={{
                    //     height: '35vh',
                    //     overflowY: 'scroll',
                    // }}
                    >
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
                                <Radio value={1}>
                                    <Image
                                        height="20vh"
                                        width="auto"
                                        preview={false}
                                        src="https://previews.123rf.com/images/auroradesignco/auroradesignco2009/auroradesignco200900041/156020129-.jpg"
                                    />
                                </Radio>
                                <Radio value={2}>
                                    <Image
                                        height="20vh"
                                        width="auto"
                                        preview={false}
                                        src="https://simplecert.net/wp-content/uploads/2020/08/SimpleCert-Stock-certificate.jpg"
                                    />
                                </Radio>
                                <Radio value={3}>
                                    <Image
                                        height="20vh"
                                        width="auto"
                                        preview={false}
                                        src="https://semoscloud.com/wp-content/uploads/2020/03/sales-quota-achievement-employee-of-the-month-template-1024x791.png"
                                    />
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
