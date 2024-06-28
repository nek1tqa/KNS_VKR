import React, {useEffect, useState} from 'react';
import TeacherSubform from "./TeacherSubform";
import {useContext} from "react";
import {GlobalContext} from "./reducer";
import RoomSubform from "./RoomSubform";

const RoomsForm = (props) => {


    const {globalState, dispatcher} = useContext(GlobalContext);

    // const [state, setState] = useState(props.teachers.length ? [...props.teachers] : [null]);
    //
    let rooms = props.rooms.length ? [...props.rooms] : [null];


    console.log(props.rooms);
    // alert(props.teachers);

    const setRoom = (subformId, roomItem) => {

        // setState(state.map((item, index) => {
        //     if(index === subformId)
        //         return teacherItem;
        //     return item;
        // }));
        const newRooms = Array.from(rooms.map((item, index) => {
            console.log(index, subformId);
            if(index === subformId)
                return roomItem;
            return item;
        }));

        props.setRooms(newRooms);
        // alert("hehehe");

        // dispatcher({type: "UPDATE"});

    }

    // useEffect(() => {
    //
    //     setState(props.teachers);
    //
    // }, [props.teachers])

    // const renderTeachers = [];
    let flag = true;
    rooms.forEach((room) => {
        // alert(teacher);
        if(!room)
            flag = false;
    });


    if(flag)
        rooms.push(null);


    return (
        // <div style={{display: "flex", flexDirection: "column"}}>
        <>

            <div className="row" style={{flexWrap: "wrap", justifyContent: "space-evenly"}}>
            {
                rooms.map((roomItem, idx) =>
                    <RoomSubform setRoom={setRoom}
                                    deleteButtonFlag={rooms.length > 1}
                                    key={idx}
                                    id={idx}
                                    suggestionsData={props.suggestionsData}
                                    data={roomItem} />)
            }
            </div>
        </>
    );
};

export default RoomsForm;