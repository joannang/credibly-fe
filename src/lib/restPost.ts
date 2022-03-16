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
    formData?: boolean;
};

const formatData = (data) => {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }
    return formData;
};

const restPost = ({ endpoint, data = {}, credentials = null, formData = false }: PostRequest) => {
    let options = { 'headers': {} };

    credentials = {  // Hard coded for now
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiamVmZkBnbWFpbC5jb20iLCJpYXQiOjE2NDc0MzM2MTEsImV4cCI6MTY0NzQ0MDgxMX0.lJssHsqI_fAo85CRpQNFrySPaGTjz9j-H6Nn0RNelLk'
    }
    if (credentials) {
        options['headers']['x-access-token'] = credentials.accessToken;
    }
    if (formData) {
        options['headers']['Content-Type'] = 'multipart/form-data';
    }

    return axios.post(endpoint, formatData(data), options);
};

export default restPost;
