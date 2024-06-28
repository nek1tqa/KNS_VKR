import React from 'react';
import EditableTableItem from "../../components/CRUDPage/EditableTableItem";
import TableItem, {TableItemButtons} from "../../components/CRUDPage/TableItem";

const style = {
    verticalAlign: "middle",
    textAlign: "center",
    cursor: "pointer"
}


const FacultiesPageBody = (props) => {

    return (

        <tbody>
        {
            props.data.map((row, index) => {
                return (
                    <tr key={index} style={{height: "42px"}}>
                        {
                            props.struct.map(col => <td key={col.name}>{row[col.name]}</td>)
                        }
                        <TableItemButtons active={true} data={row} editItem={props.openUpdateItemModal} removeItem={props.removeItem} />
                    </tr>
                )

            })
        }
        </tbody>

    );

};

export default FacultiesPageBody;