import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Tag, Tooltip, Upload } from 'antd';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';
import styles from './Settings.module.css';

export type TransferRequestTabProps = {};

const TransferRequestTab: React.FC<TransferRequestTabProps> = () => {
    const { appStore } = useStores();
    const router = useRouter();

    const userId = appStore.currentUser.id;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [transferTo, setTransferTo] = React.useState<string>('');
    const [confirmEmail, setConfirmEmail] = React.useState<string>('');

    const handleTransferRequest = async (values: any) => {
        setLoading(true);
        const emailsMatch = values.transferTo === confirmEmail;

        if (emailsMatch) {
            try {
                await appStore.changeEmail(appStore?.currentUser?.email, values.transferTo);
                message.success('Success! Please re-login with your new email!');
                setTransferTo('');
                setConfirmEmail('');
                setTimeout(()=> appStore.onLogout(router), 2000);
                
            } catch (err) {
                message.error(err)
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
                    <InfoCircleOutlined /> FOR YOUR INFORMATION: You are requesting to transfer all associated
                    certificates and work experiences to this new email
                    address. Credibly will not be able to reverse this action.
                    Your account details for Credibly will also be updated to reflect the new email address. You 
                    will be required to re-login.
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
