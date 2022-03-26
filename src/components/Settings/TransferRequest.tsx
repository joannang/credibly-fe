import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Tag, Upload } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { AccountType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import { NotFoundPage } from '../Errors/404';
import styles from './Settings.module.css';

export type TransferRequestTabProps = {};

const TransferRequestTab: React.FC<TransferRequestTabProps> = () => {
    const { appStore } = useStores();
    // const userId = JSON.parse(sessionStorage.getItem('user')).id;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [transferTo, setTransferTo] = React.useState<string>('');

    const userId = 1;
    const organisationId = 1;

    const fileUpload = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleTransferRequest = () => {
        console.log(userId, organisationId);
        setLoading(true);

        try {
            message.success('Success!');
        } catch (err) {
            // uiState.setError(err.error);
            console.log(err);
            if (err) {
                message.error(err.error);
            }
        } finally {
            setLoading(false);
            setTransferTo('');
        }
    };

    React.useEffect(() => {
        setTransferTo('');
    }, []);

    return (
        <div className={styles.transferRequestContainer}>
            <div>
                <Tag color="cyan" className={styles.transferRequestTag}>
                    <>
                        <InfoCircleOutlined /> FOR YOUR INFORMATION: This is a
                        formal request that will be sent to your organisation/
                        institution. You are requesting to change the email
                        address that your certificates and work experiences are
                        attached to. Credibly will not be able to reverse this
                        action.
                    </>
                </Tag>
            </div>

            <Form
                id="transferForm"
                layout="horizontal"
                labelAlign="left"
                labelCol={{ span: 6 }}
                onFinish={() => handleTransferRequest()}
            >
                <Form.Item
                    label="Transfer To"
                    name="transferTo"
                    rules={[
                        {
                            required: true,
                            message:
                                'Please input where you want to transfer to!',
                        },
                    ]}
                >
                    <div style={{ width: '240px' }}>
                        <Input
                            placeholder="Enter your new..."
                            value={transferTo}
                            onChange={(e) => setTransferTo(e.target.value)}
                        />
                    </div>
                </Form.Item>
                <Form.Item
                    name="documents"
                    label="Supporting Documents"
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
            <Button form="transferForm" key="submit" htmlType="submit">
                Send
            </Button>
        </div>
    );
};

export default observer(TransferRequestTab);
