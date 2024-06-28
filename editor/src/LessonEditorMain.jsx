import React, {useState} from 'react';
import {useContext} from "react";
import {GlobalContext} from "./reducer";
import InputWithSuggestions from "./InputWithSuggestions";
import SelectWithSuggestions from "./SelectWithSuggestions";
import LessonPositionEditor from "./LessonPositionEditor";
import TeacherSubform from "./TeacherSubform";
import TeachersForm from "./TeachersForm";
import {days} from "./utils";
import WeekRangeCalendar from "./WeekRangeCalendar";
import RoomsForm from "./RoomsForm";

const LessonEditorMain = (props) => {

    const suggestionsData = props.suggestionsData;
    // console.log(suggestionsData);
    let mainComponentBody = null;

    const {globalState, dispatcher} = useContext(GlobalContext);
    const activeLessonData = globalState.activeLessonData;
    const {dayIndex, lessonRowIndex, cellIndex, lessonContainerIndex, lessonIndex} = activeLessonData;
    const activeCell = globalState.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];


    const lessonContainers = activeCell.getLessonContainers();
    let flag = true;
    if(lessonContainerIndex !== null && lessonContainers[lessonContainerIndex]){

        const lesson = lessonContainers[lessonContainerIndex].getLessons()[lessonIndex];
        if(lesson.getFacultyDepartment())
            flag = false;

    }



    const [teachersFormState, setTeachersFormState] = useState(flag);





    if(lessonContainerIndex !== null && lessonContainers[lessonContainerIndex] &&
        lessonContainers[lessonContainerIndex].getLessons()[lessonIndex]){

        const activeLessonContainer = lessonContainers[lessonContainerIndex];
        const activeLCLessons = activeLessonContainer.getLessons();
        const activeLesson = activeLCLessons[lessonIndex];

        // if(activeLesson.getFacultyDepartment() && teachersFormState)
        //     setTeachersFormState(false);
        // debugger;

        // let teacher = null;
        // if(activeLesson.teacher)
        //     teacher = {value: `${activeLesson.teacher.surname} ${activeLesson.teacher.name} ${activeLesson.teacher.patronymic}, ${activeLesson.teacher.post}`, data: activeLesson.teacher};

        const disabledWeekRanges = activeLCLessons.length === 2 ? activeLCLessons[(lessonIndex + 1)%2].getWeekRanges() : [];
        // if(activeLCLessons.length === 2)



        let lessonType = null;
        if(activeLesson.type)
            lessonType = {value: activeLesson.type.value, data: activeLesson.type};

        let department = null;
        let depData = activeLesson.getFacultyDepartment();
        debugger;
        if(depData)
            department = {value: depData.name, data: depData};


        let teachers = activeLesson.getTeachers();
        // let room = null;
        // if(activeLesson.room)
        //     room = {value: `${activeLesson.room.number}(${activeLesson.room.buildingNumber}К)`, data: activeLesson.room};
        // alert(`teacher: ${teacher}`);

        mainComponentBody = (
            <div className="lesson-editor__main-form">
                <div className="row">

                    <InputWithSuggestions className="lesson-input"
                                          value={activeLesson.title}
                                          suggestionsLibrary={suggestionsData.lessons}
                                          minInputLength={4}
                                          maxListLength={20}
                                          label={"Название дисциплины"}
                                          set={(value) => {
                                              activeLesson.setTitle(value);
                                              dispatcher({type: "UPDATE"})
                                          }}/>

                    <SelectWithSuggestions className="lesson-type-select"
                                           selectedItem={lessonType}
                                           suggestionsLibrary={suggestionsData.lessonTypes}
                                           label={"Тип"}
                                           set={(item) => {
                                               console.log(suggestionsData.lessonTypes);
                                               activeLesson.setType(item);
                                               // debugger;
                                               dispatcher({type: "UPDATE"})
                                           }}/>

                </div>

                <hr className="separation-line"/>


                <div className="teachers-departments">

                    <div className="teachers-departments__header" style={{display: "flex", justifyContent: "space-evenly"}}>
                        <label>
                            <span style={teachers.length ? {color: "green"} : {}}>Преподаватели</span>
                            <input name="teacher_or_department" name="teachers" checked={teachersFormState} type="radio" onChange={(e) => {e.target.checked && setTeachersFormState(true)}}/>
                        </label>

                        <label>
                            <span style={depData ? {color: "green"} : {}}>Кафедра</span>
                            <input name="teacher_or_department" name="department" checked={!teachersFormState} type="radio" onChange={(e) => e.target.checked && setTeachersFormState(false)}/>
                        </label>
                    </div>



                    {

                        teachersFormState ? (
                            <TeachersForm teachers={teachers} setTeachers={(teachers) => {
                                activeLesson.setTeachers(teachers);
                                activeLesson.setFacultyDepartment(null);
                                console.log(teachers);
                                dispatcher({type: "UPDATE"})
                            }} suggestionsData={suggestionsData.teachers}/>
                        ) : <SelectWithSuggestions className="department-select"
                                                   selectedItem={department}
                                                   suggestionsLibrary={suggestionsData.departments}
                                                   label={"Кафедра"}
                                                   set={(item) => {
                                                       console.log(item);
                                                       // console.log(suggestionsData.lessonTypes);
                                                       activeLesson.setFacultyDepartment(item);
                                                       activeLesson.setTeachers([]);
                                                       // debugger;
                                                       dispatcher({type: "UPDATE"})
                                                   }}/>

                    }




                </div>
                <hr className="separation-line"/>


                {/*<div className="row" style={{marginTop: "8px"}}>*/}
                {/*    <SelectWithSuggestions className="room-select"*/}
                {/*                           selectedItem={room}*/}
                {/*                           suggestionsLibrary={suggestionsData.rooms}*/}
                {/*                           label={"Аудитория"}*/}
                {/*                           set={(item) => {*/}
                {/*                               // console.log(suggestionsData.lessonTypes);*/}
                {/*                               activeLesson.setRoom(item);*/}
                {/*                               debugger;*/}
                {/*                               dispatcher({type: "UPDATE"})*/}
                {/*                           }}/>*/}
                {/*</div>*/}




                <RoomsForm rooms={activeLesson.getRooms()} setRooms={(rooms) => {
                    activeLesson.setRooms(rooms);
                    console.log(rooms);
                    dispatcher({type: "UPDATE"})
                }} suggestionsData={suggestionsData.rooms}/>


                <hr/>

                <div className="row lesson-editor__position-editor" style={{marginTop: "8px"}}>
                    <LessonPositionEditor activeCell={activeCell} activeLessonContainer={activeLessonContainer} />
                </div>


                <div className="row" style={{marginTop: "20px"}}>
                    <WeekRangeCalendar updateWeekRangesCallback={(weekRanges) => {

                        activeLesson.setWeekRanges(weekRanges);
                        dispatcher({type: "UPDATE"})

                        // weekRanges.forEach((weekRange, index) => console.log(`${index + 1}. ${weekRange.start}-${weekRange.end}`));
                        // console.log();

                    }} weekRanges={activeLesson.getWeekRanges()} disabledWeekRanges={disabledWeekRanges} />
                </div>
                {/*<InputWithSuggestions value={activeLesson.title}/>*/}
                {/*{activeLesson.title}*/}
            </div>
        );

    }



    const lessonNumber = globalState.schedule[dayIndex][lessonRowIndex].getNumber();
    let titleStr = `${globalState.groups[cellIndex].name}, ${days[dayIndex].title}, ${lessonNumber} пара`;
    // globalState.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];
    // if()

    return (
        <div className="lesson-editor__main">
            <div className="row lesson-editor__main-header">
                <span className="title">
                    {titleStr}
                </span>
                <div className="close_icon" onClick={() => {dispatcher({type: "CLOSE_EDITOR"})}}></div>
                {/*<div style={{fontSize: "32px", color: "red", cursor: "pointer"}} className="button">X</div>*/}
            </div>
            {
                mainComponentBody
            }
        </div>
    );
};

export default LessonEditorMain;