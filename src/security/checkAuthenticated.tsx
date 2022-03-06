/* eslint-disable react/display-name */
import * as React from 'react';
import { Observer } from 'mobx-react';
import { CookiesProvider } from 'react-cookie';
import AppStore from '../stores/AppStore';
import { Spin } from 'antd';

/**
 * Higher order component to wrap components with to check if user is authenticated 
 * before they are redirected to the page. If they are not authenticated, they will be
 * redirected to the login page
 */

export interface withCheckLoginProps {
    appStore: AppStore;
    routeToLogin?: () => void; // route to login
}

const AwaitingComponent = () => {
    return <Spin style={{ top: '50%', left: '50%', position: 'absolute' }} />;
};

const withCheckLogin = (Component: React.FC) =>
    class extends React.Component<withCheckLoginProps> {
        async componentDidMount() {
            if (typeof window == undefined) return;
        }

        render() {
            const { appStore, routeToLogin } = this.props;
            return (
                <CookiesProvider>
                    <Observer
                        render={() => {
                            switch (appStore.isAuthenticated) {
                                case 'checking':
                                    return <AwaitingComponent />;
                                case 'true':
                                    return <Component {...this.props} />;
                                default:
                                    routeToLogin && routeToLogin();
                                    return null;
                            }
                        }}
                    />
                </CookiesProvider>
            );
        }
    };

export default withCheckLogin;
