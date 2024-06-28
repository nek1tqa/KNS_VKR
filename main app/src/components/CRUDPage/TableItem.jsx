import React from 'react';

const style = {
    verticalAlign: "middle",
    textAlign: "center",
    cursor: "pointer"
}

export const TableItemButtons = (props) => {

    if(props.active)
        return (
            <>
                <td style={style} onClick={() => {
                    props.editItem(props.data.id)
                }}>
                    <i className="bi bi-pencil"></i>
                </td>
                <td style={style} onClick={() => {
                    props.removeItem(props.data.id)
                }}>
                    <i className="bi bi-x-lg"></i>
                </td>
            </>
        )

    return (
        <>
            <td></td>
            <td></td>
        </>
    )

};


const TableItem = (props) => {

    return (
        <tr style={{height: "42px"}}>
            <td key="index">{props.index}</td>
            {
                props.struct.map(col => <td key={col.name}>{props.data[col.name]}</td>)
            }
            <TableItemButtons active={props.hasButtons} data={props.data} editItem={props.editItem} removeItem={props.removeItem} />
        </tr>
    )

};

export default TableItem;