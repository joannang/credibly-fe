import { observer } from 'mobx-react';
import * as React from 'react';
import checkAuthenticated from '../../security/checkAuthenticated';
import { AccountType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import BaseLayout from '../BaseLayout';
import { NotFoundPage } from '../Errors/404';
import PendingAccounts from './PendingAccounts';

const DashboardPage: React.FC = () => {
    const { appStore } = useStores();

    return (
        <BaseLayout>
            <div style={{ padding: '0 16px 16px 16px' }}>
                <h1>
                    Welcome to Credibly,&nbsp;
                    {appStore?.currentUser?.name.toUpperCase() || 'User'}!
                </h1>
                <p />
                {appStore.currentUser.accountType === AccountType.ADMIN ? (
                    <PendingAccounts />
                ) : (
                    <NotFoundPage />
                )}
            </div>
        </BaseLayout>
    );
};

export default checkAuthenticated(observer(DashboardPage));
