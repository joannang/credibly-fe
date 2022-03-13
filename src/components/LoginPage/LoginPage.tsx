import * as React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../stores/StoreProvider';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
    const { uiState, appStore } = useStores();

    const [loading, setLoading] = React.useState<boolean>(false);

    const onFinish = async (values: any) => {

        setLoading(true);

        try {
            const data = await appStore.login(values.email, values.password);
            const { email, walletAddress, accountType, token } = data;
            appStore.setIsAuthenticated('true');
            appStore.setCurrentUser({ email, walletAddress, accountType, token });
            window.location.href = '/home';
        } catch (err) {
            uiState.setError(err.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.login}>
                <Form
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button loading={loading} type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

export default observer(LoginPage);
