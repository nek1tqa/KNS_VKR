import React from 'react';
import {useLocation} from "react-router-dom";

const Test = () => {

    const location = useLocation();
    console.log(location.pathname);

    return (
        <div>

        </div>
    );
};

export default Test;


