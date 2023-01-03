import axios from "axios";
import { showLoading } from "./helper/common_func";
// Add a request interceptor
export default(() => {

    /*if(document.location.pathname != '/')
    {
        document.location = "/";
    }*/

    axios.interceptors
        .request
        .use((config) => {
            // Do something before request is sent
            // if localstorage token
            const Token = localStorage.getItem('token');
            
            if (Token){
                config.headers.common.Authorization = `Bearer ${Token}`;
            }
            config.headers.common['Cache-Control'] = 'no-cache';

            showLoading(true);

            return config;
        }, (error) => {
            // Do something with request error

            showLoading(false);
            return Promise.reject(error);
        });

    // Add a response interceptor
    axios
        .interceptors
        .response
        .use((response) => {
            // store.dispatch({type:'Show_Loading',loading:false})
            // Do something with response data
           
            showLoading(false);
            return response;
        },(error) => {
            // store.dispatch({type:'Show_Loading',loading:false})
            // Do something with response error
           
            showLoading(false);
            return Promise.reject(error);
        });
})