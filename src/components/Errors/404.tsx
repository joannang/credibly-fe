import { Button, Image } from 'antd';
import * as React from 'react';
import { AccountType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';

export const NotFoundPage: React.FC = () => {
    const { appStore } = useStores();

    return (
        <div
            style={{
                padding: '64px 16px 16px 64px',
                textAlign: 'center',
            }}
        >
            <Image
                width={'80vh'}
                preview={false}
                src="https://img.freepik.com/free-vector/website-construction-illustration_86047-169.jpg?w=996"
            />
            <p />
            {appStore.currentUser.accountType === AccountType.ADMIN ? (
                <Button type="primary" href="/dashboard">
                    Go Home
                </Button>
            ) : appStore.currentUser.accountType ===
              AccountType.ORGANISATION ? (
                <Button type="primary" href="/groups">
                    Go Home
                </Button>
            ) : (
                <Button type="primary" href="/privacySettings">
                    Go Home
                </Button>
            )}
        </div>
    );
};
