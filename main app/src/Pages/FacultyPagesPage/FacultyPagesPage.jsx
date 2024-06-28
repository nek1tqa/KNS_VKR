import CRUDPage from "../../components/CRUDPage/CRUDPage";
import {Button, ButtonGroup, ButtonToolbar, Col, Container, Row} from "react-bootstrap";
import LeftSideMenu from "../../components/LeftSideMenu/LeftSideMenu";
import CRUDSearch from "../../components/CRUDPage/CRUDSearch";
import CRUDButtons from "../../components/CRUDPage/CRUDButtons";
import Loader from "../../components/Loader";
import CRUDTable from "../../components/CRUDPage/CRUDTable";
import CRUDTableHeader from "../../components/CRUDPage/CRUDTableHeader";
import CRUDTableBody from "../../components/CRUDPage/CRUDTableBody";
import CRUDModal from "../../components/CRUDPage/CRUDModal";
import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import EditableTableItem from "../../components/CRUDPage/EditableTableItem";
import TableItem from "../../components/CRUDPage/TableItem";
// import {useEffect, useState} from "react";
import "../../mainAppTable.css"
import FacultyPagesHeader from "./FacultyPagesHeader";
import MainPageBodyFaculties from "./FacultyPagesBody";
import {useParams} from "react-router-dom";
import FacultyPagesBody from "./FacultyPagesBody";
import FacultyPagesModal from "./FacultyPagesModal";
import serverHost from "../../envVars";

const idColWidth = 5;
const buttonColWidth = 3;

const struct = [
    {name: "title", title: "Группы", width: 100},
]


export default function FacultyPagesPage(props){

    const routeParams = useParams();
    const facultyId = routeParams.id;

    const urls = {
        // get: `http://umo.math.csu.ru/api/pages/byFacultyId/${facultyId}`,
        get: serverHost.api + `/pages/byFacultyId/${facultyId}`,
        insert: serverHost.api + "/pages",
        edit: serverHost.api + `/pages/`,
        remove: serverHost.api + `/pages/`,
    };


    const [activeData, setActiveData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalShowState, setModalShowState] = useState(false);
    const [editableData, setEditableData] = useState(null);






    const updateItem = (data, pageId) => {

        // console.log(data);

        if(!window.confirm(`Вы уверены, что хотите сохранить внесённые изменения?`))
            return;


        const preparedData = Array.from(data.map(group => (group.id !== undefined ?
            {id: group.id, name: group.name, subgroups_count: group.subgroupsCount} :
            {name: group.name, subgroups_count: group.subgroupsCount})
        ));
        const url = urls.edit;

        console.log(preparedData, pageId);
        // return;


        fetch(`${url}${pageId}`, {
            method: "PUT",
            body: JSON.stringify(Array.from(preparedData.map(group => ({
                ...group,
                faculties_id: facultyId
            })))),
            headers: {
                'Content-Type': 'application/json',
            }}
        ).then((data) => {
            return data.json();
        }).then((data) => {

            console.log(data);
            if(data.result === "ok"){

                setEditableData(null);
                setModalShowState(false);

                // window.location.replace(`${serverHost.root}/editor/${data.payload.id}`);
            }else{
                alert(data.error)
            }

        }).catch((data) => {
            console.log(data);
            alert("Возникла ошибка. Проверьте правильность введённых данных и значения во всех полях");
        });

    }



    const removeItem = (id) => {

        const item = activeData.find(elem => elem.id === id);
        // console.log(window.confirm(`Вы уверены, что хотите удалить лист с расписанием групп ${item.title}?`));
        if(!window.confirm(`Вы уверены, что хотите удалить лист с расписанием групп ${item.title}?`))
            return;

        setIsLoading(true);
        fetch(urls.remove + id.toString(), {
            method: "DELETE",
        }).then((data) => {
            return data.json()
        }).then((res) => {

            setIsLoading(false);
            // setActiveData(data.filter(elem => elem.id !== id));
            setActiveData(activeData.filter(elem => elem.id !== id));

        });

    }

    const openUpdateItemModal = (itemId) => {

        // console.log(...itemData.groups);
        setEditableData({...activeData.find(item => item.id === itemId)});
        setModalShowState(true);

    }

    const insertItem = (data) => {

        console.log(data);
        const preparedData = Array.from(data.map(group =>
            ({name: group.name, subgroups_count: group.subgroupsCount, faculties_id: facultyId})
        ));
        console.log(preparedData);
        const url = urls.insert;

        fetch(url, {
            method: "POST",
            body: JSON.stringify(preparedData),
            headers: {
                'Content-Type': 'application/json',
            }}
        ).then((data) => {
            return data.json();
        }).then((data) => {

            console.log(data);
            if(data.result === "ok"){
                window.location.replace(`${serverHost.root}/editor/${data.payload.id}`);
            }else{
                alert(data.error)
            }

        }).catch((data) => {
            console.log(data);
            alert("Возникла ошибка. Проверьте правильность введённых данных и значения во всех полях");
        });

    }




    useEffect(function getDataFromServer(){

        fetch(urls.get).then((data) => {
            return data.json();
        }).then((data) => {

            setIsLoading(false);
            setActiveData([...data]);

        });

    }, []);




    return (

        <>
            {/*<LeftSideMenu activePage={props.activePage}/>*/}
            <Col className="px-5">
                <h1 className="crud-page__title mt-3">Страницы с расписанием</h1>
                {/*<CRUDSearch handleShowModal={this.handleShow} />*/}
                {/*<SearchForm searchHandler={this.searchHandler} data={this.state.data} />*/}



                <Row className="mb-2 mt-4 justify-content-end">
                    <Col xs="auto">
                        <ButtonToolbar>
                            <Button onClick={() => setModalShowState(true)}>Добавить</Button>
                            <Button onClick={() => exportToExcel(true)}>Добавить</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>


                {
                    isLoading ?
                        <Loader/> :
                        <CRUDTable>
                            <FacultyPagesHeader struct={struct} />
                            <FacultyPagesBody struct={struct}
                                              openUpdateItemModal={openUpdateItemModal}
                                              updateItem={updateItem}
                                              removeItem={removeItem}
                                              data={activeData} />
                        </CRUDTable>
                }
            </Col>

            {
                modalShowState ? <FacultyPagesModal
                    data={editableData}
                    facultyId={facultyId}
                    closeHandler={() => {setModalShowState(false); setEditableData(null);}}
                    insertHandler={insertItem} editHandler={updateItem} /> : null
            }


        </>

    )

}
