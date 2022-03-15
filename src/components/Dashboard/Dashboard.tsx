import { observer } from 'mobx-react';
import * as React from 'react';
import checkAuthenticated from '../../security/checkAuthenticated';
import { AccountType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import PendingAccounts from './PendingAccounts';

const DashboardPage: React.FC = () => {
    const { appStore } = useStores();

    return (
        <div>
            {appStore.currentUser.accountType === AccountType.ADMIN && <PendingAccounts />}
        </div>
    )
};

export default checkAuthenticated(observer(DashboardPage));
