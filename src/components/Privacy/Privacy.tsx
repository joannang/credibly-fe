import { Button, Card, Table, Input, Form } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';

const Privacy: React.FC = () => {

  const [isPublic, setIsPublic] = React.useState(true);

  const testUsers = [
    {
      walletId: "12345678",
    },
    {
      walletId: "12345678",
    },
    {
      walletId: "12345678",
    },
  ]

  const columns = [
    {
      title: 'Wallet Id',
      dataIndex: 'walletId',
      key: 'walletId',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <a>Remove Access</a>
      ),
    },
  ];

  const onClickSetPrivacy = () => {
    setIsPublic(!isPublic);
  };

  const onFinish = async (values: any) => {
    const userInput = values.userInput;
    console.log(userInput)
  };

  return (
    <Card style={{ width: '100%' }}>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ display: 'inline-block', marginRight: 20 }}>Profile Visibility:</h1>
        <div style={{ display: 'inline-block', marginRight: 20 }}>{isPublic ? "PUBLIC" : "PRIVATE"}</div>
        <Button onClick={onClickSetPrivacy} type="primary">{isPublic ? "Set PRIVATE" : "Set PUBLIC"}</Button>
      </div>

      <div>
        <h1>Users With Access To Your Profile:</h1>
        <Table dataSource={testUsers} columns={columns} />
      </div>

      <div style={{ marginBottom: 30 }}>
        <h1>Grant Access To New User</h1>
        <Form onFinish={onFinish}>
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
