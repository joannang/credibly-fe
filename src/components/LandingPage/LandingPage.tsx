import * as React from 'react';
import { UserOutlined, } from '@ant-design/icons';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '../../stores/StoreProvider';
import styles from './LandingPage.module.css';

const { Text } = Typography;

const LandingPage: React.FC = () => {
    const { uiState, appStore } = useStores();

    const [loading, setLoading] = React.useState<boolean>(false);

    const searchResults = appStore.getSearchResults();

    const onSearchFinish = async (values: any) => {
        const userInput = values.userQuery;
        try {
            await appStore.setSearchResults(userInput);
            message.success('Success!');
        } catch (err) {
            // uiState.setError(err.error);
            console.log(err);
            if (err) {
                message.error(err.error);
            }
        } finally {
            setLoading(false);
        }
    };

    const renderSearchForm = () => (
        <div>
            <h2>Profile Search</h2>
            <Form initialValues={{ remember: true }} onFinish={onSearchFinish}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Form.Item
                        name="userQuery"
                        rules={[
                            {
                                required: true,
                                message: 'Please input something in the search box!',
                            },
                        ]}
                        style={{ flex: 1, paddingRight: 10 }}
                    >
                        <Input
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder="Please enter user's email"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            loading={loading}
                            type="primary"
                            htmlType="submit"
                        >
                            Search
                    </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );

    const onClickSearchCard = (awardeeId: string) => {
        // TODO
        // Find out how to pass awardeeId to certificates page
        console.log(awardeeId);
    }

    const SearchCard = ({ awardee }) => (
        <Card hoverable key={awardee.awardeeId + Math.random()} onClick={() => onClickSearchCard(awardee.awardeeId)}>
            <Card.Meta className={styles.meta} title={awardee.awardeeName} />
            <Text>{awardee.awardeeEmail}</Text>
        </Card>
    );

    const renderSearchResults = () => (
        <div style={{ width: '100%', }}>
            <div style={{ marginBottom: 20 }}>
                <h3>Search Results</h3>
                {searchResults.length != 0 ? searchResults.map((awardee, index) => {
                    return (<SearchCard awardee={awardee} key={index} />);
                }) : <div>No results</div>}
            </div>
        </div>
    );

    const onClickLogin = () => (
        window.location.href = '/login'
    );

    return (
        <div className={styles.root}>
            <div className={styles.form}>
                <div style={{ marginBottom: 30 }}>
                    <h1>Welcome to Credibly!</h1>
                    <div>To begin, either
                    {
                            <Button
                                type="primary"
                                onClick={onClickLogin}
                                size="small"
                                style={{ marginLeft: 5, marginRight: 5 }}
                            >
                                Login
                        </Button>
                        }
                    or search for a user below to view their certificates and work experiences.</div>
                </div>

                <div style={{ marginBottom: 30 }}>
                    {renderSearchForm()}
                    {searchResults.length != 0
                        && renderSearchResults()}
                </div>
            </div>
        </div>
    );
};

export default observer(LandingPage);