import React, {useCallback, useContext, useEffect} from 'react';
import {GlobalContext} from "./reducer";
import ScheduleTable from "./ScheduleTable";
import ScheduleTableHeader from "./ScheduleTableHeader";
import ScheduleTableBody from "./ScheduleTableBody";
import {useParams} from "react-router-dom";
import {getGroupsData, getPageData, getScheduleData, parseSchedule} from "./utils";
import LessonEditor from "./LessonEditor";
import Lesson, {EmptyLesson} from "./Lesson";
import {Cell} from "./Cell";
import {LessonContainer} from "./LessonContainer";
import Menu from "./Menu";
import WeekRangeCalendar from "./WeekRangeCalendar";

const App = () => {

    // alert(process.env.REACT_APP_API_URL);
    const routeParams = useParams();
    console.log(routeParams);
    // alert(routeParams);
    const pageId = routeParams.id;
    const {globalState, dispatcher} = useContext(GlobalContext);







    const clipboardHandler = useCallback(event => {

        const key = event.which || event.keyCode; // Detecting keyCode
        const ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false);

        // alert(key);
        if(key === 83 && ctrl){

            event.preventDefault();
            dispatcher({type: "SAVE_PAGE"});

        }else if(key == 86 && ctrl) {
            console.log("Ctrl+V is pressed.");
            // console.log(JSON.stringify(parseSchedule(globalState.schedule, globalState.groups)));
            // console.log(parseSchedule(globalState.schedule, globalState.groups));
            // console.log(globalState.clipboard)


            dispatcher({type: "PASTE_FROM_CLIPBOARD"});
            dispatcher({type: "UPDATE"});


        } else if (key === 67 && ctrl) {
            console.log("Ctrl+C is pressed.");
            console.log(globalState.activeLessonData)
            if (!globalState.activeLessonData)
                return;

            const {dayIndex, lessonRowIndex, cellIndex, lessonContainerIndex} = globalState.activeLessonData;
            const activeCell = globalState.schedule[dayIndex][lessonRowIndex].getCells()[cellIndex];
            // let clipboardValue = activeCell;
            if (lessonContainerIndex !== null) {

                const activeLessonContainer = activeCell.getLessonContainers()[lessonContainerIndex];
                if(activeLessonContainer)
                    dispatcher({type: "SET_CLIPBOARD", payload: {value: activeLessonContainer.copy()}});

            } else {
                if(activeCell.getLessonContainers().length)
                    dispatcher({type: "SET_CLIPBOARD", payload: {value: activeCell.copy()}});
            }

        }

    }, [globalState.activeLessonData])

    useEffect(() => {

        const f = async() => {

            const pageData = await getPageData(pageId);
            dispatcher({type: "UPDATE_PAGE", payload: pageData});

            const groupsData = await getGroupsData(pageData.groupIds);
            dispatcher({type: "UPDATE_GROUPS", payload: groupsData});

            const scheduleData = await getScheduleData(groupsData, pageData.struct.pageLessonNumbers);
            dispatcher({type: "UPDATE_SCHEDULE", payload: scheduleData});

        }
        f();


        setInterval(() => {
            dispatcher({type: "SAVE_PAGE"});
        }, 600000);



    }, [])

    useEffect(() => {

        document.addEventListener("keydown", clipboardHandler);
        return () => {document.removeEventListener("keydown", clipboardHandler)};

    }, [clipboardHandler])


    const {groups, schedule} = globalState;
    console.log(globalState)


    if(groups.length && schedule.length)
        return (

            <>
                {/*<LessonEditor />*/}


                {globalState.lessonEditorShow ? <LessonEditor /> : null}
                {globalState.contextMenu.component}
                <div className="app">

                    <Menu />
                    <ScheduleTable groups={groups}>
                        <ScheduleTableHeader groups={groups} />
                        <ScheduleTableBody schedule={schedule} groups={groups} />
                    </ScheduleTable>
                </div>


            </>

        );
    else
        return null;

};

export default App;