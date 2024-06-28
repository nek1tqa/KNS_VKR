import {createContext} from "react";
import {LessonRow} from "./LessonRow";
import Lesson, {getEmptyLessonData} from "./Lesson";
import {parseSchedule, updateGroupsData, updateGroupsScheduleData, updatePageData} from "./utils";
import {Cell} from "./Cell";
import {LessonContainer} from "./LessonContainer";

export const initialState = {
    page: {},
    groups: [],
    schedule: [],
    contextMenu: {
        component: null,
        data: {}
    },
    activeLessonData: null,
    lessonEditorShow: false,
    clipboard: null
};
export const GlobalContext = createContext();



export const reducer = (state, action) => {

    switch(action.type){

        case "UPDATE_PAGE":
            return {
                ...state,
                page: action.payload
            };
            break;
        case "UPDATE_GROUPS":
            return {
                ...state,
                groups: action.payload
            };
            break;
        case "UPDATE_SCHEDULE":
            return {
                ...state,
                schedule: action.payload
            };
            break;
        case "SET_CONTEXTMENU":
            return {
                ...state,
                contextMenu: {
                    component: action.payload.component,
                    data: action.payload.data,
                }
            };
            break;
        case "SET_LESSON_NUMBER": {


            const value = parseInt(action.payload.value);
            if(!action.payload.value)
                return {...state};

            for(let lessonRow of state.schedule[action.payload.dayIndex])
                if(lessonRow.getNumber() === value)
                    return {...state};

            try{

                const lessonRowsInDay = state.schedule[action.payload.dayIndex];
                lessonRowsInDay[action.payload.lessonRowIndex].setNumber(value);
                lessonRowsInDay.sort((a, b) => a.getNumber() - b.getNumber());

            }catch(e){
                console.error(e);
            }finally{
                return {...state};
            }

            break;
        }
        case "REMOVE_LESSON_ROW":{

            // console.log(state.schedule[action.payload.dayIndex])
            if(state.schedule[action.payload.dayIndex].length > 3){
                state.schedule[action.payload.dayIndex].splice(action.payload.lessonRowIndex, 1);
                return {...state};
            }
            return state;
            break;

        }

        case "SET_ACTIVE_LESSON_DATA": {

            state.activeLessonData = {...action.payload};
            const {dayIndex, lessonRowIndex, cellIndex} = state.activeLessonData;
            const activeCell = state.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];
            if(action.payload.lessonContainerIndex === null){
                state.activeLessonData.lessonContainerIndex = null;
                state.activeLessonData.lessonIndex = null;
            }else{

                const lessonContainer = activeCell.getLessonContainers()[action.payload.lessonContainerIndex];
                if(!lessonContainer){
                        state.activeLessonData.lessonContainerIndex = null;
                        state.activeLessonData.lessonIndex = null;

                    }
            }



            // const lessonContainer = activeCell.getLessonContainers()[action.payload.lessonContainerIndex];
            //
            // console.log("AAAAAAAAAAA")
            // console.log(activeCell);
            //
            //
            // if(!lessonContainer){
            //
            //     state.activeLessonData.lessonContainerIndex = null;
            //     state.activeLessonData.lessonIndex = null;
            //
            // }




            state.activeLessonData = {...action.payload};
            return {...state};
        }
        case "ADD_LESSON": {

            let {dayIndex, lessonRowIndex, cellIndex} = state.activeLessonData;
            let activeCell = state.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];
            let lessonContainer = activeCell.getLessonContainers()[action.payload.lessonContainerIndex];

            try{
                const newLessonData = getEmptyLessonData();
                activeCell.addLesson(newLessonData, action.payload.lessonContainerIndex);
            }catch(e){
                console.error(e);
            }

            return {...state};

        }
        case "REMOVE_LESSON": {

            let {dayIndex, lessonRowIndex, cellIndex} = state.activeLessonData;
            let activeCell = state.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];
            const newLessonsCount = activeCell.removeLesson(action.payload.lessonContainerIndex, action.payload.lessonIndex);

            console.log(state.activeLessonData);
            console.log(action.payload);
            if(action.payload.lessonIndex === state.activeLessonData.lessonIndex &&
                action.payload.lessonContainerIndex === state.activeLessonData.lessonContainerIndex)
                state.activeLessonData = {...state.activeLessonData, lessonContainerIndex: null, lessonIndex: null};
            console.log(state.activeLessonData);

            if(!newLessonsCount)
                state.activeLessonData = {...state.activeLessonData, lessonContainerIndex: null, lessonIndex: null};

            return {...state};

        }
        case "REMOVE_LESSON_CONTAINER": {

            let {dayIndex, lessonRowIndex, cellIndex} = state.activeLessonData;
            let activeCell = state.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];
            activeCell.removeLessonContainer(action.payload.lessonContainerIndex);

            if(action.payload.lessonContainerIndex === state.activeLessonData.lessonContainerIndex)
                state.activeLessonData = {...state.activeLessonData, lessonContainerIndex: null, lessonIndex: null};

            return {...state};

        }
        case "ADD_LESSON_CONTAINER": {

            let {dayIndex, lessonRowIndex, cellIndex} = state.activeLessonData;
            let activeCell = state.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];

            try{
                const newLessonData = getEmptyLessonData();
                const lessonContainerIndex = activeCell.addLessonContainer();
                activeCell.addLesson(newLessonData, lessonContainerIndex);
                // activeCell.addLesson(newLessonData, action.payload.lessonContainerIndex);
            }catch(e){
                console.error(e);
            }

            return {...state};

        }
        case "ADD_LESSON_ROW": {

            const day = state.schedule[action.payload.dayIndex];
            if(day.length >= 8)
                return state;

            // const lessonNumbers = Array.from(day.map(lessonRow => lessonRow.getNumber()));
            const maxLessonNumber = day[day.length-1].getNumber();
            const minLessonNumber = day[0].getNumber();
            // const new

            let newLessonNumber = maxLessonNumber + 1;
            if(maxLessonNumber === 8){

                let flag = false;
                let i = day.length-1;
                for(i; i > 0; i--){

                    if(day[i].getNumber() - day[i-1].getNumber() !== 1){

                        flag = true;
                        newLessonNumber = day[i].getNumber() - 1;
                        break;

                    }

                }
                if(!flag)
                    newLessonNumber = day[0].getNumber() - 1;


                // if(minLessonNumber === 1)
                // newLessonNumber = maxLessonNumber + 1;
            }

            const cells = [];
            state.groups.forEach(group => {
                cells.push(new Cell([], group.subgroupsCount, newLessonNumber, group.id))
            });
            state.schedule[action.payload.dayIndex].push(new LessonRow(newLessonNumber, cells));
            day.sort((a, b) => a.getNumber() - b.getNumber());

            return {...state};

        }
        case "CLOSE_EDITOR":
            // state.activeLessonData = null;
            state.lessonEditorShow = false;
            return {...state};
        case "OPEN_LESSON_EDITOR": {

            // state.activeLessonData = {...action.payload};
            state.lessonEditorShow = true;
            // const {dayIndex, lessonRowIndex, cellIndex} = state.activeLessonData;
            // const activeCell = state.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];
            // const lessonContainer = activeCell.getLessonContainers()[action.payload.lessonContainerIndex];
            //
            // console.log("AAAAAAAAAAA")
            // console.log(activeCell);
            //
            //
            // if(!lessonContainer){
            //
            //     state.activeLessonData.lessonContainerIndex = null;
            //     state.activeLessonData.lessonIndex = null;
            //
            // }

            return {...state};

        }
        case "SET_CLIPBOARD": {
            state.clipboard = action.payload.value;
            return {...state};
        }
        case "PASTE_FROM_CLIPBOARD": {



            if (!state.clipboard)
                return state;

            if (!state.activeLessonData)
                return state;

            const {dayIndex, lessonRowIndex, cellIndex, lessonContainerIndex} = state.activeLessonData;
            const activeCell = state.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];

            if (state.clipboard instanceof Cell) {
                // cellInClipboard.groupId = globalState.groups[cellIndex].id;

                // if()
                if(lessonContainerIndex === null){


                    const cellInClipboard = state.clipboard;
                    const maxSubgroupsCount = activeCell.subgroupsCount;


                    const newLessonContainers = [];
                    const lessonContainers = cellInClipboard.getLessonContainers();
                    for(let lessonContainer of lessonContainers){

                        const LCSubgroups = lessonContainer.getSubgroups();
                        const newLCSubgroups = LCSubgroups.filter(subgroup => subgroup <= maxSubgroupsCount);
                        if(!newLCSubgroups.length)
                            continue;


                        const LCWeekParity = lessonContainer.getWeekParity();

                        const lessons = [];
                        lessonContainer.getLessons().forEach(lesson => lessons.push(new Lesson(lesson.getData())));

                        const newLC = new LessonContainer(lessons, LCWeekParity, newLCSubgroups, activeCell.groupId);
                        newLessonContainers.push(newLC);

                    }

                    const newCell = new Cell(newLessonContainers, maxSubgroupsCount, activeCell.lessonNumber, activeCell.groupId);

                    state.schedule[dayIndex][lessonRowIndex].setCell(newCell, cellIndex);

                }

            } else if (state.clipboard instanceof LessonContainer) {

                if (lessonContainerIndex !== null) {

                    const lessonContainers = activeCell.getLessonContainers();
                    let activeLessonContainer = lessonContainers[lessonContainerIndex];
                    let fromEmptyLC = false;
                    if(!activeLessonContainer){

                        fromEmptyLC = true;
                        const emptyLessonContainers = activeCell.getEmptyLessonContainers();
                        const selectedLessonContainer = emptyLessonContainers[lessonContainerIndex - lessonContainers.length];

                        activeLessonContainer = selectedLessonContainer;


                    }

                    const LCWeekParity = activeLessonContainer.getWeekParity();
                    const weekParityArr = LCWeekParity ? [LCWeekParity] : [1, 2];
                    const subgroups = activeLessonContainer.getSubgroups();

                    if(!fromEmptyLC)
                        activeCell.removeLessonContainer(lessonContainerIndex);

                    const newLCIndex = activeCell.addLessonContainer();
                    activeCell.setLessonContainerPosition(newLCIndex, weekParityArr, subgroups);
                    state.clipboard.getLessons().forEach((lesson) => {
                        activeCell.addLesson(lesson.getData(), newLCIndex);
                    });

                    state.activeLessonData = {
                        ...state.activeLessonData,
                        lessonContainerIndex: newLCIndex,
                        lessonIndex: 0
                    };

                }
            }



            return {...state};
        }
        case "SET_GROUP_WIDTH": {
            state.groups[action.payload.groupIndex].width = action.payload.width;
            return {...state};
        }
        case "SAVE_PAGE": {

            const struct = {pageLessonNumbers: null, unsavedCells: []};
            try{

                const {pageLessonNumbers, groupsSchedule, parseError} = parseSchedule(state.schedule, state.groups);
                struct.pageLessonNumbers = pageLessonNumbers;

                // console.log(state.page)
                // alert(state.page)
                updatePageData({id: state.page.id, struct});
                updateGroupsData(state.groups);
                updateGroupsScheduleData(groupsSchedule);
                if(parseError)
                    alert("Сохранено без учёта пар с ошибками");

            }catch (e){
                console.log(e);
                alert("Произошла ошибка при сохранении");
            }



        }
        case "UPDATE":
            return {...state};
        case "SET_LC_POSITION":
            try{

                const {dayIndex, lessonRowIndex, cellIndex} = state.activeLessonData;
                const activeCell = state.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];
                activeCell.setLessonContainerPosition(state.activeLessonData.lessonContainerIndex, action.payload.weekParityArr, action.payload.subgroups);
                return {...state};

            }catch(e){
                console.error(e);
                return state;
            }
            // const lessonContainer = activeCell.getLessonContainers()[action.payload.lessonContainerIndex];
        default:
            return state;

    }

}