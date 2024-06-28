import React from 'react';
import {getCellsVirtualTable, getDayVirtualTable} from "./utils";
import LessonNumber from "./LessonNumber";
import {useContext} from "react";
import {GlobalContext} from "./reducer";
import ContextMenu from "./ContextMenu";

const TableDay = (props) => {

    const {lessonRows, title, index, separator} = props;


    const {globalState, dispatcher} = useContext(GlobalContext);
    console.log(lessonRows);
    const virtualTable = getDayVirtualTable({lessonRows, title, index}, props.groups);

    console.log(virtualTable);



    // const cells = props.cells;
    // const virtualTableData = getCellsVirtualTable(cells);



    return (

        <>
            {

                virtualTable.map((row, index) => {

                    const cols = [];
                    row.forEach((col, idx) => {

                        if(col !== null){

                            if(col.needToRender){

                                const tdStyle = col.styles;
                                // if(col.groupId){
                                //
                                //     tdStyle.width = `${col.sizes.width*props.groupsColWidth[col.groupId]}ch`;
                                //     console.log(tdStyle.width);
                                //
                                // }
                                // if(col.borderBottom)
                                //     tdStyle.borderBottom = col.borderBottom;
                                // if(col.borderTop)
                                //     tdStyle.borderTop = col.borderTop;
                                // if(col.borderLeft)
                                //     tdStyle.borderLeft = col.borderLeft;
                                // if(col.borderRight)
                                //     tdStyle.borderRight = col.borderRight;


                                // const dataObj = {};
                                // if(col.type === "lesson" || col.type === "lessonNumber")
                                //     Object.keys(col.data).forEach((key) => dataObj[`data-${key}`] = col.data[key]);

                                const dataObj = {};
                                if(col.type === "lesson"){

                                    // console.log(col.data)
                                    Object.keys(col.data).forEach((key) => dataObj[`data-${key}`] = col.data[key]);
                                    if(globalState.activeLessonData && col.data.day_index === globalState.activeLessonData.dayIndex &&
                                        col.data.lesson_row_index === globalState.activeLessonData.lessonRowIndex &&
                                        col.data.cell_index === globalState.activeLessonData.cellIndex) {

                                        tdStyle.backgroundColor = "#dee1e4";
                                        // if(globalState.activeLessonData.lessonContainerIndex === null)
                                        //     tdStyle.backgroundColor = "#dee1e4";
                                        // else if(col.data.lesson_container_index === globalState.activeLessonData.lessonContainerIndex)
                                        //     tdStyle.backgroundColor = "#dee1e4";

                                        if (globalState.activeLessonData.lessonContainerIndex !== null &&
                                            col.data.lesson_container_index === globalState.activeLessonData.lessonContainerIndex)
                                            tdStyle.backgroundColor = "#bbc9d7";

                                    }
                                    // if()
                                    cols.push(
                                        <td
                                            style={tdStyle}
                                            rowSpan={col.sizes.height}
                                            colSpan={col.sizes.width}
                                            key={idx}
                                            data-type={col.type}
                                            {...dataObj}
                                        >
                                            {col.text}
                                        </td>
                                    );

                                }else if(col.type === "lessonNumber"){

                                    Object.keys(col.data).forEach((key) => dataObj[`data-${key}`] = col.data[key]);
                                    console.log(globalState.schedule[dataObj['data-day_index']][dataObj['data-lesson_row_index']]);

                                    cols.push(
                                        <LessonNumber dayIndex={dataObj['data-day_index']}
                                                      lessonRowIndex={dataObj['data-lesson_row_index']}
                                                      // style={tdStyle}
                                                      rowSpan={col.sizes.height}
                                                      colSpan={col.sizes.width}
                                                      key={`${dataObj['data-day_index']}d_${dataObj['data-lesson_row_index']}lr`}
                                                      // data={col.type}
                                        >
                                            {col.text}
                                        </LessonNumber>
                                    );

                                }else if(col.type === "day"){
                                    dataObj["data-day_index"] = col.data.dayIndex;
                                    // Object.keys(col.data).forEach((key) => dataObj[`data-${key}`] = col.data[key]);


                                    const contextMenuHandler = (event) => {

                                        event.preventDefault();
                                        const contextMenuComponent = <ContextMenu event={event} buttons={[
                                            {
                                                title: "Добавить",
                                                handler: () => {
                                                    const payload = {
                                                        dayIndex: parseInt(col.data.dayIndex),
                                                    };
                                                    dispatcher({type: "ADD_LESSON_ROW", payload});
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

                                    cols.push(
                                        <td
                                            style={tdStyle}
                                            rowSpan={col.sizes.height}
                                            colSpan={col.sizes.width}
                                            key={idx}
                                            data-type={col.type}
                                            onContextMenu={contextMenuHandler}
                                            {...dataObj}
                                        >
                                            {col.text}
                                        </td>
                                    );


                                }else{


                                    cols.push(
                                        <td
                                            style={tdStyle}
                                            rowSpan={col.sizes.height}
                                            colSpan={col.sizes.width}
                                            key={idx}
                                            // onContextMenu={}
                                            // data-type={col.type}
                                        >
                                            {col.text}
                                        </td>
                                    );

                                }

                                col.needToRender = false;

                            }

                        }else{

                            cols.push(
                                <td
                                    key={idx}>
                                </td>);

                        }

                    });




                    const trStyle = {};
                    // if(index === virtualTable.length-1)
                    //     trStyle.borderBottom = "2px solid black";
                    //
                    // console.log(trStyle);
                    // console.log(cols.length);
                    // if(cols.length)
                    //     return (
                    //         <tr key={index} style={trStyle}>{cols}</tr>
                    //     )
                    // else
                    //     return null;

                    return (
                        <tr key={index} style={trStyle}>{cols}</tr>
                    )

                })

            }


            {
                separator ? (

                    <tr style={{backgroundColor: "green", borderBottom: "2px solid black"}}>
                        <td colSpan="2" rowSpan="1"></td>
                        {
                            globalState.groups.map((group) => (<td colSpan={group.subgroupsCount} rowSpan="1"></td>))
                        }
                    </tr>

                ) : null
            }
            {/*<tr></tr>*/}

        </>
    );



};

export default TableDay;