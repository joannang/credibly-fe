import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Tag, Tooltip, Upload } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';
import styles from './Settings.module.css';

export type TransferRequestTabProps = {};

const TransferRequestTab: React.FC<TransferRequestTabProps> = () => {
    const { appStore } = useStores();
    const userId = appStore.currentUser.id;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [transferTo, setTransferTo] = React.useState<string>('');
    const [confirmEmail, setConfirmEmail] = React.useState<string>('');

    const organisationId = 2;

    const fileUpload = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleTransferRequest = async (values: any) => {
        console.log('Received values of form: ', values);
        setLoading(true);
        const emailsMatch = values.transferTo === confirmEmail;

        if (emailsMatch) {
            try {
                const transferRequestId = await appStore.createTransferRequest(
                    userId,
                    organisationId,
                    values.transferTo
                );

                const uploadRequest = {
                    transferRequestId,
                    documents: values.documents.map(
                        (doc: any) => doc.originFileObj
                    ),
                };

                await appStore.transferRequestUpload(uploadRequest);

                setTransferTo('');
                setConfirmEmail('');
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
        } else {
            message.error('Emails entered do not match!');
            setLoading(false);
        }
    };

    React.useEffect(() => {
        setLoading(true);
        setTransferTo('');
        setConfirmEmail('');
        setLoading(false);
    }, []);

    return (
        <div className={styles.transferRequestContainer}>
            <h3>Create Certificates & Work Experiences Transfer Request</h3>
            <Tag color="cyan" className={styles.transferRequestTag}>
                <>
                    <InfoCircleOutlined /> FOR YOUR INFORMATION: This is a
                    formal request that will be sent to your organisation/
                    institution. You are requesting to transfer all associated
                    certificates and work experiences to this a new email
                    address. Credibly will not be able to reverse this action.
                </>
            </Tag>
            <Form
                id="transferForm"
                layout="horizontal"
                labelAlign="left"
                labelCol={{ span: 6 }}
                onFinish={handleTransferRequest}
            >
                <Form.Item label="Current Email Address">
                    <div style={{ width: '240px' }}>
                        <Input
                            value={appStore?.currentUser?.email || ''}
                            disabled
                        />
                    </div>
                </Form.Item>
                <Form.Item
                    label="New Email Address"
                    name="transferTo"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a new email address!',
                        },
                    ]}
                >
                    <div style={{ width: '240px' }}>
                        <Input
                            placeholder="Enter your new email..."
                            value={transferTo}
                            onChange={(e) => setTransferTo(e.target.value)}
                        />
                    </div>
                </Form.Item>
                <Form.Item
                    label="Confirm Email Address"
                    name="confirmEmail"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your new email address!',
                        },
                        {},
                    ]}
                >
                    <div style={{ width: '240px' }}>
                        <Input
                            placeholder="Re-enter your new email..."
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                        />
                    </div>
                </Form.Item>
                <Form.Item
                    name="documents"
                    label={
                        <Tooltip
                            title="Upload at least 1 identification document (e.g. photo of your passport)"
                            placement="bottomLeft"
                        >
                            Supporting Documents
                        </Tooltip>
                    }
                    valuePropName="fileList"
                    getValueFromEvent={fileUpload}
                    rules={[
                        {
                            required: true,
                            message:
                                'Please upload at least one supporting document!',
                        },
                    ]}
                >
                    <Upload multiple accept="application/pdf">
                        <Button icon={<UploadOutlined />}>
                            Click to Upload
                        </Button>
                    </Upload>
                </Form.Item>
            </Form>
            <Button
                form="transferForm"
                key="submit"
                htmlType="submit"
                loading={loading}
            >
                Send
            </Button>
        </div>
    );
};

export default observer(TransferRequestTab);
