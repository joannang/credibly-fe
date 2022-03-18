import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../stores/StoreProvider';

const ManageCertificates: React.FC = () => {
    const { appStore } = useStores();

    return (
        <div>

        </div>
    )
};

export default observer(ManageCertificates);
