import './App.css';
import {logDOM} from "@testing-library/react";
import {useEffect, useReducer, useState} from "react";
import {
    getCellsVirtualTable, getGroupScheduleData, getGroupsData,
    getLessonContainerDataForRender,
    getLessonContainerPosAndSize,
    getLessonDataForRender, getPageData, getPageScheduleData, getScheduleData
} from "./utils";
import Table from "./Table";
import Lesson from "./Lesson";
import ScheduleTable from "./ScheduleTable";
import ScheduleTableHeader from "./ScheduleTableHeader";
import ScheduleTableBody from "./ScheduleTableBody";
import {GlobalContext, initialState, reducer} from "./reducer";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import React from "react";
import Editor from "./App";
import App from "./App";
import Test from "./Test";
// import Lesson from "./Lesson";



function AppContainer() {

    // const [schedule, setSchedule] = useState([[], [], [], [], [], []]);
    // const [groups, setGroups] = useState([]);
    //
    const [globalState, dispatcher] = useReducer(reducer, initialState);
    //
    //
    //




  return (

      <GlobalContext.Provider value={{globalState, dispatcher}}>
          <BrowserRouter basename="/editor">
              <Routes>
                  {/*<Route path={"/"} key={"test"} element={<Test />} />*/}
                  <Route path={"/:id"} key={"editor"} element={<App />} />
              </Routes>
          </BrowserRouter>
      </GlobalContext.Provider>


  );
}

export default AppContainer;