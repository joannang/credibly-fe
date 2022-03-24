import * as React from 'react';
import ManageWorkExperiences from '../src/components/ManageWorkExperiences/ManageWorkExperiencesPage';
import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const ManageWorkExperiencesPage: React.FC = () => {
    const { appStore } = useStores();

    // const withCheckLoginProps = {
    //     appStore,
    //     routeToLogin: () => redirect('/login'), // route for failed login
    // };

    // return <DashboardPage {...withCheckLoginProps} />;
    return <ManageWorkExperiences/>
};

export default ManageWorkExperiencesPage;
