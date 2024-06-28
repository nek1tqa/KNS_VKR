import React from 'react';

const CRUDHeaderColIcon = (props) => {

    if(props.show)
        if(props.direction > 0)
            return <i className="bi bi-sort-up ms-2"></i>
        else
            return <i className="bi bi-sort-down ms-2"></i>
    return null

}

const idColWidth = 5;
const buttonColWidth = 3;

const CRUDTableHeader = (props) => {

    return (

        <thead>
            <tr>
                <th style={{width: `${idColWidth}%`}}>#</th>
                {
                    props.struct.map((col, colId) => {
                        const colWidth = col.width/100*(100-idColWidth*2*buttonColWidth);
                        return (
                            <th style={{width: `${colWidth}%`, cursor: "pointer"}} onClick={() => {props.sortItems(colId)}} key={col.name}>
                                {col.title}
                                <CRUDHeaderColIcon show={props.sortProp.colId === colId} direction={props.sortProp.direction} />
                            </th>
                        )
                    })
                }
                <th style={{width: `${buttonColWidth}%`}}></th>
                <th style={{width: `${buttonColWidth}%`}}></th>
            </tr>
        </thead>

    )

}

export default CRUDTableHeader;