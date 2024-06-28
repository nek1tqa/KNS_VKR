import React from 'react';
import {useContext} from "react";
import {GlobalContext} from "./reducer";
import ContextMenu from "./ContextMenu";

const ScheduleTableHeader = (props) => {

    // const cols = [];
    // props.groups.forEach((group) => {
    //     const subgroupWidth = group.width/group.subgroupsCount;
    //     for(let i = 0; i < group.subgroupsCount; i++)
    //         cols.push(<col style={}>)
    // });

    const {globalState, dispatcher} = useContext(GlobalContext);

    const contextMenuHandler = (event, groupIndex) => {

        event.preventDefault();
        event.target.blur();
        const contextMenuComponent = <ContextMenu event={event} buttons={[
            {
                title: "Изменить ширину",
                handler: () => {
                    const width = prompt(`Укажите ширину для ${props.groups[groupIndex].name}`, props.groups[groupIndex].width.toString());
                    if(width.trim().length)
                        dispatcher({type: "SET_GROUP_WIDTH", payload: {width: parseInt(width), groupIndex}});
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



    const setGroupWidth = (groupIndex) => {


    }

    return (
        <>
            <colgroup>
                <col span="2" style={{
                    width: `4ch`,
                    border: "2px solid black",
                }} />
                {
                    props.groups.map((group) => {
                        const subgroupWidth = group.width / group.subgroupsCount;
                        const colsArr = [];
                        for(let i = 0; i < group.subgroupsCount; i++){

                            const styles = {
                                width: `${subgroupWidth}ch`,
                            };
                            if(i === 0)
                                styles.borderLeft = "2px solid black";
                            else if(i === group.subgroupsCount - 1)
                                styles.borderRight = "2px solid black";
                            colsArr.push(<col key={`${group.id}.${i}`} span={1} style={styles} />)

                        }
                        return colsArr;
                    })
                }
            </colgroup>
            <thead>
                <tr style={{border: "2px solid black"}}>
                    <th colSpan={2} style={{minWidth: "6ch", maxWidth: "6ch"}}></th>
                    {
                        props.groups.map((group, idx) => {

                            const style = {
                                // minWidth: `${group.width}ch`,
                                // maxWidth: `${group.width}ch`,
                            };
                            return <th key={group.id} style={style} onContextMenu={(event) => {contextMenuHandler(event, idx)}} colSpan={group.subgroupsCount}>{group.name}</th>

                        })
                    }
                </tr>
            </thead>
        </>
    );

};

export default ScheduleTableHeader;