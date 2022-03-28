import { observable, action, makeObservable } from 'mobx';

/**
 * MobX store to manage UI states among components
 */

interface UiState {
    error: string;
    success: string;
    isLoading: boolean;
    modalOpen: boolean;
}

class UiState {
    error = '';
    success = '';
    isLoading: boolean = false;
    modalOpen: boolean = false;
    employeesUpdated: boolean = false;

    constructor() {
        makeObservable(this, {
            error: observable,
            success: observable,
            isLoading: observable,
            modalOpen: observable,
            employeesUpdated: observable,

            setError: action,
            setSuccess: action,
            setIsLoading: action,
            setModalOpen: action,
            setEmployeesUpdated: action,
        });
    }

    // @action
    setError = (error: string) => {
        this.error = error;
    };

    // @action
    setSuccess = (success: string) => {
        this.success = success;
    };

    // @action
    setIsLoading = (loading: boolean) => {
        this.isLoading = loading;
    }

    // @action
    setModalOpen = (open: boolean) => {
        this.modalOpen = open;
    }

    // @action
    setEmployeesUpdated = (updated: boolean) => {
        this.employeesUpdated = updated;
    }
}

export default UiState;
