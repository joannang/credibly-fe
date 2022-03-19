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
    formData?: boolean;
    credentials?: {
        accessToken: string;
        apiKey?: string;
    };
};

// const formatData = (data) => {
//     const formData = new FormData();
//     for (const key in data) {
//         if (key === 'document' || key === 'image') {
//             data[key].forEach((doc: File) => formData.append(key, doc));
//         } else {
//             formData.append(key, data[key]);
//         }
//     }
//     return formData;
// };

const formatData = (data) => {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }
    return formData;
};


const restPost = ({ endpoint, data = {}, credentials = null, formData = false }: PostRequest) => {
    let options = { 'headers': {} };

    if (credentials) {
        options['headers']['x-access-token'] = credentials.accessToken;
    }
    if (formData) {
        options['headers']['Content-Type'] = 'multipart/form-data';
    }

    return axios.post(endpoint, formData ? formatData(data) : data, options);
};

export default restPost;
