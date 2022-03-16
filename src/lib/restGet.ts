/*
  Implemented for Dependency Inversion Principle:
    A. High-level modules should not depend upon low-level modules. Both should depend upon abstractions.
    B. Abstractions should not depend on details. Details should depend upon abstractions.

  In short, low-level axios can be easily replaced by other http get libraries or SDK. Furthermore, we can implement our own mock Axios.
*/

import axios from 'axios';

type GetRequest = {
    endpoint: string;
    _id?: string;
    credentials?: {
        accessToken: string;
        // idToken:string;
        apiKey?: string;
    };
};

const restGet = ({ endpoint, _id = '', credentials }: GetRequest) => {
    let options = {};
    credentials = {  // Hard coded for now
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiamVmZkBnbWFpbC5jb20iLCJpYXQiOjE2NDc0Mjk5ODksImV4cCI6MTY0NzQzNzE4OX0.0C7bf7CSRkaprm5UJoqqZZzGIgOO4H4JxMlSuo1Z-ZQ'
    }
    if (credentials) {
        options['headers'] = {
            'x-access-token': credentials.accessToken
        };
    }
    return axios.get(`${endpoint}/${_id}`, options);
};

export default restGet;
