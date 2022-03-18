import { Button, Card, Col, Row, Typography } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStores } from '../../stores/StoreProvider';
import styles from './ManageWorkExperiences.module.css';

const ManageWorkExperiences: React.FC = () => {
    const { appStore } = useStores();
    const { Text } = Typography;

    // TODO: update backend to have work experiences details
    // position, company, start and end date, location(?)

    const testData = [
        {
            id: 1,
            position: 'Software Engineer',
            company: 'Shopee',
            startDate: 'Dec 2021',
            endDate: 'Feb 2022',
            name: 'Fred Yeo',
        },
        {
            id: 2,
            position: 'Data Scientist',
            company: 'Shopee',
            startDate: 'Apr 2020',
            endDate: 'Nov 2021',
            name: 'Alice Lee',
        },
        {
            id: 3,
            position: 'Data Analyst',
            company: 'Shopee',
            startDate: 'Apr 2020',
            endDate: 'Jan 2022',
            name: 'George Tan',
        },
    ];

    const WorkCard = ({ experience }) => (
        <Card hoverable key={experience.id + Math.random()}>
            <Card.Meta
                className={styles.meta}
                title={experience.name}
            />
            {experience.company + ' • ' + experience.position}
            <br/>
            <Text type="secondary">
                {experience.startDate} - {experience.endDate}
            </Text>
        </Card>
    );

    const CardList = () => {
        const items = testData.map((exp, index) => {
            return (
                <Col xs={24} sm={12} md={8} xl={6} key={index}>
                    <WorkCard experience={exp} />
                </Col>
            );
        });
        return (
            <Row gutter={[15, 15]} className={styles.rowContainer}>
                {items}
            </Row>
        );
    };

    return (
        <div>
            <div className={styles.buttonContainer}>
                <Button>Add new work experience</Button>
            </div>
            <div className={styles.cardsContainer}>
                <CardList />
            </div>
        </div>
    );
};

export default observer(ManageWorkExperiences);
