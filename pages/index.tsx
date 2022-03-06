import * as React from 'react';
import { useEffect } from 'react';
import redirect from '../src/lib/redirect';

const Index: React.FC = () => {
    useEffect(() => {
        redirect('/login'); // default redirect
    });
    return null;
};
export default Index;
