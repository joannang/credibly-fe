/*
  Implemented for Dependency Inversion Principle:
    A. High-level modules should not depend upon low-level modules. Both should depend upon abstractions.
    B. Abstractions should not depend on details. Details should depend upon abstractions.

  In short, low-level axios can be easily replaced by other http get libraries or SDK. Furthermore, we can implement our own mock Axios.
*/

import axios from 'axios';

type PostRequest = {
    endpoint: string;
    data?: any;
    credentials?: {
        accessToken: string;
        apiKey?: string;
    };
};

const formatData = (data) => {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }
    return formData;
};

const restPost = ({ endpoint, data = {}, credentials = null }: PostRequest) => {
    let options = {};
    if (credentials) {
        options['headers'] = {
            // Authorization: `Bearer ${credentials.accessToken}`,
            // Authenticator: AUTH_TYPE,
        };
    }

    return axios.post(endpoint, formatData(data), options);
};

export default restPost;
