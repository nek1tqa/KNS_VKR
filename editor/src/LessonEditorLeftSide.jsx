import React from 'react';
import LessonContainerItem from "./LessonContainerItem";
import {useContext} from "react";
import {GlobalContext} from "./reducer";

const LessonEditorLeftSide = (props) => {

    const {globalState, dispatcher} = useContext(GlobalContext);

    const addLessonContainerHandler = (event) => {

        dispatcher({
            type: "ADD_LESSON_CONTAINER",
            payload: {}
        });

    }

    const cellLessonContainers = props.cell.getLessonContainers();
    const sortedCellLessonContainers = [...cellLessonContainers].sort((a, b) => {
        const aWP = a.getWeekParity() ? a.getWeekParity() : 0;
        const bWP = b.getWeekParity() ? b.getWeekParity() : 0;
        // const WP = a.getWeekParity() ? a.getWeekParity() : 0;

        return aWP - bWP;
        // if(a && b)
        //     return a + b;
        // else if(a)
        //     return -1;
        // else
        //     return 1;
    })

    return (

        <div className="lesson-editor__left-side">
            <div className="lesson-editor__cell-preview">

            </div>
            {
                sortedCellLessonContainers.map((lessonContainer, idx) => {
                    debugger;
                    const LCIndex = cellLessonContainers.findIndex((LC) => LC === lessonContainer);
                    return (<LessonContainerItem key={idx} lessonContainerIndex={LCIndex} lessonContainer={lessonContainer}/>);
                })
            }
            {
                props.cell.isHasFreeSpace() ?
                    <div className="lesson-editor__add-lesson-container" onClick={addLessonContainerHandler}>
                        Добавить
                    </div> : null
            }
        </div>

    );
};

export default LessonEditorLeftSide;