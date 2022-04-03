import { TransactionOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { AccountType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import BaseLayout from '../BaseLayout';
import { NotFoundPage } from '../Errors/404';
import styles from './Settings.module.css';
import TransferRequest from './TransferRequest';
import Privacy from '../Privacy/Privacy';

const SettingsPage: React.FC = () => {
    const { appStore } = useStores();
    const { Sider } = Layout;

    const [generalSelected, setGeneralSelected] = React.useState(true);
    const [transferSelected, setTransferSelected] = React.useState(false);

    const handleGeneralSelected = () => {
        if (!generalSelected) {
            setGeneralSelected(true);
            setTransferSelected(false);
        }
    };

    const handleTransferSelected = () => {
        if (!transferSelected) {
            setTransferSelected(true);
            setGeneralSelected(false);
        }
    };

    return (
        <BaseLayout
            sider={
                <Sider width={'20%'} className={styles.sider}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        className={'siderMenu'}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item
                            icon={<UserOutlined />}
                            key="1"
                            onClick={() => handleGeneralSelected()}
                        >
                            General
                        </Menu.Item>

                        <Menu.Item
                            icon={<TransactionOutlined />}
                            key="2"
                            onClick={() => handleTransferSelected()}
                        >
                            Transfer Request
                        </Menu.Item>
                    </Menu>
                </Sider>
            }
        >
            <div className={styles.settingsContainer}>
                <h1>
                    Welcome to Credibly,&nbsp;
                    {appStore?.currentUser?.name.toUpperCase() || 'User'}!
                </h1>
                <p />
                {appStore.currentUser.accountType === AccountType.AWARDEE &&
                    generalSelected ? (
                        <Privacy />
                    ) : appStore.currentUser.accountType === AccountType.AWARDEE &&
                        transferSelected ? (
                            <TransferRequest />
                        ) : (
                            <NotFoundPage />
                        )}
            </div>
        </BaseLayout>
    );
};

export default observer(SettingsPage);
