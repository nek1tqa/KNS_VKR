import React from 'react';
import SelectWithSuggestions from "./SelectWithSuggestions";
import {getTeacherString} from "./utils";
import {getTeacherStringWithDepartment} from "./Lesson";

const TeacherSubform = (props) => {

    console.log(props);
    let selectedItem = null;
    if(props.data)
        selectedItem = {value: getTeacherStringWithDepartment(props.data), data: props.data};

    return (
        <div className="row" style={{alignItems: "center"}}>
            <SelectWithSuggestions className="teacher-select"
                                   selectedItem={selectedItem}
                                   suggestionsLibrary={props.suggestionsData}
                                   // minInputLength={3}
                                   maxListLength={20}
                                   label={`Преподаватель #${props.id + 1}`}
                                   set={(item) => props.setTeacher(props.id, item)}/>
            {
                selectedItem !== null ?
                    <div className="close_icon" style={{width: "24px", height: "24px", opacity: 0.5}} onClick={(event) => props.setTeacher(props.id, null)}></div>
                    : null
            }
        </div>
        // props.id
    );
};

export default TeacherSubform;