import * as React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu } from 'antd';
import { useStores } from '../../../stores/StoreProvider';
import styles from '../BaseLayout.module.css';
import { HeaderTabs } from './HeaderTabs';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
                    <img src="/images/c-logo-1.png" alt="Credibly" />
                </div>
                <div className={styles.profileContainer}>
                    <Dropdown overlay={menu} placement="bottomRight">
                        {appStore.currentUser ?
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
                        :
                        <Link href={"/login"}><Button ghost={true} >Login</Button></Link>
                        }
                    </Dropdown>
                </div>
                <HeaderTabs />
            </div>
        </Layout.Header>
    );
};

export default observer(Header);
