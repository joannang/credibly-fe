import { Button, Card, Table, Input, Form, notification } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';

const Privacy: React.FC = () => {
  const { uiState, appStore } = useStores();

  const [isProfileVisible, setIsProfileVisible] = React.useState<boolean>(true);
  const [authorisedUsers, setAuthorisedUsers] = React.useState<Array<string>>([]);

  React.useEffect(() => {
    getProfileVisibility();
    getAuthorisedUsers()
  }, []);

  const getProfileVisibility = async () => {
    const isVisible = await appStore.getProfileVisibility();
    setIsProfileVisible(isVisible);
  };

  const getAuthorisedUsers = async () => {
    let authorisedUsers = await appStore.getAuthorisedUsers();
    authorisedUsers = authorisedUsers.map(walletAddress => ({ walletAddress: walletAddress }))
    setAuthorisedUsers(authorisedUsers)
  };

  const columns = [
    {
      title: 'Wallet Address',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button key={record} onClick={() => onClickRemoveAccess(record)} type="primary">Remove Access</Button>
      ),
    },
  ];

  const onClickSetProfileVisibility = async () => {
    await appStore.setProfileVisibility(!isProfileVisible);
    notification.success({
      message: 'Success! Please wait until the transaction has completed before refreshing the page to see your updated privacy settings.',
    });
  };

  const onFinishAddAccess = async (values: any) => {
    const authorisedUserWalletAddress = values.userInput;
    await appStore.addAuthorisedUser(authorisedUserWalletAddress);
    notification.success({
      message: 'Success! Please wait until the transaction has completed before refreshing the page to see your updated privacy settings.',
    });
  };

  const onClickRemoveAccess = async (record) => {
    const authorisedUserWalletAddress = record.walletAddress;
    await appStore.removeAuthorisedUser(authorisedUserWalletAddress);
    notification.success({
      message: 'Success! Please wait until the transaction has completed before refreshing the page to see your updated privacy settings.',
    });
  };

  return (
    <Card style={{ width: '100%' }}>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ display: 'inline-block', marginRight: 20 }}>Profile Visibility:</h1>
        <div style={{ display: 'inline-block', marginRight: 20 }}>{isProfileVisible ? "PUBLIC" : "PRIVATE"}</div>
        <Button onClick={onClickSetProfileVisibility} type="primary">{isProfileVisible ? "Set PRIVATE" : "Set PUBLIC"}</Button>
      </div>

      <div>
        <h1>Users With Access To Your Profile:</h1>
        <Table dataSource={authorisedUsers} columns={columns} />
      </div>

      <div style={{ marginBottom: 30 }}>
        <h1>Grant Access To New User</h1>
        <Form onFinish={onFinishAddAccess}>
          <Form.Item
            name="userInput">
            <Input placeholder="Wallet Id" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">Grant Access</Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default observer(Privacy);
