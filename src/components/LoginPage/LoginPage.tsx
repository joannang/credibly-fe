import * as React from 'react';
import { LockOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, Tabs, Radio, Upload, notification } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../stores/StoreProvider';
import styles from './LoginPage.module.css';
import { AccountType } from '../../stores/AppStore';
import { useRouter } from 'next/router';

const { TabPane } = Tabs;

const layout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
    },
};
/* eslint-enable no-template-curly-in-string */

const LoginPage: React.FC = () => {
    const { appStore, walletStore } = useStores();

    const router = useRouter()

    const [tabIndex, setTabIndex] = React.useState<string>(`${AccountType.ORGANISATION}`);
    const [loading, setLoading] = React.useState<boolean>(false);

    const [form] = Form.useForm();
    const [accountType, setAccountType] =
        React.useState<string>('organisation');

    const renderLoginForm = () => (
        <div className={styles.login}>
            <Form initialValues={{ remember: true }} onFinish={onLoginFinish}>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Email"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                        style={{ width: '100%' }}
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );

    const onLoginFinish = async (values: any) => {
        setLoading(true);

        try {
            await appStore.login(values.email, values.password, walletStore.walletAddress);
            if (appStore.currentUser.accountType === AccountType.ORGANISATION) {
                router.push('/groups');
            } else if (appStore.currentUser.accountType === AccountType.ADMIN) {
                router.push('/dashboard');
            } else {
                router.push('/privacySettings');
            }
            notification.success({ message: `Welcome back to Credibly, ${appStore.currentUser.name}!` });
        } catch (err) {
            notification.error({ message: err.error });
        } finally {
            setLoading(false);
        }
    };

    const onSelectAccountType = (event: any) => {
        event.preventDefault();
        setAccountType(event.target.value);
    };

    const fileUpload = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const renderRegisterForm = () => (
        <div className={styles.register}>
            <Form
                {...layout}
                form={form}
                onFinish={onRegisterFinish}
                validateMessages={validateMessages}
                initialValues={{ accountType: 'organisation', walletAddress: walletStore.walletAddress }}
            >
                <Form.Item
                    label="Account Type"
                    name="accountType"
                    rules={[{ required: true }]}
                >
                    <Radio.Group onChange={onSelectAccountType}>
                        <Radio.Button value="organisation">
                            Organisation
                        </Radio.Button>
                        <Radio.Button value="awardee">Awardee</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="name"
                    label={`${accountType === 'organisation' ? 'Organisation' : ''
                        } Name`}
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                {accountType === 'organisation' && (
                    <Form.Item
                        name="uen"
                        label="UEN"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                )}
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="walletAddress"
                    label="Wallet Address"
                    rules={[{ required: true }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true }]}
                >
                    <Input.Password />
                </Form.Item>
                {accountType === 'organisation' && (
                    <Form.Item
                        name="documents"
                        label="Supporting Documents"
                        valuePropName="fileList"
                        getValueFromEvent={fileUpload}
                        rules={[{ required: true }]}
                    >
                        <Upload multiple accept="application/pdf">
                            <Button icon={<UploadOutlined />}>
                                Click to upload
                            </Button>
                        </Upload>
                    </Form.Item>
                )}
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                        style={{ width: '100%' }}
                    >
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );

    const onRegisterFinish = async (values: any) => {
        setLoading(true);

        const { name, email, password, uen, walletAddress, accountType, documents } = values;

        const isOrganisationRegistration = accountType === 'organisation';

        try {
            const registerRequest = {
                name,
                email,
                password,
                uen: !!uen ? uen : null,
                walletAddress,
                accountType: isOrganisationRegistration ? AccountType.ORGANISATION : AccountType.AWARDEE,
            };

            const userId = await appStore.register(registerRequest);

            if (isOrganisationRegistration) {
                const uploadRequest = {
                    userId,
                    documents: documents.map(
                        (doc: any) => doc.originFileObj
                    ),
                };
                await appStore.registerUpload(uploadRequest);
            } else {
                await appStore.registerAwardee(email, name);
            }

            notification.success({
                message: isOrganisationRegistration
                    ? 'Registration successful! Please wait for the Credibly Admin to activate your account.'
                    : 'Registration successful! You may now login to Credibly!'
            });
            form.resetFields();
        } catch (err) {
            notification.error({ message: err.error });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.form}>
                <Tabs
                    defaultActiveKey="1"
                    activeKey={tabIndex}
                    centered
                    onChange={(idx) => setTabIndex(idx)}
                >
                    <TabPane key="1" tab="Login">
                        {renderLoginForm()}
                    </TabPane>
                    <TabPane key="2" tab="Register">
                        {renderRegisterForm()}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default observer(LoginPage);
