import CRUDPage, {getActiveData} from "../../components/CRUDPage/CRUDPage";
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
import MainPageBodyFaculties from "./TeachersPageBody";
import {useParams} from "react-router-dom";
import TeachersPageBody from "./TeachersPageBody";
import TeachersPageModal from "./TeachersPageModal";
import serverHost from "../../envVars";

const idColWidth = 5;
const buttonColWidth = 3;

const struct = [
    {name: "surname", title: "Фамилия", width: 18},
    {name: "name", title: "Имя", width: 18},
    {name: "patronymic", title: "Отчество", width: 18},
    {name: "post", title: "Должность", width: 16},
    {name: "faculty_department", title: "Кафедра", width: 30},
]

const searchableCols = ["surname", "name", "patronymic", "faculty_department"];


const urls = {
    get: serverHost.api + "/teachers",
    insert: serverHost.api + "/teachers",
    edit: serverHost.api + "/teachers/",
    remove: serverHost.api + "/teachers/",
    getSuggestions: serverHost.api + "/faculties/departments",
};




export default function TeachersPage(){


    const [data, setData] = useState([]);
    const [activeData, setActiveData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalShowState, setModalShowState] = useState(false);
    const [editableData, setEditableData] = useState(null);
    const [suggestionsData, setSuggestionsData] = useState(null);

    const [sortProp, setSortProp] = useState({
        colId: 0, direction: 1
    });
    const [searchText, setSearchText] = useState(null);



    const sortItems = (colId) => {

        let sortDirection = sortProp.colId === colId ? -sortProp.direction : 1;

        setSortProp({colId, direction: sortDirection});
        setActiveData(activeData.sort((a, b) => {
            const colName = struct[colId].name;
            return sortDirection * a[colName].localeCompare(b[colName], {sensitivity: true, numeric: true});
        }));

    }





    const updateItem = (itemData) => {

        // data.departments = Array.from(data.departments.map(department => (department.id !== undefined ?
        //     {id: department.id, name: department.name} :
        //     {name: department.name})
        // ));
        console.log(itemData);

        // const preparedData =
        const url = urls.edit;


        fetch(`${url}${itemData.id}`, {
            method: "PUT",
            body: JSON.stringify(itemData),
            headers: {
                'Content-Type': 'application/json',
            }}
        ).then(async response => {

            if(response.status === 200){
                setModalShowState(false);
                setEditableData(null);
                setActiveData(Array.from(activeData.map(elem => elem.id === itemData.id ? {...itemData} : elem)));
                setData(Array.from(data.map(elem => elem.id === itemData.id ? {...itemData} : elem)));
            }else if(response.status === 500){
                alert((await response.json()).error);
            }

        }).catch((data) => {
            console.log(data);
            alert("Возникла ошибка. Проверьте правильность введённых данных и значения во всех полях");
        });

    }

    const removeItem = (id) => {

        setIsLoading(true);
        fetch(urls.remove + id.toString(), {
            method: "DELETE",
        }).then(async response => {

            if(response.status === 200){

                setIsLoading(false);
                // setActiveData(data.filter(elem => elem.id !== id));
                setActiveData(activeData.filter(elem => elem.id !== id));
                setData(data.filter(elem => elem.id !== id));

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

        console.log(itemData);
        const url = urls.insert;

        fetch(url, {
            method: "POST",
            body: JSON.stringify(itemData),
            headers: {
                'Content-Type': 'application/json',
            }}
        ).then(async response => {

            if(response.status === 201){
                const newItemData = await response.json();
                setData([...data, {...newItemData}]);
                setActiveData([...data, {...newItemData}]);
                setModalShowState(false);
                // alert("ok");
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

            const sortedData = data.sort((a, b) => {
                const colName = struct[sortProp.colId].name;
                return sortProp.direction * a[colName].localeCompare(b[colName], {sensitivity: true, numeric: true});
            })

            setIsLoading(false);
            setData([...sortedData]);
            setActiveData([...sortedData]);

        });

        fetch(urls.getSuggestions).then((data) => {
            return data.json();
        }).then((data) => {

            setIsLoading(false);
            // setData([...data.result]);
            // setActiveData([...data.result]);
            console.log(data);
            setSuggestionsData(Array.from(data.map(item => ({value: item.name, data: item}))))

        });

    }, []);





    return (

        <>
            {/*<LeftSideMenu activePage={props.activePage}/>*/}
            <Col className="px-5">
                <h1 className="crud-page__title mt-3">Преподаватели</h1>
                {/*<CRUDSearch handleShowModal={this.handleShow} />*/}
                {/*<SearchForm searchHandler={this.searchHandler} data={this.state.data} />*/}



                {/*<Row className="mb-2 mt-4 justify-content-end">*/}
                {/*    <Col xs="auto">*/}
                {/*        <ButtonToolbar>*/}
                {/*            <Button onClick={() => setModalShowState(true)}>Добавить</Button>*/}
                {/*        </ButtonToolbar>*/}
                {/*    </Col>*/}
                {/*</Row>*/}


                <Row className="mb-2 mt-4 justify-content-between">
                    <CRUDSearch setActiveData={(text) => {
                        console.log(text);
                        setSearchText(text);
                        setActiveData(getActiveData(text, data, searchableCols));
                    }}/>
                    <CRUDButtons showModal={() => setModalShowState(true)} />
                </Row>
                {
                    isLoading ?
                        <Loader/> :
                        <CRUDTable>
                            <CRUDTableHeader struct={struct} sortProp={sortProp}
                                             sortItems={sortItems}/>
                            <TeachersPageBody struct={struct}
                                              openUpdateItemModal={openUpdateItemModal}
                                              updateItem={updateItem}
                                              removeItem={removeItem}
                                              data={activeData} />
                        </CRUDTable>
                }
            </Col>

            {
                modalShowState ? <TeachersPageModal
                    data={editableData}
                    suggestionsData={suggestionsData}
                    closeHandler={() => {setModalShowState(false); setEditableData(null);}}
                    insertHandler={insertItem} editHandler={updateItem} /> : null
            }


        </>

    )

}
