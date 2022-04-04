import { Input, message, Modal } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import { useStores } from '../../../stores/StoreProvider';
import styles from './AddWorkExperienceModal.module.css';

const AddWorkExperienceModal: React.FC = () => {
    const { appStore, uiState } = useStores();
    const [position, setPosition] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');

    const uen = JSON.parse(sessionStorage.getItem('user')).uen;
    const email = window.location.search.substring(7);

    // contract takes in big number DDMMYYYY 
    // format from YYYY-MM-DD 
    const formatDate = (date: string) => {
        const dateArr = date.split('-');
        return dateArr[2] + dateArr[1] + dateArr[0];
    };

    const addExperience = async () => {
        try {
            message.loading({
                content: 'Loading...',
                key: 'workexp-msg',
                duration: 60,
            });

            if (!position || !description || !startDate) {
                message.info({
                    content: 'Please fill in all fields',
                    key: 'workexp-msg',
                });
                return;
            }

            // post to blockchain
            const res = await appStore.addWorkExperience(
                email,
                position,
                description,
                formatDate(startDate),
                uen
            );
            console.log(res);

            message.success({
                content: 'Success!',
                key: 'workexp-msg',
            });
            uiState.setModalOpen(false);
            setPosition('');
            setDescription('');
            setStartDate('');
        } catch (err) {
            console.log(err.message);
            message.error({
                content: 'Sorry, something went wrong, please try again...',
                key: 'workexp-msg',
            });
        }
    };

    return (
        <Modal
            visible={uiState.modalOpen}
            title="Add Work Experience"
            onCancel={() => uiState.setModalOpen(false)}
            onOk={addExperience}
        >
            <Input
                className={styles.input}
                placeholder="Employee Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
            />
            <Input
                className={styles.input}
                placeholder="Job Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
             <Input
                addonBefore='Start Date:'
                type="date"
                placeholder="Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
        </Modal>
    );
};

export default observer(AddWorkExperienceModal);
