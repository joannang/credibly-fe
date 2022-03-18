import * as React from 'react';
import GroupsPage from '../src/components/Groups';
import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const Groups: React.FC = () => {
    const { appStore } = useStores();

    const withCheckLoginProps = {
        appStore,
        routeToLogin: () => redirect('/login'), // route for failed login
    };

    return <GroupsPage {...withCheckLoginProps} />;
};

export default Groups;
