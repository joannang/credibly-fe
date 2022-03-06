import { observable, action, makeObservable } from 'mobx';

/**
 * MobX store to manage UI states among components
 */

interface UiState {
    error: string;
    success: string;
    isLoading: boolean;
}

class UiState {
    error = '';
    success = '';
    isLoading: boolean = false;

    constructor() {
        makeObservable(this, {
            error: observable,
            success: observable,
            isLoading: observable,

            setError: action,
            setSuccess: action,
            setIsLoading: action,
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
}

export default UiState;
