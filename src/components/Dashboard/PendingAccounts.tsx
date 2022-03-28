/* eslint-disable react-hooks/exhaustive-deps */
import { Button, notification, Table } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ApprovalType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';

const PendingAccounts: React.FC = () => {
  const { appStore } = useStores();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<number[]>([]);

  React.useEffect(() => {
    setLoading(true);
    appStore.setPendingApprovalsList();
    setLoading(false);
  }, []);

  const columns = [
    {
      title: 'Organisation Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Unique Entity Number',
      dataIndex: 'uen',
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
      render: (text: string, record: ApprovalType) =>
        <a onClick={() => approveUsers(record.key)}>Approve</a>
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
      notification.error({ message: err.error });
    }
  }

  const approveUsers = async (id?: number) => {
    setLoading(true);

    try {
      const approverId = appStore.currentUser.id;
      const userIds = [].concat(...[!id ? selectedRowKeys : id]);

      await appStore.approveAccounts(approverId, userIds);

      if (!id) {
        setSelectedRowKeys([]);
      } else {
        setSelectedRowKeys(prevState => prevState.filter(rowKey => rowKey !== id))
      }

      appStore.setPendingApprovalsList();

      notification.success({ message: 'Successfully approved users!' });

    } catch (err) {
      notification.error({ message: err.error });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={() => approveUsers()} loading={loading}>
          Approve
        </Button>
        <span style={{ marginLeft: 8 }}>
          {selectedRowKeys.length > 0 && `Selected ${selectedRowKeys.length} items`}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={appStore.pendingApprovalList} />
    </div>
  )
};

export default observer(PendingAccounts);
