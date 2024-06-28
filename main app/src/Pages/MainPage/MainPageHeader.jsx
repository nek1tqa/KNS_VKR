import React from 'react';

const FacultyPageHeader = (props) => {
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
        </tr>
        </thead>
    );
};

export default FacultyPageHeader;