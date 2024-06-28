import React, {useEffect, useState} from 'react';
import TeacherSubform from "./TeacherSubform";
import {useContext} from "react";
import {GlobalContext} from "./reducer";

const TeachersForm = (props) => {


    const {globalState, dispatcher} = useContext(GlobalContext);

    // const [state, setState] = useState(props.teachers.length ? [...props.teachers] : [null]);
    //
    let teachers = props.teachers.length ? [...props.teachers] : [null];


    console.log(props.teachers);
    // alert(props.teachers);

    const setTeacher = (subformId, teacherItem) => {

        // setState(state.map((item, index) => {
        //     if(index === subformId)
        //         return teacherItem;
        //     return item;
        // }));
        const newTeachers = Array.from(teachers.map((item, index) => {
            console.log(index, subformId);
            if(index === subformId)
                return teacherItem;
            return item;
        }));

        props.setTeachers(newTeachers);
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
    teachers.forEach((teacher) => {
        // alert(teacher);
        if(!teacher)
            flag = false;
    });


    if(flag)
        teachers.push(null);


    return (
        // <div style={{display: "flex", flexDirection: "column"}}>
        <>
            {teachers.map((teacherItem, idx) => <TeacherSubform setTeacher={setTeacher} deleteButtonFlag={teachers.length > 1} key={idx} id={idx} suggestionsData={props.suggestionsData} data={teacherItem} />)}
        </>
    );
};

export default TeachersForm;