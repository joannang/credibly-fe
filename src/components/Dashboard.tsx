import { observer } from 'mobx-react';
import * as React from 'react';
import checkAuthenticated from '../security/checkAuthenticated';
import { useStores } from '../stores/StoreProvider';

const DashboardPage: React.FC = () => {
    const { appStore } = useStores();

    return (
        <div>

        </div>
    )
};

export default checkAuthenticated(observer(DashboardPage));
