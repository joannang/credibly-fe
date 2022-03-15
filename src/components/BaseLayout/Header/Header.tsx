import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, Layout } from 'antd';
import { useStores } from '../../../stores/StoreProvider';
import styles from '../BaseLayout.module.css';
import { MenuOutlined, MessageOutlined } from '@ant-design/icons';

type HeaderProps = {};

export const Header: React.FC<HeaderProps> = ({}) => {
    const { uiState, appStore } = useStores();

    return (
        <Layout.Header>
            <div className={styles.header}>
                <Link href={'/dashboard'} passHref>
                    <a>
                        Credibly
                        {/* <Image
                            src="/images/c-logo-1.png"
                            alt="Credibly"
                            height={40}
                            width={40}
                        /> */}
                    </a>
                </Link>
                <div className={styles.profileContainer}>
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
                        {appStore.currentUser?.name?.charAt(0) || 'L'}
                    </Avatar>
                </div>
            </div>
        </Layout.Header>
    );
};
