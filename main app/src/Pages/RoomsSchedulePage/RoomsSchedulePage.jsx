
import React, {useEffect, useState} from "react";
// import {useEffect, useState} from "react";
import "../../mainAppTable.css"
import serverHost from "../../envVars";
import {NavLink, useParams} from "react-router-dom";
import Table from "react-bootstrap/Table";


const struct = [
    {name: "name", title: "Факультет", width: 100},
]

const urls = {
    getRoomsData: serverHost.api + "/rooms_schedule/pages/",
    getRoomsScheduleData: serverHost.api + "/rooms_schedule/pages/",
    // get: serverHost.api + "/faculties",
};

const prepareRoomsSchedule = (roomsData, roomsScheduleData) => {

    console.log(roomsData, roomsScheduleData);

    const result = {};
    roomsData.forEach(room => result[room.id] = [{}, {}, {}, {}, {}, {}]);

    roomsScheduleData.forEach(scheduleItem => {

        let lessonRow = result[scheduleItem.room_id][scheduleItem.day_number - 1][scheduleItem.lesson_number];
        if(lessonRow === undefined){

            result[scheduleItem.room_id][scheduleItem.day_number - 1][scheduleItem.lesson_number] = [];
            lessonRow = result[scheduleItem.room_id][scheduleItem.day_number - 1][scheduleItem.lesson_number];

        }

        lessonRow.push(scheduleItem);

    });

    return result;

}

export default function RoomsSchedulePage(props){

    const routeParams = useParams();
    const roomsSchedulePageId = routeParams.id;

    const [roomsScheduleData, setRoomsScheduleData] = useState([]);
    const [roomsData, setRoomsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(function getDataFromServer() {

        fetch(urls.getRoomsData + roomsSchedulePageId.toString()).then((data) => {
            return data.json();
        }).then((data) => {

            // setIsLoading(false);
            console.log(data);
            setRoomsData(data.rooms);

            const preparedRoomsSchedule = prepareRoomsSchedule(data.rooms, data.rooms_schedule);
            console.log(preparedRoomsSchedule);
            setRoomsScheduleData(preparedRoomsSchedule);

        });

    }, []);





    return (

        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    {
                        roomsData.map(room => {
                            return (
                                <th key={room.id}>
                                    {`${room.number}|${room.building_number}`}
                                </th>
                            )
                        })
                    }
                </tr>
                </thead>
                <tbody>
                {/*{*/}
                {/*    roomsScheduleData.map((row, index) => {*/}
                {/*        return (*/}
                {/*            <tr key={index} style={{height: "42px"}}>*/}
                {/*                {*/}
                {/*                    props.struct.map(col => <td key={col.name}>*/}
                {/*                        <NavLink style={{*/}
                {/*                            textDecoration: "none"*/}
                {/*                        }} to={`/faculty/${row['id']}`}>*/}
                {/*                            {row[col.name]}*/}
                {/*                        </NavLink>*/}
                {/*                    </td>)*/}
                {/*                }*/}
                {/*            </tr>*/}
                {/*        )*/}

                {/*    })*/}
                {/*}*/}
                </tbody>
            </Table>
        </>

    )

}
