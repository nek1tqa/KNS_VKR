import React, {useEffect, useState} from 'react';
import {useContext} from "react";
import {GlobalContext} from "./reducer";

const LessonPositionEditor = (props) => {

    const {globalState, dispatcher} = useContext(GlobalContext);

    const activeLessonContainerSubgroups = props.activeLessonContainer.getSubgroups();
    const activeLessonContainerWP = props.activeLessonContainer.getWeekParity();

    const [subgroups, setSubgroups] = useState(activeLessonContainerSubgroups);
    const [weekParityArr, setWeekParityArr] = useState(activeLessonContainerWP ? [activeLessonContainerWP] : [1, 2]);
    // console.log(activeLessonContainerSubgroups)





    useEffect(() => {
        setSubgroups(activeLessonContainerSubgroups);
        setWeekParityArr(activeLessonContainerWP ? [activeLessonContainerWP] : [1, 2]);
    }, [props.activeLessonContainer]);


    const setLessonContainerPosition = (weekParityArr, subgroups) => {

        dispatcher({type: "SET_LC_POSITION", payload: {weekParityArr, subgroups}});

    }

    // debugger;


    const addWeekParity = (weekParity) => {
        const newWeekParityArr = [...weekParityArr, weekParity];
        setWeekParityArr(newWeekParityArr);

        setLessonContainerPosition(newWeekParityArr, subgroups);
    }

    const removeWeekParity = (weekParity) => {
        const newWeekParityArr = weekParityArr.filter(weekParityElem => weekParity !== weekParityElem);
        setWeekParityArr(newWeekParityArr);

        setLessonContainerPosition(newWeekParityArr, subgroups);
    }

    // alert(weekParity)
    const weekParityComponents = [];
    for(let i = 1; i <= 2; i++){

        weekParityComponents.push((
            <label>
                {i}
                <input type="checkbox"
                       checked={weekParityArr.includes(i)}
                       data-week_parity={i}
                       onChange={(event) => {event.target.checked ? addWeekParity(i) : removeWeekParity(i);}}
                       className="lesson-editor__checkbox"/>
            </label>
        ));

    }
    // debugger;

    const addSubgroup = (subgroup) => {
        const newSubgroupsArr = [...subgroups, subgroup];
        setSubgroups(newSubgroupsArr)

        setLessonContainerPosition(weekParityArr, newSubgroupsArr);
    }

    const removeSubgroup = (subgroup) => {
        const newSubgroupsArr = subgroups.filter(subgroupElem => subgroup !== subgroupElem);
        setSubgroups(newSubgroupsArr)

        setLessonContainerPosition(weekParityArr, newSubgroupsArr);
    }


    const subgroupsComponents = [];
    for(let i = 1; i <= props.activeCell.subgroupsCount; i++){

        subgroupsComponents.push((
            <label>
                {i}
                <input type="checkbox"
                       checked={subgroups.includes(i)}
                       data-subgroup={i}
                       onChange={(event) => {event.target.checked ? addSubgroup(i) : removeSubgroup(i)}}
                       className="lesson-editor__checkbox"/>
            </label>
        ));

    }


    return (
        // <div class="lesson-editor__position-editor">
        <>
            <div className="lesson-editor__week-parity-block">
                <span className="title">Чётность недель</span>
                <div className="lesson-editor__checkboxes">
                    {
                        weekParityComponents
                    }
                </div>
            </div>
            <div className="lesson-editor__subgroups-block">
                <span className="title">Подгруппы</span>
                <div className="lesson-editor__checkboxes">
                    {
                        subgroupsComponents
                    }
                </div>
            </div>
        </>
        // </div>
    );
};

export default LessonPositionEditor;