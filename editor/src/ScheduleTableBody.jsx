import React, {useContext} from 'react';
import TableDay from "./TableDay";
import {GlobalContext, reducer} from "./reducer";
import {days} from "./utils";
import ContextMenu from "./ContextMenu";
import Lesson from "./Lesson";
import {Cell} from "./Cell";
import {LessonContainer} from "./LessonContainer";




const ScheduleTableBody = (props) => {

    const {globalState, dispatcher} = useContext(GlobalContext);



    const clickHandler = (event) => {

        const type = event.target.getAttribute('data-type');
        // if(type !== "lesson")
        //     return;
        if(type === "lesson"){


            const payload = {
                dayIndex: parseInt(event.target.dataset.day_index),
                lessonRowIndex: parseInt(event.target.dataset.lesson_row_index),
                cellIndex: parseInt(event.target.dataset.cell_index),
                lessonContainerIndex: null,
                lessonIndex: null
            };

            if(globalState.activeLessonData &&
                globalState.activeLessonData.dayIndex === payload.dayIndex &&
                globalState.activeLessonData.lessonRowIndex === payload.lessonRowIndex &&
                globalState.activeLessonData.cellIndex === payload.cellIndex){

                payload.lessonContainerIndex = parseInt(event.target.dataset.lesson_container_index);
                payload.lessonIndex = parseInt(event.target.dataset.lesson_index);
            }
            // dispatcher({type: "OPEN_EDITOR", payload});
            dispatcher({type: "SET_ACTIVE_LESSON_DATA", payload});



        }else if(type === "day"){

            // const payload = {
            //     dayIndex: parseInt(event.target.dataset.day_index),
            // };
            // // dispatcher({type: "OPEN_EDITOR", payload});
            // dispatcher({type: "ADD_LESSON_ROW", payload});


        }

        console.log("click");

    }

    const dblClickHandler = (event) => {
        if(document.selection && document.selection.empty) {
            document.selection.empty();
        }else if(window.getSelection) {
            const sel = window.getSelection();
            sel.removeAllRanges();
        };
        dispatcher({type: "OPEN_LESSON_EDITOR", payload: {}});


    }


    const contextMenuHandler = (event) => {
        //
        // clickHandler(event);

        event.preventDefault();

        if (!globalState.activeLessonData)
            return;


        const type = event.target.getAttribute('data-type');

        if(type !== "lesson")
            return;

        if(!globalState.activeLessonData)
            return;

        const {dayIndex, lessonRowIndex, cellIndex, lessonContainerIndex, lessonIndex} = globalState.activeLessonData;
        const activeCell = globalState.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];



        const clickedLessonData = {
            dayIndex: parseInt(event.target.dataset.day_index),
            lessonRowIndex: parseInt(event.target.dataset.lesson_row_index),
            cellIndex: parseInt(event.target.dataset.cell_index),
            lessonContainerIndex: parseInt(event.target.dataset.lesson_container_index),
            lessonIndex: parseInt(event.target.dataset.lesson_index)
        };


        if(dayIndex !== clickedLessonData.dayIndex ||
            lessonRowIndex !== clickedLessonData.lessonRowIndex ||
            cellIndex !== clickedLessonData.cellIndex ||
            (lessonContainerIndex && lessonContainerIndex !== clickedLessonData.lessonContainerIndex)
        )
            return;



        const buttons = [
            {
                title: "Копировать",
                handler: () => {

                    if (lessonContainerIndex !== null) {

                        const activeLessonContainer = activeCell.getLessonContainers()[lessonContainerIndex];
                        if(activeLessonContainer)
                            dispatcher({type: "SET_CLIPBOARD", payload: {value: activeLessonContainer.copy()}});

                    } else {
                        if(activeCell.getLessonContainers().length)
                            dispatcher({type: "SET_CLIPBOARD", payload: {value: activeCell.copy()}});
                    }

                }
            }
        ];

        if((globalState.clipboard instanceof LessonContainer && lessonContainerIndex) ||
            (globalState.clipboard instanceof Cell && lessonContainerIndex === null))

            buttons.push({
                title: "Вставить",
                handler: () => {
                     dispatcher({type: "PASTE_FROM_CLIPBOARD", payload: null});
                }

            });






        const contextMenuComponent = <ContextMenu event={event} buttons={buttons} />;

        dispatcher({
            type: "SET_CONTEXTMENU",
            payload: {
                component: contextMenuComponent,
                data: null
            }
        })

    }



    return (
        <tbody onClick={clickHandler} onDoubleClick={dblClickHandler} onContextMenu={contextMenuHandler}>
            {
                days.map((day, dayIndex) => {
                    // alert("day");
                    return <TableDay lessonRows={props.schedule[dayIndex]} groups={props.groups} title={day.title} index={dayIndex} separator={day.separator} />
                })
            }
            {/*<TableDay lessonRows={props.schedule[0]} groups={props.groups} index={0} title="Понедельник" separator={false} />*/}
        </tbody>
    );

};

export default ScheduleTableBody;



// [
//      days
//      [
//          lessonsRow[]
//      ],
//      [],
//      [],
//      [],
//      [],
//      []
// ]