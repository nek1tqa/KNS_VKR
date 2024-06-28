import React from 'react';
import EditableTableItem from "../../components/CRUDPage/EditableTableItem";
import TableItem, {TableItemButtons} from "../../components/CRUDPage/TableItem";

const style = {
    verticalAlign: "middle",
    textAlign: "center",
    cursor: "pointer"
}


const FacultyPagesBody = (props) => {

    return (

        <tbody>
        {
            props.data.map((row, index) => {
                return (
                    <tr key={index} style={{height: "42px"}}>
                        {
                            props.struct.map(col => <td key={col.name}><a href={`/editor/${row['id']}`}>{row[col.name]}</a></td>)
                        }
                        <TableItemButtons active={true} data={row} editItem={props.openUpdateItemModal} removeItem={props.removeItem} />
                    </tr>
                )

            })
        }
        </tbody>

    );

};

export default FacultyPagesBody;