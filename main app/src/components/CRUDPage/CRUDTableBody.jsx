import EditableTableItem from "./EditableTableItem";
import TableItem from "./TableItem";
import React from 'react';
import { FixedSizeList as FSList } from 'react-window';

const CRUDTableBody = (props) => {

    return (

        <tbody>
        {
            props.data.map((row, index) => {
                return props.editingRowId === row.id ?
                    <EditableTableItem key={row.id}
                                       index={index+1}
                                       data={row}
                                       editItem={props.editItem}
                                       saveEditedItem={props.saveEditedItem}
                                       struct={props.struct}
                    /> : <TableItem key={row.id}
                                    index={index+1}
                                    data={row}
                                    editItem={props.editItem}
                                    removeItem={props.removeItem}
                                    struct={props.struct}
                                    hasButtons={props.editingRowId === null}
                    />
            })
        }
        </tbody>

    )

}

export default CRUDTableBody;