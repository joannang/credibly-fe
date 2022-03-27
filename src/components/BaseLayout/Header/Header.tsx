import * as React from 'react';
import { Avatar, Button, Layout } from 'antd';
import { useStores } from '../../../stores/StoreProvider';
import styles from '../BaseLayout.module.css';
import { HeaderTabs } from './HeaderTabs';
import { observer } from 'mobx-react';
import Link from 'next/link';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = ({ }) => {
    const { appStore } = useStores();

    return (
        <Layout.Header>
            <div className={styles.headerContainer}>
                <div>
                    <img src="/images/c-logo-1.png" alt="Credibly" />
                </div>
                <div className={styles.profileContainer}>
                    {appStore.currentUser ? <Avatar
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
                    <Link href={"/login"}><Button ghost={true} >Login</Button></Link>}
                </div>
                <HeaderTabs />
            </div>
        </Layout.Header>
    );
};

export default observer(Header);
