import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppContainer from './AppContainer';

const root = ReactDOM.createRoot(document.getElementById('root'));

setTimeout(() => {

    root.render(
        // <React.StrictMode>
        <AppContainer />
        // </React.StrictMode>
    );

}, 0);