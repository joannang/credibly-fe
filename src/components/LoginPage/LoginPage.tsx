import * as React from 'react';
import { LockOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, Tabs, Radio, Upload } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../stores/StoreProvider';
import styles from './LoginPage.module.css';

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
    const { uiState, appStore } = useStores();

    const [tabIndex, setTabIndex] = React.useState<string>('1');
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
            await appStore.login(values.email, values.password);
            if (accountType === 'organisation') {
                window.location.href = '/groups';
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            uiState.setError(err.error);
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
                initialValues={{ accountType: 'organisation' }}
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
                    label={`${
                        accountType === 'organisation' ? 'Organisation' : ''
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
                    <Input />
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
        const isOrganisationRegistration =
            values.accountType === 'organisation';

        try {
            const registerRequest = {
                name: values.name,
                email: values.email,
                password: values.password,
                uen: !!values.uen ? values.uen : null,
                walletAddress: values.walletAddress,
                accountType: isOrganisationRegistration ? 1 : 2,
            };
            const userId = await appStore.register(registerRequest);

            if (isOrganisationRegistration) {
                const uploadRequest = {
                    userId,
                    documents: values.documents.map(
                        (doc: any) => doc.originFileObj
                    ),
                };
                await appStore.registerUpload(uploadRequest);
            }

            uiState.setSuccess(
                isOrganisationRegistration
                    ? 'Registration successful! Please wait for the Credibly Admin to activate your account'
                    : 'Registration successful! You may now login to Credibly!'
            );
            form.resetFields();
        } catch (err) {
            uiState.setError(err.error);
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
