import * as React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import { useStores } from '../../../stores/StoreProvider';
import styles from '../BaseLayout.module.css';
import { HeaderTabs } from './HeaderTabs';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = ({ }) => {
    const { appStore } = useStores();

    const router = useRouter();

    const onLogout = () => {
        router.push('/login');
        appStore.setCurrentUser({ name: '' });
        appStore.setIsAuthenticated('');
        sessionStorage.removeItem('authenticated');
        sessionStorage.removeItem('user');
    }

    const menu =
        <Menu>
            <Menu.Item onClick={onLogout} icon={<LogoutOutlined />}>
                Logout
            </Menu.Item>
        </Menu>

    return (
        <Layout.Header>
            <div className={styles.headerContainer}>
                <div>
                    <a href={'/dashboard'}>
                        <img src="/images/c-logo-1.png" alt="Credibly" />
                    </a>
                </div>
                <HeaderTabs />
                <div className={styles.profileContainer}>
                    <Dropdown overlay={menu} placement="bottomRight">
                        <Avatar
                            alt="Profile Image"
                            style={{
                                backgroundColor: 'white',
                                color: '#193D61',
                                fontSize: '14px',
                                cursor: 'pointer',
                            }}
                            shape="circle"
                            size={24}
                        >
                            {appStore.currentUser?.name?.charAt(0).toUpperCase() ||
                                'U'}
                        </Avatar>
                    </Dropdown>
                </div>
            </div>
        </Layout.Header>
    );
};

export default observer(Header);
