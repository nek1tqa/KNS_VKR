import React from 'react';


const buttonColWidth = 5;
const FacultiesPageHeader = (props) => {
    return (
        <thead>
        <tr>
            {
                props.struct.map((col, colId) => {
                    const colWidth = col.width;
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

export default FacultiesPageHeader;