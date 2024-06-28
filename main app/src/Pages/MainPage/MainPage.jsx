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
import MainPageHeader from "./MainPageHeader";
import MainPageBodyFaculties from "./MainPageBodyFaculties";
import serverHost from "../../envVars";

const idColWidth = 5;
const buttonColWidth = 3;

const struct = [
    {name: "name", title: "Факультет", width: 100},
]

const urls = {
    get: serverHost.api + "/faculties",
    // get: serverHost.api + "/faculties",
};

export default function MainPage(props){

    const [activeData, setActiveData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


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
                <h1 className="crud-page__title mt-3">Расписание факультетов</h1>
                {/*<CRUDSearch handleShowModal={this.handleShow} />*/}
                {/*<SearchForm searchHandler={this.searchHandler} data={this.state.data} />*/}

                {
                    isLoading ?
                        <Loader/> :
                        <CRUDTable>
                            <MainPageHeader struct={struct} />
                            <MainPageBodyFaculties struct={struct}
                                                   data={activeData} />
                        </CRUDTable>
                }
            </Col>
        </>

    )

}
