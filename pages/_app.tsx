import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import StoreProvider from '../src/stores/StoreProvider';
// import 'antd/dist/antd.css';
import '../src/custom.css';
import './index.css';

export let deferredInstallPrompt = null;

const MyApp = ({ Component, pageProps }: AppProps) => {
    const [showChild, setShowChild] = React.useState(false);

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
        setShowChild(true);
    }, []);

    return (
        showChild && (
            <StoreProvider>
                <Head>
                    <meta
                        key="viewport"
                        name="viewport"
                        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
                    />
                </Head>
                <Component {...pageProps} />
            </StoreProvider>
        )
    );
};

export default MyApp;
