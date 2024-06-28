import React from 'react';
import SelectWithSuggestions from "./SelectWithSuggestions";
import {getTeacherString} from "./utils";
import {getRoomString, getTeacherStringWithDepartment} from "./Lesson";

const RoomSubform = (props) => {

    console.log(props);
    let selectedItem = null;
    if(props.data)
        selectedItem = {value: getRoomString(props.data), data: props.data};

    return (
        <div style={{width: "35%", display: "flex"}}>
            <SelectWithSuggestions className="room-select"
                                   selectedItem={selectedItem}
                                   suggestionsLibrary={props.suggestionsData}
                                   // minInputLength={3}
                                   maxListLength={20}
                                   label={`Аудитория #${props.id + 1}`}
                                   set={(item) => props.setRoom(props.id, item)}/>
            {
                selectedItem !== null ?
                    <div className="close_icon" style={{width: "24px", height: "24px", opacity: 0.5}} onClick={(event) => props.setRoom(props.id, null)}></div>
                    : null
            }
        </div>
        // props.id
    );
};

export default RoomSubform;