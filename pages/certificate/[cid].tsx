import * as React from 'react';
import CertificatePage from '../../src/components/CertificatePage';
import { useRouter } from 'next/router'

const Certificate: React.FC = () => {
    const router = useRouter()
    const { cid } = router.query
    console.log(cid)
    
    return <CertificatePage cid={cid && cid.toString()} />;
};

export default Certificate;