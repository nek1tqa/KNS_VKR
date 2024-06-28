import React from 'react';

const ScheduleTable = (props) => {

    const tableWidth = props.groups.reduce((width, group) => width + group.width, 0) + 8;

    return (
        <table style={{width: `${tableWidth}ch`}}>
            {props.children}
        </table>
    );
};

export default ScheduleTable;