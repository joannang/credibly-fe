import { Button, Descriptions, Empty, PageHeader, Table } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { AwardeeType } from '../../stores/AppStore';
import { useStores } from '../../stores/StoreProvider';
import styles from './CreateCredentials.module.css';
import { create } from 'ipfs-http-client';

const projectId = "26bbuL0MXuph9BdyJbp4ZefpS34";
const projectSecret = "2263bf12ad5bbe8ac4a1106387fe5737";
const auth = 'Basic ' + Buffer.from(projectId + ":" + projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

const PublishCertificates: React.FC = () => {
    const { appStore } = useStores();
    const [awardees, setAwardees] = useState<AwardeeType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // get awardees in the awardeeGroup to populate table
    useEffect(() => {
        getAwardees();
    }, []);

    const getAwardees = async () => {
        const groupId = 1; // TODO: implement
        const awardees = await appStore.getAwardeesFromGroup(groupId);

        setAwardees(awardees);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
    ];

    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // create certificates and put on ipfs
    const publishCreds = async () => {
        // logic
        const certName = 'LEAD'; // TODO: change with implementation
        const orgId = 1; // TODO: change

        const awardeeNames = [];
        for (let i = 0; i < selectedRowKeys.length; i++) {
            awardees.map((awardee) => {
                if (awardee.key == selectedRowKeys[i]) {
                    awardeeNames.push(awardee.name);
                }
            });
        }

        try {
            const response = await appStore.generateCertificates(
                certName,
                orgId,
                awardeeNames
            );
            console.log(response);
            for (let i = 0; i < response.length; i++) {
                const encodedImg = response[i].encodedCertificate;
                // const res = decodeBase64Image(encodedImg);
                // console.log(res);

                const { path } = await client.add(Buffer.from(encodedImg));

                const bcResp: any = await appStore.createCertificateNFT(path);
                console.log(bcResp);

                // const retrieveResp = await appStore.retrieveCertificateNFT(value);

                const chunks = [];
                for await (const chunk of client.cat(path)) {
                    chunks.push(chunk);
                }
                console.log(Buffer.concat(chunks).toString());
            }
            // todo: after successful publish, mark those creds as published?

        } catch (err) {
            console.log(err.message);
        }
        // success!
    };

    function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
          response: any = {};
      
        if (matches.length !== 3) {
          return new Error('Invalid input string');
        }
      
        response.type = matches[1];
        response.data = Buffer.from(matches[2], 'base64');
      
        return response;
      }

    return (
        <div>
            <div className={styles.container}>
                <PageHeader
                    title="Create Credentials"
                    subTitle="Step 2 of 2"
                    extra={[
                        <Button
                            key="1"
                            disabled={
                                selectedRowKeys.length == 0 ? true : false
                            }
                            onClick={publishCreds}
                        >
                            Publish Credentials
                        </Button>,
                    ]}
                >
                    <Descriptions size="small">
                        <Descriptions.Item>
                            Unpublished Credentials
                        </Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                {awardees && awardees.length !== 0 ? (
                    <Table
                        rowSelection={rowSelection}
                        dataSource={awardees}
                        columns={columns}
                    />
                ) : (
                    <Empty description="All available credentials have been published" />
                )}
            </div>
            <img src={""}/>
        </div>
    );
};

export default observer(PublishCertificates);
