const serverHost = process.env.NODE_ENV === 'production' ? {
    api: process.env.REACT_APP_API_URL_PROD,
    root: process.env.REACT_APP_ROOT_URL_PROD,
} : {
    api: process.env.REACT_APP_API_URL_DEV,
    root: process.env.REACT_APP_ROOT_URL_DEV,
};
// alert(process.env.NODE_ENV);
console.log(process.env);
export default serverHost;