import * as React from 'react';
import DashboardPage from '../src/components/Dashboard';
import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const Dashboard: React.FC = () => {
    const { appStore } = useStores();

    const withCheckLoginProps = {
        appStore,
        routeToLogin: () => redirect('/login'), // route for failed login
    };

    return <DashboardPage {...withCheckLoginProps} />;
};

export default Dashboard;
