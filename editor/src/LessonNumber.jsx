import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from "./reducer";
import ContextMenu from "./ContextMenu";

const LessonNumber = (props) => {


    const {globalState, dispatcher} = useContext(GlobalContext);
    const numberInGlobalState = globalState.schedule[props.dayIndex][props.lessonRowIndex].getNumber();
    console.log(numberInGlobalState);
    const [number, setNumber] = useState(numberInGlobalState)

    const keyDownHandler = (event) => {
        if(event.code === "Escape" || event.code === "Enter")
            event.target.blur();
    }
    const changeHandler = (event) => setNumber(event.target.value);
    const saveHandler = (event) => {

        if(number !== numberInGlobalState)
            dispatcher({
                type: "SET_LESSON_NUMBER",
                payload: {
                    lessonRowIndex: props.lessonRowIndex,
                    dayIndex: props.dayIndex,
                    value: number
                }
            });

    }
    // const contextMenuHandler = (event) => {
        // event.preventDefault();
        // event.target.blur();
        // dispatcher({
        //     type: "REMOVE_LESSON_ROW",
        //     payload: {
        //         lessonRowIndex: props.lessonRowIndex,
        //         dayIndex: props.dayIndex
        //     }
        // });
    // }

    const contextMenuHandler = (event) => {

        console.log(event);
        event.preventDefault();
        event.target.blur();
        const contextMenuComponent = <ContextMenu event={event} buttons={[
            {
                title: "Удалить",
                handler: () => {
                    dispatcher({
                        type: "REMOVE_LESSON_ROW",
                        payload: {
                            lessonRowIndex: props.lessonRowIndex,
                            dayIndex: props.dayIndex
                        }
                    });
                }
            }
        ]} />;

        dispatcher({
            type: "SET_CONTEXTMENU",
            payload: {
                component: contextMenuComponent,
                data: null
            }
        })

    }



    useEffect(() => {
        const lessonRow = globalState.schedule[props.dayIndex][props.lessonRowIndex];
        setNumber(lessonRow.getNumber());
    }, [globalState])


    return (
        <td
            style={{...props.style, position: "relative", borderBottom: "2px solid black"}}
            rowSpan={props.rowSpan}
            colSpan={props.colSpan}
            data-type="lessonNumber"
            {...props.data}
            onContextMenu={contextMenuHandler}
        >
            <input type="number" className="lesson-number__input"
                   data-type="lesson_number"
                   data-lesson-row-index={props.lessonRowIndex}
                   data-day-index={props.dayIndex}
                   value={number} onBlur={saveHandler} onKeyDown={keyDownHandler} onChange={changeHandler}/>
        </td>
    );
};

export default LessonNumber;