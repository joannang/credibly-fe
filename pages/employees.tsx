import * as React from 'react';
import ManageEmployees from '../src/components/ManageWorkExperiences/ManageEmployees';

import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const EmployeesPage: React.FC = () => {
    const { appStore } = useStores();

    const withCheckLoginProps = {
        appStore,
        routeToLogin: () => redirect('/login'), // route for failed login
    };

    return <ManageEmployees {...withCheckLoginProps} />;
};

export default EmployeesPage;
