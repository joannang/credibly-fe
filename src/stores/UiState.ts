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

type EditableUser = {
    position?: string,
    endDate?: string,
}

class UiState {
    error = '';
    success = '';
    isLoading: boolean = false;
    modalOpen: boolean = false;
    secondaryModalOpen: boolean = false;
    employeesUpdated: boolean = false;
    editableUser: EditableUser = {
        position: '',
        endDate: '',
    }
    toggle: boolean = false;

    constructor() {
        makeObservable(this, {
            error: observable,
            success: observable,
            isLoading: observable,
            modalOpen: observable,
            secondaryModalOpen: observable,
            employeesUpdated: observable,
            editableUser: observable,
            toggle: observable,

            setError: action,
            setSuccess: action,
            setIsLoading: action,
            setModalOpen: action,
            setSecondaryModalOpen: action,
            setEmployeesUpdated: action,
            setEditableUser: action,
            setToggle: action,
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

    //@action
    setEditableUser = (user: EditableUser) => {
        const {
            position,
            endDate,
        } = user;
        this.editableUser = {
            position: position,
            endDate: endDate
        };
    };

    //@action
    setToggle = (toggle: boolean) => {
        this.toggle = toggle;
    }

    // @action
    setSecondaryModalOpen = (open: boolean) => {
        this.secondaryModalOpen = open;
    }
}

export default UiState;
