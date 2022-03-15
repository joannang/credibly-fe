import * as React from 'react';
import Head from 'next/head';
import { observer } from 'mobx-react';
import { useStores } from '../../stores/StoreProvider';
import { Layout } from 'antd';
import { Header } from './Header/Header';

import styles from './BaseLayout.module.css';

const { Content } = Layout;

export type BaseLayoutProps = {
    title?: string;
    pageTitle?: string;
    header?: React.ReactNode;
};

const BaseLayout: React.FC<BaseLayoutProps> = ({
    children,
    title = 'Credibly',
    pageTitle,
    header,
}) => {
    const { uiState, appStore } = useStores();
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Layout>
                <Header />
                <Layout className={!header ? styles.layoutContent : null}>
                    {header}
                    {!header ? (
                        <div className={styles.layoutContentHeader}>
                            {pageTitle != null && pageTitle.trim() != '' && (
                                <div>{pageTitle}</div>
                            )}
                        </div>
                    ) : null}
                    {children ? (
                        <Content
                            className={header ? styles.layoutContent : null}
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
