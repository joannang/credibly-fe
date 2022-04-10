import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    List,
    Row,
    Skeleton,
    Space,
    Spin,
    Tabs,
} from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';
import { Image } from 'antd';
import {
    CaretRightFilled,
    CheckCircleFilled,
    CheckCircleOutlined,
    FilePdfOutlined,
    FilePdfTwoTone,
    LoadingOutlined,
} from '@ant-design/icons';
import redirect from '../../lib/redirect';
import { randomHSL } from '../../helpers/helper';
import { Awardee, CertificateDetails, WorkExperience } from '../../stores/AppStore';
import Meta from 'antd/lib/card/Meta';
import styles from './ProfilePage.module.css';
import { useRouter } from 'next/router';
import Title from 'antd/lib/typography/Title';
import Link from 'next/link';
import BaseLayout from '../BaseLayout';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { TabPane } = Tabs;

interface ProfileProps {
    email: string;
}
const ProfilePage: React.FC<ProfileProps> = (props: ProfileProps) => {
    const { appStore } = useStores();
    const router = useRouter();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [awardee, setAwardee] = React.useState<Awardee>();
    const [certificates, setCertifcates] = React.useState<CertificateDetails[]>([]);
    const [workExperiences, setWorkExperiences] = React.useState<WorkExperience[]>([]);

    React.useEffect(() => {
        setLoading(true);
        async function retrieveProfileInfo() {
            let awardee = await appStore.retrieveAwardee(props.email);
            let certificates = await appStore.retrieveProfileDetails(
                props.email
            );
            let experiences = await appStore.getWorkExperiences(
                props.email
            );
            setAwardee(awardee);
            setWorkExperiences(experiences);
            setCertifcates(certificates);
            setLoading(false);
        }
        if (props?.email) {
            retrieveProfileInfo();
        }
    }, [props.email]);

    const handleImageError = (e) => {
        e.target.src =
            'https://image.freepik.com/free-vector/certificate-template-vertical_1284-4551.jpg';
    };

    const formatDate = (date) => {
        const decimal = parseInt(date._hex, 16).toString();
        let options: Intl.DateTimeFormatOptions  = { year: "numeric", month: 'long'};
        var formattedDate;
        if (decimal.length > 7) {
            formattedDate = new Date(parseInt(decimal.slice(4)),parseInt(decimal.slice(2, 4)),parseInt(decimal.slice(0, 2)));
        } else {
            formattedDate = new Date(parseInt(decimal.slice(3)),parseInt(decimal.slice(1,3)),parseInt(decimal.slice(0,1)));
        }
        return ((new Date(formattedDate)).toLocaleDateString("en-GB", options));
        
    };
    return (
        <BaseLayout>
            {!loading && awardee ?
                <Col>
                    <Row style={{ margin: '0% 8%' }}>
                        <Avatar
                            alt="1234"
                            style={{
                                marginTop: '10px',
                                backgroundColor: randomHSL(),
                                color: '#193D61',
                                cursor: 'pointer',
                            }}
                            shape="circle"
                            size={50}
                        >
                            {awardee?.name
                                .split(' ')
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join('')}
                        </Avatar>
                        <Col style={{ marginLeft: '15px' }}>
                            <p
                                style={{
                                    fontSize: '250%',
                                    fontWeight: 600,
                                    margin: '0',
                                }}
                            >
                                {awardee?.name}
                            </p>
                            <p
                                style={{
                                    fontSize: '110%',
                                    fontWeight: 400,
                                    color: '#737373',
                                }}
                            >
                                {`${certificates?.length || 0} Credentials`}
                            </p>
                        </Col>
                    </Row>
                    <Divider style={{ backgroundColor: '#ececec' }}></Divider>

                    <Tabs defaultActiveKey="1" style={{ margin: '0 5%', padding: '0 2%' }} tabBarStyle={{fontWeight: '600' }}>
                        <TabPane tab="Credentials" key="1">
                            <List
                                grid={{ gutter: 16, sm:3, md:4, xl:5 }}
                                dataSource={certificates}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Card
                                            onClick={() =>
                                                router.push(
                                                    `/certificate/${item.certificateId}`
                                                )
                                            }
                                            className={styles.box}
                                            hoverable
                                            cover={
                                                <div style={{
                                                    backgroundColor: '#f4f5fa',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '10px', overflow: "hidden", height: "300px",
                                                    position: 'relative'
                                                }}>
                                                    <img
                                                        onError={handleImageError}
                                                        className={styles.image}
                                                        alt="example"
                                                        src={item.image}
                                                    />
                                                </div>
                                            }
                                        >
                                            <Title level={3} ellipsis={{ rows: 2, expandable: false }}>
                                                {item.certificateName}
                                            </Title>
                                            <Title style={{ color: '#4a4c4f' }} level={5}>{`${item.dateOfIssue}`}</Title>
                                            <Title level={5}>{item.orgName}</Title>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                        <TabPane tab="Work Experiences" key="2">
                            <List
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={workExperiences}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Card
                                            className={styles.exp}
                                        >
                                            <Title level={3} >
                                                {item.position}
                                            </Title>
                                            <Title level={4}>{item.organisation}</Title>
                                            <Title style={{ color: '#4a4c4f' }} level={5} ellipsis={{ rows: 2, expandable: true, symbol: '...' }}>{`${item.description}`}</Title>
                                            <Title style={{ color: '#4a4c4f' }} level={5}>{`${formatDate(item.startDate)} - ${item.end && formatDate(item.endDate) || "present"}`}</Title>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                    </Tabs>

                    ,
                </Col>
                : !loading ? (
                    <div
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <Col>
                            <div style={{ textAlign: 'center', fontSize: "150%", fontWeight: "700" }}>
                                Whoops! Looking at the wrong place?
                            </div>
                            <Image
                                width={'80vh'}
                                preview={false}
                                src="/images/not-found.png"
                            />
                        </Col>

                    </div>

                ) : (
                    <Skeleton style={{ padding: "2% 8%" }} loading={loading} avatar active>
                        <Meta
                            avatar={<Avatar />}
                            title="Card title"
                            description="This is the description"
                        />
                    </Skeleton>
                )}
        </BaseLayout>
    )
};

export default observer(ProfilePage);
