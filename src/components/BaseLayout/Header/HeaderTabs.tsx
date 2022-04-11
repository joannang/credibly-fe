import Link from 'next/link';
import * as React from 'react';
import { AccountType } from '../../../stores/AppStore';
import styles from '../BaseLayout.module.css';
import { useStores } from '../../../stores/StoreProvider';

export const HeaderTabs = () => {
    const { appStore } = useStores();

    return (
        <>
            {appStore?.currentUser?.accountType === AccountType.ORGANISATION && (
                <div className={styles.headerTabs}>
                    <div>
                        <Link href={'/groups'} passHref>
                            Groups
                        </Link>
                    </div>
                    <div>
                        <Link href={'/certificateTemplates'} passHref>
                            Certificate Templates
                        </Link>
                    </div>
                    <div>
                        <Link href={'/employees'} passHref>
                            Manage Employees
                        </Link>
                    </div>
                </div>
            )}
            {appStore?.currentUser?.accountType === AccountType.AWARDEE && (
                <div className={styles.headerTabs}>
                    <div>
                        <Link href={'/privacySettings'} passHref>
                            Privacy Settings
                        </Link>
                    </div>
                    <div>
                        <Link
                            href={`/profile/${appStore.currentUser.email}`}
                            passHref
                        >
                            Profile
                        </Link>
                    </div>
                </div>
            )}
            {appStore?.currentUser?.accountType === AccountType.ADMIN && (
                <div className={styles.headerTabs}>
                    <div>
                        <Link href={'/dashboard'} passHref>
                            Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};
