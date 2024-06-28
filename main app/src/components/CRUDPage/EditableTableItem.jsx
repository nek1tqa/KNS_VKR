import {useEffect, useState} from "react";
import React from 'react';

const style = {
    verticalAlign: "middle",
    textAlign: "center",
    cursor: "pointer"
}


const EditableTableItem = (props) => {

    const [data, setData] = useState({...props.data});

    console.log('rerender ' + data['name'])
    const save = () => {

        console.log('re ' + data['name'])
        let needToSave = false;
        for(let col of props.struct){
            console.log(props.data[col.name], data[col.name])
            if(props.data[col.name] !== data[col.name]){
                needToSave = true;
                break;
            }
        }
        console.log(needToSave)
        if(needToSave)
            props.saveEditedItem(data);
        else
            props.editItem(null);

    }

    const getOnChangeHandler = (colName) => {
        return (event) => {
            setData({...data, [colName]: event.target.value});
        }
    }



    useEffect(function initKeyHandler(){

        const handler = (event) => {
            switch(event.key) {

                case "Enter":
                    console.log(event.key)
                    save();
                    break;
                case "Escape":
                    props.editItem(null);
                    break;

            }
        };
        window.addEventListener("keydown", handler);

        return function destructKeyHandler(){
            window.removeEventListener("keydown", handler);
        }

    }, [data])



    return (
        <tr style={{height: "42px"}}>
            <td key="index">{props.index}</td>
            {
                props.struct.map(col => (
                    <td key={col.name}>
                        <input style={{width: "100%"}} type="text" value={data[col.name]} onChange={getOnChangeHandler(col.name)} />
                    </td>
                ))
            }
            <td style={style} onClick={() => {props.editItem(null)}}>
                <i className="bi bi-x-lg"></i>
            </td>
            <td style={style} onClick={save}>
                <i className="bi bi-check-lg"></i>
            </td>
        </tr>
    )

};

export default EditableTableItem;