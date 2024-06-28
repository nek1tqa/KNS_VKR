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
import FacultiesPageHeader from "./FacultiesPageHeader";
import MainPageBodyFaculties from "./FacultiesPageBody";
import {useParams} from "react-router-dom";
import FacultiesPageBody from "./FacultiesPageBody";
import FacultiesPageModal from "./FacultiesPageModal";
import serverHost from "../../envVars";

const idColWidth = 5;
const buttonColWidth = 3;

const struct = [
    {name: "name", title: "Факультет", width: 40},
    {name: "dean", title: "ФИО декана", width: 60},
]


export default function FacultiesPage(props){

    const routeParams = useParams();
    const facultyId = routeParams.id;

    const urls = {
        get: serverHost.api + "/faculties",
        insert: serverHost.api + "/faculties",
        edit: serverHost.api + "/faculties/",
        remove: serverHost.api + "/faculties/"
    };


    const [activeData, setActiveData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalShowState, setModalShowState] = useState(false);
    const [editableData, setEditableData] = useState(null);




    const updateItem = (itemData, facultyId) => {

        console.log(itemData);



        if(!window.confirm(`Вы уверены, что хотите сохранить внесённые изменения?`))
            return;
        // itemData.departments = Array.from(itemData.departments.map(department => (department.id !== undefined ?
        //     {id: department.id, name: department.name} :
        //     {name: department.name})
        // ));

        // const preparedData =
        const url = urls.edit;

        // console.log(data, facultyId);
        // return;


        fetch(`${url}${facultyId}`, {
            method: "PUT",
            body: JSON.stringify(itemData),
            headers: {
                'Content-Type': 'application/json',
            }}
        ).then(async response => {

            if(response.status === 200){

                setActiveData(Array.from(activeData.map(item => item.id === itemData.id ? {...itemData} : item)));
                setEditableData(null);
                setModalShowState(false);

            }else if(response.status === 500){
                alert((await response.json()).error);
            }

        }).catch((data) => {
            console.log(data);
            alert("Возникла ошибка. Проверьте правильность введённых данных и значения во всех полях");
        });

    }



    const removeItem = (id) => {

        const item = activeData.find(elem => elem.id === id);
        // console.log(item);
        if(!window.confirm(`Вы уверены, что хотите удалить ${item.name}?\nБудут удалены также все страницы с расписанием этого факультета`))
            return;

        setIsLoading(true);
        fetch(urls.remove + id.toString(), {
            method: "DELETE",
        }).then(async response => {

            if(response.status === 200){

                setIsLoading(false);
                setActiveData(activeData.filter(elem => elem.id !== id));

            }else if(response.status === 500){
                alert((await response.json()).error);
            }

        }).catch((data) => {
            console.log(data);
            alert("Возникла ошибка. Проверьте правильность введённых данных и значения во всех полях");
        });

    }

    const openUpdateItemModal = (itemId) => {

        // console.log(...itemData.groups);
        setEditableData({...activeData.find(item => item.id === itemId)});
        setModalShowState(true);

    }

    const insertItem = (itemData) => {

        const url = urls.insert;

        fetch(url, {
            method: "POST",
            body: JSON.stringify(itemData),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(async response => {

            if(response.status === 200){

                const newItemData = await response.json();
                setActiveData([...activeData, {...newItemData}]);
                setModalShowState(false);
                // window.location.replace(`${serverHost.root}/editor/${data.payload.id}`);
            }else if(response.status === 500){
                alert((await response.json()).error);
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
                <h1 className="crud-page__title mt-3">Факультеты</h1>
                {/*<CRUDSearch handleShowModal={this.handleShow} />*/}
                {/*<SearchForm searchHandler={this.searchHandler} data={this.state.data} />*/}



                <Row className="mb-2 mt-4 justify-content-end">
                    <Col xs="auto">
                        <ButtonToolbar>
                            <Button onClick={() => setModalShowState(true)}>Добавить</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>


                {
                    isLoading ?
                        <Loader/> :
                        <CRUDTable>
                            <FacultiesPageHeader struct={struct} />
                            <FacultiesPageBody struct={struct}
                                               openUpdateItemModal={openUpdateItemModal}
                                               updateItem={updateItem}
                                               removeItem={removeItem}
                                               data={activeData} />
                        </CRUDTable>
                }
            </Col>

            {
                modalShowState ? <FacultiesPageModal
                    data={editableData}
                    facultyId={facultyId}
                    closeHandler={() => {setModalShowState(false); setEditableData(null);}}
                    insertHandler={insertItem} editHandler={updateItem} /> : null
            }


        </>

    )

}
