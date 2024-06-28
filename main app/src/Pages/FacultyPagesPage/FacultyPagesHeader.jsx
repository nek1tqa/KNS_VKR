import React from 'react';


const buttonColWidth = 5;
const FacultyPagesHeader = (props) => {
    return (
        <thead>
        <tr>
            {
                props.struct.map((col, colId) => {
                    const colWidth = 100;
                    return (
                        <th key={colId} style={{width: `${colWidth}%`}}>
                            {col.title}
                        </th>
                    )
                })
            }
            <th style={{width: `${buttonColWidth}%`}}></th>
            <th style={{width: `${buttonColWidth}%`}}></th>
        </tr>
        </thead>
    );
};

export default FacultyPagesHeader;