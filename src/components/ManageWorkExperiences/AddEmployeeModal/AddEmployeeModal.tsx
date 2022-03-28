import { Input, message, Modal } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import { AwardeeType } from '../../../stores/AppStore';
import { useStores } from '../../../stores/StoreProvider';
import styles from './AddEmployeeModal.module.css';

const AddEmployeeModal: React.FC = () => {
    const { appStore, uiState } = useStores();
    const [employeeEmail, setEmployeeEmail] = useState('');
    const [employeeName, setEmployeeName] = useState('');

    const orgId = JSON.parse(sessionStorage.getItem('user')).id;
    const uen = JSON.parse(sessionStorage.getItem('user')).uen;

    const addEmployee = async () => {
        try {
            message.loading({
                content: 'Loading...',
                key: 'employee-msg',
                duration: 60,
            });

            if (!employeeName || !employeeEmail) {
                message.info({
                    content: 'Please fill in both fields',
                    key: 'employee-msg',
                })
                return;
            } else if (!validateEmail(employeeEmail)) {
                message.info({
                    content: 'Please key in a valid email',
                    key: 'employee-msg',
                })
                return;
            };

            const awardee: AwardeeType = {
                name: employeeName,
                email: employeeEmail,
            };

            // post to backend awardee table
            const res = await appStore.createAwardees(orgId, [awardee]);
            console.log(res);

            // post to blockchain
            const resp = await appStore.addAwardeeToOrganisation(
                uen,
                employeeEmail,
                employeeName
            );
            console.log(resp);

            message.success({
                content: 'Success!',
                key: 'employee-msg',
            })
            uiState.setModalOpen(false);
            setEmployeeEmail('');
            setEmployeeName('');
            uiState.setEmployeesUpdated(!uiState.employeesUpdated);
        } catch (err) {
            console.log(err.message);
            message.error({
                content: 'Sorry, something went wrong, please try again...',
                key: 'employee-msg',
            });
        }
    };

    const validateEmail = (email: string) => {
        return email.match(/\S+@\S+\.\S+/);
    }

    return (
        <Modal
            visible={uiState.modalOpen}
            title="Add Employee"
            onCancel={() => uiState.setModalOpen(false)}
            onOk={addEmployee}
        >
            <Input
                className={styles.input}
                placeholder="Employee Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
            />
            <Input
                className={styles.input}
                placeholder="Employee Email"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
            />
        </Modal>
    );
};

export default observer(AddEmployeeModal);
