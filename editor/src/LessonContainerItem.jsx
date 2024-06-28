import React from 'react';
import LessonItem from "./LessonItem";
import {useContext} from "react";
import {GlobalContext} from "./reducer";
import ContextMenu from "./ContextMenu";

const LessonContainerItem = (props) => {

    const {globalState, dispatcher} = useContext(GlobalContext);

    const addLessonHandler = (event) => {

        dispatcher({
            type: "ADD_LESSON",
            payload: {
                lessonContainerIndex: props.lessonContainerIndex
            }
        });

    }





    const contextMenuHandler = (event) => {

        event.preventDefault();
        const contextMenuComponent = <ContextMenu event={event} buttons={[
            {
                title: "Добавить пару(диапазоны недель)",
                handler: () => {
                    dispatcher({
                        type: "ADD_LESSON",
                        payload: {
                            lessonContainerIndex: props.lessonContainerIndex
                        }
                    });
                }
            },
            {
                title: "Удалить",
                handler: () => {
                    dispatcher({
                        type: "REMOVE_LESSON_CONTAINER",
                        payload: {
                            lessonContainerIndex: props.lessonContainerIndex
                        }
                    });
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

    }









    const lessons = props.lessonContainer.getLessons();
    const wp = props.lessonContainer.getWeekParity();
    const subgroups = props.lessonContainer.getSubgroups();


    return (
        <div className="lesson-editor__lesson-container">
            <div className="lesson-editor__lesson-container-header" onContextMenu={contextMenuHandler}>
                <b>
                    {wp ? wp : 0}Н; [{subgroups.join(", ")}]ПГ
                </b>
            </div>
            {
                lessons.map((lesson, idx) => {
                    // alert(props.lessonContainer.getSubgroups())
                    return (
                        <>
                            <LessonItem key={idx}
                                        lessonContainerIndex={props.lessonContainerIndex}
                                        subgroups={props.lessonContainer.getSubgroups()}
                                        weekParity={props.lessonContainer.getWeekParity()}
                                        lessonIndex={idx}
                                        lesson={lesson}/>
                        </>

                    )
                })
            }
            {/*{*/}
            {/*    lessons.length === 1 ?*/}
            {/*        <div className="lesson-editor__add-lesson" onClick={addLessonHandler}>*/}
            {/*            Добавить*/}
            {/*        </div> : null*/}
            {/*}*/}
        </div>
    );
};

export default LessonContainerItem;