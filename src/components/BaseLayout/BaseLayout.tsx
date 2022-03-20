import * as React from 'react';
import Head from 'next/head';
import { observer } from 'mobx-react';
import { Layout } from 'antd';
import styles from './BaseLayout.module.css';
import Header from './Header';

const { Content } = Layout;

export type BaseLayoutProps = {
    title?: string;
    pageTitle?: string;
    sider?: React.ReactNode;
};

const BaseLayout: React.FC<BaseLayoutProps> = ({
    children,
    title = 'Credibly',
    pageTitle,
    sider,
}) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Layout>
                <Header />
                <Layout className={!sider ? styles.layoutContent : null}>
                    {sider}
                    {!sider ? (
                        <div className={styles.layoutContentHeader}>
                            {pageTitle != null && pageTitle.trim() != '' && (
                                <div>{pageTitle}</div>
                            )}
                        </div>
                    ) : null}
                    {children ? (
                        <Content
                            className={sider ? styles.layoutContent : null}
                        >
                            {children}
                        </Content>
                    ) : (
                        <> </>
                    )}
                </Layout>
            </Layout>
        </>
    );
};

export default observer(BaseLayout);
