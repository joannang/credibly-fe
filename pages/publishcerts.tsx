import * as React from 'react';
import PublishCertificates from '../src/components/CreateCertificates/PublishCertificates'; 
import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const PublishCertsPage: React.FC = () => {
    const { appStore } = useStores();

    // const withCheckLoginProps = {
    //     appStore,
    //     routeToLogin: () => redirect('/login'), // route for failed login
    // };

    // return <DashboardPage {...withCheckLoginProps} />;
    return <PublishCertificates/>
};

export default PublishCertsPage;
