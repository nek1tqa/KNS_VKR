import React, {useContext} from 'react';
import {GlobalContext} from "./reducer";
import ContextMenu from "./ContextMenu";
import {getWeekRangesString} from "./Lesson";

const LessonItem = (props) => {

    const {globalState, dispatcher} = useContext(GlobalContext);

    const clickHandler = () => {

        dispatcher({
            type: "SET_ACTIVE_LESSON_DATA",
            payload: {
                ...globalState.activeLessonData,
                lessonContainerIndex: props.lessonContainerIndex,
                lessonIndex: props.lessonIndex
            }
        })

    }

    const contextMenuHandler = (event) => {

        console.log(event);
        event.preventDefault();
        const contextMenuComponent = <ContextMenu event={event} buttons={[
            {
                title: "Удалить",
                handler: () => {
                    dispatcher({
                        type: "REMOVE_LESSON",
                        payload: {
                            ...globalState.activeLessonData,
                            lessonContainerIndex: props.lessonContainerIndex,
                            lessonIndex: props.lessonIndex
                        }
                    })
                }
            }
        ]} />;

        dispatcher({
            type: "SET_CONTEXTMENU",
            payload: {
                component: contextMenuComponent,
                data: {
                    ...globalState.activeLessonData,
                    lessonContainerIndex: props.lessonContainerIndex,
                    lessonIndex: props.lessonIndex
                }
            }
        })
        // dispatcher({
        //     type: "REMOVE_LESSON",
        //     payload: {
        //         ...globalState.activeLessonData,
        //         lessonContainerIndex: props.lessonContainerIndex,
        //         lessonIndex: props.lessonIndex
        //     }
        // })

    }


    let className = "lesson-editor__lesson-item";
    if(props.lessonContainerIndex === globalState.activeLessonData.lessonContainerIndex &&
        props.lessonIndex === globalState.activeLessonData.lessonIndex)
        className += " lesson-editor__lesson-item_active"

    let itemString = `${getWeekRangesString(props.lesson.getWeekRanges())} ${props.lesson.getTitle()}`;
    if(!itemString.trim().length)
        itemString = "Пусто";
    // if(props.lesson.room)
    //     itemString = `${props.lesson.title} ${props.lesson.room.number}(${props.lesson.room.buildingNumber})`;
    // alert(props.subgroups)
    return (
        <div className={className} onClick={clickHandler} onContextMenu={contextMenuHandler}>
            {itemString}
        </div>
    );
};

export default LessonItem;