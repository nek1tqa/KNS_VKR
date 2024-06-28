import {useEffect, useState} from "react";
import CRUDTable from "./CRUDTable";
import "./CRUDPage.css";
import Loader from "../Loader";
import {Col, Container, Row} from "react-bootstrap";
import LeftSideMenu from "../LeftSideMenu/LeftSideMenu";
import CRUDModal from "./CRUDModal";
import CRUDTableHeader from "./CRUDTableHeader";
import CRUDTableBody from "./CRUDTableBody";
import CRUDSearch from "./CRUDSearch";
import CRUDButtons from "./CRUDButtons";

export const getActiveData = (text, data, searchableCols) => {

    if(!text)
        return [...data];
    text = text.toLowerCase();
    return data.filter((elem) => {
        for(let colName of searchableCols)
            if(elem[colName].toLowerCase().includes(text))
                return true;
        return false;
    });

}

const CRUDPage = (props) => {

    const [data, setData] = useState([]);
    const [activeData, setActiveData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingRowId, setEditingRowId] = useState(null);
    const [sortProp, setSortProp] = useState({
        colId: 0, direction: 1
    });
    const [searchText, setSearchText] = useState(null);
    const [modalShow, setModalShow] = useState(false);


    const editItem = (id) => {
        setEditingRowId(id);
    }

    const saveEditedItem = (itemData) => {

        setIsLoading(true);
        fetch(props.urls.edit + itemData.id.toString(), {
            method: "PUT",
            body: JSON.stringify(itemData),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async response => {

            if(response.status === 200){

                setIsLoading(false);
                setEditingRowId(null);
                setData(data.map(elem => elem.id === itemData.id ? itemData : elem));
                setActiveData(activeData.map(elem => elem.id === itemData.id ? itemData : elem));

            }else if(response.status === 500){
                alert((await response.json()).error);
            }

        }).catch((e) => {
            alert("При выполнении произошла ошибка, проверьте правильность введённых данных");
            console.log(e);
            setIsLoading(false);
            setEditingRowId(null);
        });

    }

    const insertItem = (itemData) => {

        setIsLoading(true);
        fetch(props.urls.insert, {
            method: "POST",
            body: JSON.stringify(itemData),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async response => {

            if(response.status === 201){

                const newItemData = await response.json();
                setIsLoading(false);

                const newData = [...data, {...newItemData}];
                setData(newData);

                const newActiveData = getActiveData(searchText, newData, props.searchableCols);
                setActiveData(newActiveData.sort((a, b) => {
                    const colName = props.struct[sortProp.colId].name;
                    return sortProp.direction * a[colName].localeCompare(b[colName], {sensitivity: true, numeric: true});
                }));

            }else if(response.status === 500){
                alert((await response.json()).error);
            }
            //search

        }).catch((e) => {
            alert("При выполнении произошла ошибка, проверьте правильность введённых данных");
            setIsLoading(false);
            console.error(e);
        });

    }

    const removeItem = (id) => {

        setIsLoading(true);
        fetch(props.urls.remove + id.toString(), {
            method: "DELETE",
        }).then(async response => {

            if(response.status === 200){

                setIsLoading(false);
                setData(data.filter(elem => elem.id !== id));
                setActiveData(activeData.filter(elem => elem.id !== id));

            }else if(response.status === 500){
                alert((await response.json()).error);
            }

        }).catch((e) => {
            alert("При выполнении произошла ошибка, проверьте правильность введённых данных");
            setIsLoading(false);
            console.error(e);
        });

    }

    const sortItems = (colId) => {

        let sortDirection = sortProp.colId === colId ? -sortProp.direction : 1;

        setSortProp({colId, direction: sortDirection});
        setActiveData(activeData.sort((a, b) => {
            const colName = props.struct[colId].name;
            return sortDirection * a[colName].localeCompare(b[colName], {sensitivity: true, numeric: true});
        }));

    }



    useEffect(function getDataFromServer(){

        fetch(props.urls.get).then((data) => {
            return data.json();
        }).then((data) => {

            const sortedData = data.sort((a, b) => {
                const colName = props.struct[sortProp.colId].name;
                return sortProp.direction * a[colName].localeCompare(b[colName], {sensitivity: true, numeric: true});
            })



            setIsLoading(false);
            setData([...sortedData]);
            setActiveData([...sortedData]);

        });

    }, []);







    const modal = props.modal ? props.modal : <CRUDModal struct={props.struct}
                             closeHandler={() => setModalShow(false)}
                             insertHandler={insertItem}/>;









    return (

        <>
                {/*<LeftSideMenu activePage={props.activePage}/>*/}
                <Col className="px-5">
                    <h1 className="crud-page__title mt-3">{props.title}</h1>
                    {/*<CRUDSearch handleShowModal={this.handleShow} />*/}
                    {/*<SearchForm searchHandler={this.searchHandler} data={this.state.data} />*/}

                    <Row className="mb-2 mt-4 justify-content-between">
                        <CRUDSearch setActiveData={(text) => {
                            setSearchText(text);
                            setActiveData(getActiveData(text, data, props.searchableCols));
                        }}/>
                        <CRUDButtons showModal={() => setModalShow(true)} />
                    </Row>
                    {
                        isLoading ?
                            <Loader/> :
                            <CRUDTable>
                                <CRUDTableHeader struct={props.struct} sortProp={sortProp}
                                                 sortItems={sortItems}/>
                                <CRUDTableBody struct={props.struct}
                                               data={activeData}
                                               editingRowId={editingRowId}
                                               editItem={editItem}
                                               saveEditedItem={saveEditedItem}
                                               removeItem={removeItem}
                                />
                            </CRUDTable>
                    }
                </Col>
            {
                modalShow ? modal : null
            }
        </>

    )

}

export default CRUDPage;
