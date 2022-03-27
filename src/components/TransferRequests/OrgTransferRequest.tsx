/* eslint-disable react-hooks/exhaustive-deps */
import { Button, message, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/Table';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ApprovalType, PendingTransferRequests, UserDto } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import BaseLayout from '../BaseLayout';

const OrgTransferRequestsPage: React.FC = () => {
    const { appStore, uiState } = useStores();

    const [loading, setLoading] = React.useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<number[]>([]);
    const [pendingTransfers, setPendingTransfers] = React.useState<PendingTransferRequests[]>([]);

    async function retrieveTransferRequests() {
        let transferRequests = await appStore.getTransferRequestsByOrganisation();
        setPendingTransfers(transferRequests);
    }
    React.useEffect(() => {
        setLoading(true);
        retrieveTransferRequests()
        setLoading(false);
    }, []);

    const columns: ColumnsType<PendingTransferRequests> = [
        {
            title: 'Awardee Name',
            dataIndex: 'user',
            render: (user: UserDto) => user.name
        },
        {
            title: 'Email',
            dataIndex: 'user',
            render: (user: UserDto) => user.email
        },
        {
            title: 'New Email',
            dataIndex: 'user',
            render: (user: UserDto) => user.newEmail
        },
        {
            title: 'Supporting Documents',
            dataIndex: 'documents',
            render: (documents: { id: number, name: string }[]) =>
                documents.map(document =>
                    <>
                        <a onClick={() => getDocument(document.id)}>{document.name}</a>
                        <br />
                    </>
                )
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: PendingTransferRequests) =>
              <a onClick={() => approveTransferRequests(record.key)}>Approve</a>
            ,
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (rowKeys: number[]) => setSelectedRowKeys(rowKeys)
    }

    const getDocument = async (id: number) => {
        try {
            const { name, data } = await appStore.getRegistrationDocument(id);
            const url = window.URL.createObjectURL(new Blob([Uint8Array.from(Buffer.from(data, 'base64')).buffer]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            uiState.setError(err.error);
        }
    }

    const approveTransferRequests = async (id?: number) => {
        setLoading(true);

        try {
            const approverId = appStore.currentUser.id;
            const transferRequestIds = [].concat(...[!id ? selectedRowKeys : id]);

            await appStore.approveTransferRequests(transferRequestIds);

            if (!id) {
                setSelectedRowKeys([]);
            } else {
                setSelectedRowKeys(prevState => prevState.filter(rowKey => rowKey !== id))
            }

            retrieveTransferRequests()

            message.success('Approved transfer requests successfully!');

        } catch (err) {
            message.error(err.error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <BaseLayout>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={() => approveTransferRequests()} loading={loading}>
                    Approve
                </Button>
                <span style={{ marginLeft: 8 }}>
                    {selectedRowKeys.length > 0 && `Selected ${selectedRowKeys.length} items`}
                </span>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={pendingTransfers} />
        </BaseLayout>
    )
};

export default observer(OrgTransferRequestsPage);
