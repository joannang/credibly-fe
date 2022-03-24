import * as React from 'react';
import CreateCertificates from '../src/components/CreateCertificates/CreateCredentials'; 
import redirect from '../src/lib/redirect';
import { useStores } from '../src/stores/StoreProvider';

const CreateCertsPage: React.FC = () => {
    const { appStore } = useStores();

    // const withCheckLoginProps = {
    //     appStore,
    //     routeToLogin: () => redirect('/login'), // route for failed login
    // };

    // return <DashboardPage {...withCheckLoginProps} />;
    return <CreateCertificates/>
};

export default CreateCertsPage;
