import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    List,
    Row,
    Space,
    Spin,
} from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';
import { Image } from 'antd';
import {
    CheckCircleFilled,
    CheckCircleOutlined,
    FilePdfOutlined,
    FilePdfTwoTone,
    LoadingOutlined,
} from '@ant-design/icons';
import redirect from '../../lib/redirect';
import { randomHSL } from '../../helpers/helper';
import { Awardee, CertificateDetails } from '../../stores/AppStore';
import Meta from 'antd/lib/card/Meta';
import styles from './ProfilePage.module.css';
import { useRouter } from 'next/router';
import Title from 'antd/lib/typography/Title';
import Link from 'next/link';
import BaseLayout from '../BaseLayout';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface ProfileProps {
    email: string;
}
const ProfilePage: React.FC<ProfileProps> = (props: ProfileProps) => {
    const { appStore } = useStores();
    const router = useRouter();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [awardee, setAwardee] = React.useState<Awardee>();
    const [certificates, setCertifcates] = React.useState<CertificateDetails[]>(
        []
    );

    React.useEffect(() => {
        setLoading(true);
        async function retrieveProfileCertificates() {
            let awardee = await appStore.retrieveAwardee(props.email);
            let certificates = await appStore.retrieveProfileDetails(
                props.email
            );
            setAwardee(awardee);
            setCertifcates(certificates);
        }
        if (props?.email) {
            retrieveProfileCertificates();
            setLoading(false);
        }
    }, [props.email]);

    const handleImageError = (e) => {
        e.target.src =
            'https://image.freepik.com/free-vector/certificate-template-vertical_1284-4551.jpg';
    };

    return (
        <BaseLayout>
            {!loading && awardee ?
                <Col>
                    <Row style={{ margin: '5% 8% 0' }}>
                        <Avatar
                            alt="1234"
                            style={{
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
                        <Col style={{ margin: '0px 0px 0px 10px', padding: '0px' }}>
                            <p
                                style={{
                                    fontSize: '200%',
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
                                {`${certificates.length} Credentials`}
                            </p>
                        </Col>
                    </Row>
                    <Divider style={{ backgroundColor: '#ececec' }}></Divider>
                    <List
                        style={{ margin: '0 8% 0 8%' }}
                        grid={{ gutter: 16, column: 4 }}
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
                                        <img
                                            onError={handleImageError}
                                            style={{
                                                backgroundColor: '#f4f5fa',
                                                height: '80%',
                                                objectFit: 'contain',
                                                borderRadius: '10px',
                                                border: '1px solid #ccc',
                                                padding: '10%',
                                            }}
                                            alt="example"
                                            src={item.imageUrl}
                                        />
                                    }
                                >
                                    <Meta
                                        className={styles.meta}
                                        title={
                                            <Title level={4} ellipsis={true}>
                                                {item.certificateName}
                                            </Title>
                                        }
                                        description={item.orgName}
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                    ,
                </Col>
                : !loading ? (
                    <div
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <Col>
                            <div style={{textAlign:'center', fontSize: "150%", fontWeight: "700"}}>
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
                    <Spin
                        size="large"
                        style={{
                            position: 'fixed' /* or absolute */,
                            top: '50%',
                            left: '50%',
                        }}
                        indicator={antIcon}
                    />
                )}
        </BaseLayout>
    )
};

export default observer(ProfilePage);
