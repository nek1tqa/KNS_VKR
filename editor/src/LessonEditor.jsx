import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from "./reducer";
import LessonContainerItem from "./LessonContainerItem";
import LessonEditorLeftSide from "./LessonEditorLeftSide";
import LessonEditorMain from "./LessonEditorMain";
import {
    getFacultiesDepartmentsLibrary,
    getLessonsLibrary,
    getLessonTypesLibrary,
    getRoomsLibrary,
    getTeachersLibrary
} from "./utils";

const LessonEditor = () => {

    const {globalState, dispatcher} = useContext(GlobalContext);
    const activeLessonData = globalState.activeLessonData;
    console.log(activeLessonData);
    const {dayIndex, lessonRowIndex, cellIndex, lessonContainerIndex, lessonIndex} = activeLessonData;
    const activeCell = globalState.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];
    console.log(activeCell)
    const cellLessonContainers = activeCell.getLessonContainers();

    // const addLessonContainerFlag = activeCell.isHasFreeSpace();


    const [suggestionsData, setSuggestionsData] = useState({lessons: null, lessonTypes: null, teachers: null, rooms: null});


    useEffect(() => {
    }, []);



    useEffect(() => {

        const exitHandler = event => {
            if(event.key === "Escape")
                dispatcher({type: "CLOSE_EDITOR"});
        };
        window.addEventListener("keydown", exitHandler);
        document.body.style.overflow = "hidden";

        const lessonSuggestionsLibrary = getLessonsLibrary();
        const lessonTypeSuggestionsLibrary = getLessonTypesLibrary();
        const teacherSuggestionsLibrary = getTeachersLibrary();
        const roomSuggestionsLibrary = getRoomsLibrary();
        const facultiesDepartmentsSuggestionsLibrary = getFacultiesDepartmentsLibrary();

        const libraries = [lessonSuggestionsLibrary, lessonTypeSuggestionsLibrary, teacherSuggestionsLibrary, roomSuggestionsLibrary, facultiesDepartmentsSuggestionsLibrary];

        Promise.all(libraries).then((values) => {
            setSuggestionsData({
                lessons: values[0],
                lessonTypes: values[1],
                teachers: values[2],
                rooms: values[3],
                departments: values[4]
            });
        });

        return () => {
            window.removeEventListener("keydown", exitHandler);
            document.body.style.overflow = "auto";
        };

    }, []);






    // const activeLessonContainer = activeCell.getLessonContainers()[lessonContainerIndex];
    // const activeLesson = activeLessonContainer.getLessons()[lessonIndex];


    return (
        <div className="modal-container">
            <div className="lesson-editor">
                <LessonEditorLeftSide cell={activeCell} />
                <LessonEditorMain suggestionsData={suggestionsData}/>
            </div>
        </div>
    );
};

export default LessonEditor;