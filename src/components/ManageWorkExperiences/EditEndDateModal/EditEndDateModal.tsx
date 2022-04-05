import { Input, message, Modal, Spin } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import { useStores } from '../../../stores/StoreProvider';
import styles from './EditEndDateModal.module.css';

const EditEndDateModal: React.FC = () => {
    const { uiState, appStore } = useStores();
    const { position, endDate } = uiState.editableUser;
    const [updatableEndDate, setUpdatableEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const email = window.location.search.substring(7);
    const uen = JSON.parse(sessionStorage.getItem('user')).uen;

    const updateEndDate = async () => {
        setLoading(true);
        if (!compareDates(updatableEndDate)) {
            message.error({
                content: 'End Date should be after the Start Date',
            })
            setLoading(false);
            return;
        }
        const res = await appStore.endWorkExperience(
            email,
            extractParams(position).position,
            formatEndDate(updatableEndDate),
            uen
        );
        console.log(res);
        setTimeout(() => { // to give blockchain some time to update
            setLoading(false);
            uiState.setToggle(!uiState.toggle);
            uiState.setSecondaryModalOpen(false);
        }, 5000);
    };

    const extractParams = (item: string) => {
        const workList = item.toString().split(',');
        const experience = {
            organisation: workList[0],
            position: workList[1],
            description: workList[2],
            startDate: workList[3] ? formatStartDate(workList[3]) : workList[3],
        };
        return experience;
    };

    const formatStartDate = (decimal) => {
        // logic to format the DDMMYYYY
        if (decimal.length > 7) {
            const formattedDate = [
                decimal.slice(0, 2),
                decimal.slice(2, 4),
                decimal.slice(4),
            ].join('-');
            return formattedDate;
        } else {
            const formattedDate = [
                '0' + decimal.slice(0, 1),
                decimal.slice(1, 3),
                decimal.slice(3),
            ].join('-');
            return formattedDate;
        }
    };

    const formatEndDate = (date: string) => {
        const dateArr = date.split('-');
        return dateArr[2] + dateArr[1] + dateArr[0];
    };

    const compareDates = (end: string) => {
        const endDate = new Date(end.replaceAll("-", "/"));
        const startList = extractParams(position).startDate.split('-');
        const formattedStart = [
            startList[1],
            startList[0],
            startList[2]
        ].join('/')
        const startDate = new Date(formattedStart);
        console.log(endDate, startDate)
        if (endDate <= startDate) {
            return false;
        } else {
            return true;
        }
    }

    return (
        <Modal
            visible={uiState.secondaryModalOpen}
            title="Edit Work Experience End Date"
            onCancel={() => uiState.setSecondaryModalOpen(false)}
            onOk={updateEndDate}
        >
            {loading ? (
                <Spin className={styles.spin} />
            ) : (
                <div>
                    <Input
                        disabled
                        addonBefore="Position"
                        className={styles.input}
                        value={extractParams(position).position}
                    />
                    <Input
                        disabled
                        addonBefore="Start Date"
                        className={styles.input}
                        value={extractParams(position).startDate}
                    />
                    <Input
                        addonBefore="End Date"
                        type="date"
                        className={styles.input}
                        defaultValue={endDate}
                        onChange={(e) => setUpdatableEndDate(e.target.value)}
                    />
                </div>
            )}
        </Modal>
    );
};

export default observer(EditEndDateModal);
