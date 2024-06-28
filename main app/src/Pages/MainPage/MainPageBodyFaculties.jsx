import React from 'react';
import EditableTableItem from "../../components/CRUDPage/EditableTableItem";
import TableItem from "../../components/CRUDPage/TableItem";
import {NavLink} from "react-router-dom";

const MainPageBodyFaculties = (props) => {

    return (

        <tbody>
        {
            props.data.map((row, index) => {
                return (
                    <tr key={index} style={{height: "42px"}}>
                        {
                            props.struct.map(col => <td key={col.name}>
                                <NavLink style={{
                                    textDecoration: "none"
                                }} to={`/faculty/${row['id']}`}>
                                    {row[col.name]}
                                </NavLink>
                            </td>)
                        }
                    </tr>
                )

            })
        }
        </tbody>

    );

};

export default MainPageBodyFaculties;