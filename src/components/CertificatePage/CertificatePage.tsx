import { Avatar, Button, Col, Divider, Row, Space, Spin } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';
import { Image } from 'antd';
import styles from './CertificatePage.module.css';
import { CertificateDetails } from '../../stores/AppStore';
import { CheckCircleFilled, CheckCircleOutlined, FilePdfOutlined, FilePdfTwoTone, LoadingOutlined } from '@ant-design/icons';
import { redirect } from 'next/dist/server/api-utils';
import { randomHSL } from '../../helpers/helper';
import BaseLayout from '../BaseLayout';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface CertificateProps {
    cid: string;
}
const CertificatePage: React.FC<CertificateProps> = (props: CertificateProps) => {
    const { appStore } = useStores();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [certificate, setCertifcate] = React.useState<CertificateDetails>(null);

    React.useEffect(() => {
        setLoading(true);
        async function retrieveCertDetails() {
            const params = props?.cid.split('_') || [];
            let certificate = await appStore.retrieveCertificateInfo(params[0], params[1]);
            setCertifcate(certificate);
            setLoading(false);
        }
        retrieveCertDetails()
    }, []);

    const handleImageError = (e) => {
        e.target.src =
            'https://image.freepik.com/free-vector/certificate-template-vertical_1284-4551.jpg';
    };
    return (<BaseLayout>{
        !loading && certificate ?

            <div>
                <div className={styles.center} style={{
                    backgroundColor: '#f4f5fa',
                    padding: "40px"
                }}>
                    <Image height='100%' width='auto'
                    onError={handleImageError}
                        preview={{ visible: false }}
                        src={certificate.image}
                    />
                </div>

                <Row style={{ padding: "2% 15% 2% 15%" }}>
                    <Col span={18}>
                        <Row
                            style={{
                                fontWeight: 600,
                                fontSize: "250%",
                                marginBottom: "20px"
                            }}>{certificate.certificateName}
                        </Row>
                        <Row style={{
                            fontSize: "150%",
                            justifyContent: "space-between"
                        }}>
                            <Col>
                                <Space size={"middle"}>
                                    <Avatar
                                        alt='1234'
                                        style={{
                                            backgroundColor: randomHSL(),
                                            color: '#193D61',
                                            cursor: 'pointer',
                                        }}
                                        shape="circle"
                                        size={50}
                                    >
                                        {certificate.awardeeName.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                                    </Avatar>
                                    {certificate.awardeeName.toUpperCase()}
                                </Space>
                            </Col>
                            <Col>
                                <Space size={"middle"}>
                                    <Avatar
                                        alt='123'
                                        style={{
                                            backgroundColor: randomHSL(),
                                            color: '#193D61',
                                            cursor: 'pointer',
                                        }}
                                        shape="circle"
                                        size={50}
                                    >
                                        {certificate.orgName.charAt(0)}
                                    </Avatar>
                                    {certificate.orgName.toUpperCase()}
                                    <CheckCircleFilled style={{
                                        color: "#1873bc"
                                    }}></CheckCircleFilled>
                                </Space></Col>
                        </Row>
                        <Divider style={{ backgroundColor: "#ececec" }}></Divider>
                        <Row>
                            {certificate.description}
                        </Row>
                        <Row>
                            <Col style={{ margin: "5% 0" }}>
                                <div>ISSUED ON</div>
                                {certificate.dateOfIssue}
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6}>
                        <Row>
                            <Button ghost style={{
                                borderColor: '#737373',
                                color: '#737373',
                            }} type="primary" icon={<FilePdfOutlined />} size={"large"}>
                                Download
                            </Button>
                        </Row>
                    </Col>
                </Row>
            </div>
            : !loading ?
                <div
                    style={{
                        padding: '64px 16px 16px 64px',
                        textAlign: 'center',
                    }}
                >
                    Certificate not found!
                </div>
                :
                <Spin size='large' style={{
                    position: "fixed", /* or absolute */
                    top: "50%",
                    left: '50%'
                }} indicator={antIcon} />}
    </BaseLayout>
    )
};

export default observer(CertificatePage);
