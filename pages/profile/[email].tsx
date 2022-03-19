import * as React from 'react';
import { useRouter } from 'next/router'
import ProfilePage from '../../src/components/ProfilePage';

const Profile: React.FC = () => {
    const router = useRouter()
    const {email}  = router.query
    return <ProfilePage email={email && email.toString()} />;
};

export default Profile;