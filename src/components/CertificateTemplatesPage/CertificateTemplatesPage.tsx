import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';
import styles from './CertificateTemplatesPage.module.css';
import { Layout } from 'antd';
import { Form, Button, Upload, message, Input, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import BaseLayout from '../BaseLayout';
const { Content } = Layout;

const CertificateTemplatesPage: React.FC = () => {
    const { uiState, appStore } = useStores();
    const [loading, setLoading] = React.useState<boolean>(false);

    const organisationId = 1; // Hard coded for now

    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);

        if (values.upload.length == 0) {
            message.error('Please upload an image first');
            return;
        }

        setLoading(true);
        try {
            await appStore.uploadCertificateTemplate(
                values.certificateTemplateName,
                values.upload[0]['originFileObj'],
                organisationId
            );
            message.success('Success!');
        } catch (err) {
            // uiState.setError(err.error);
            console.log(err);
            if (err) {
                message.error(err.error);
            }
        } finally {
            setLoading(false);
            setCertificateTemplates();
        }
    };

    const deleteCertificateTemplate = async (certificateName: string) => {
        try {
            await appStore.deleteCertificateTemplate(
                certificateName,
                organisationId
            );
            message.success('Success!');
        } catch (err) {
            // uiState.setError(err.error);
            console.log(err);
            if (err) {
                message.error(err.error);
            }
        } finally {
            // TOFIX
            setCertificateTemplates(); // There is some lag during deletion. Not sure if that is why this is not working here, unlike in onFinish
        }
    };

    React.useEffect(() => {
        setCertificateTemplates();
    }, []);

    const setCertificateTemplates = async () => {
        await appStore.setCertificateTemplates(organisationId);
    };

    const certificateTemplates = appStore.getCertificateTemplates();

    const uploadFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isPNG = file.type === 'image/png';
            if (!isPNG) {
                // uiState.setError("not png");
                message.error(`${file.name} is not a png file`);
            }
            return isPNG || Upload.LIST_IGNORE;
        },
    };

    const tableColumns = [
        {
            title: 'Certificate Template Name',
            dataIndex: 'certificateName',
            key: 'certificateName',
            width: 300,
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (encodedStr) => (
                <img
                    src={`data:image/png;base64,${encodedStr}`}
                    style={{ maxWidth: '10%' }}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button
                    onClick={() =>
                        deleteCertificateTemplate(record.certificateName)
                    }
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <BaseLayout>
            <div style={{ padding: '0 16px 16px 16px' }}>
                <h1>Certificate Templates</h1>

                <div className={styles.site_layout_content}>
                    <h1>Current Certificate Templates</h1>
                    <div style={{ marginBottom: '30px' }}>
                        {certificateTemplates.length != 0 && (
                            <Table
                                columns={tableColumns}
                                dataSource={certificateTemplates}
                            />
                        )}
                        {certificateTemplates.length == 0 && (
                            <div>No certificate templates found</div>
                        )}
                    </div>

                    <h1>Upload New Certificate Template</h1>
                    <Form onFinish={onFinish}>
                        <Form.Item
                            name="certificateTemplateName"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Please input your Certificate Template Name!',
                                },
                            ]}
                        >
                            <Input placeholder="Certificate Template Name" />
                        </Form.Item>
                        <Form.Item
                            name="upload"
                            valuePropName="fileList"
                            getValueFromEvent={uploadFile}
                        >
                            <Upload
                                listType="picture"
                                {...uploadProps}
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Click to upload
                                </Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                loading={loading}
                                type="primary"
                                htmlType="submit"
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </BaseLayout>
    );
};

export default observer(CertificateTemplatesPage);
