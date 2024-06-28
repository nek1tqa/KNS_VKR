import React, {useRef} from 'react';
import {useState} from "react";
import {Button, Col, Form, Modal} from "react-bootstrap";
import FacultyDepartmentSubmodal from "./FacultyDepartmentSubmodal";
import {useEffect} from "react";
import serverHost from "../../envVars";

console.log(serverHost);

const FacultiesPageModal = (props) => {

    const applyHandlerType = useRef(props.data ? "edit" : "insert");

    console.log(props.data);
    const [state, setState] = useState(props.data ? props.data : {name: "", dean: "", departments: []});



    const getOnChangeHandler = (inputName) => {
        return (event) => {
            setState({...state, [inputName]: event.target.value});
        }
    }

    const addDepartment = () => {
        setState({...state, departments: [...state.departments, {name: ""}]});
    }

    const editDepartment = (index, data) => {

        setState({...state, departments: Array.from(state.departments.map((elem, elIndex) => {
            if(index === elIndex)
                return {...elem, ...data};
            else return elem;
        }))});

    }

    const removeDepartment = (index) => {

        setState({...state, departments: state.departments.filter((elem, elIndex) => {
            return index !== elIndex;
        })});

    }

    debugger;
    console.log(state);


    // useEffect(() => {
    //     // alert(props.data);
    //     // alert(props.data ? "a" : "b");
    //     applyHandlerType.current = props.data ? "edit" : "insert";
    // }, []);


    return (
        <Modal show={true} onHide={props.closeHandler}>
            <Modal.Header closeButton>
                <Modal.Title>Добавление факультета</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Col}>
                        <Form.Label>Название факультета</Form.Label>
                        <Form.Control value={state.name} onChange={getOnChangeHandler("name")} type="text" />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>ФИО декана</Form.Label>
                        <Form.Control value={state.dean} onChange={getOnChangeHandler("dean")} type="text" />
                    </Form.Group>

                    <hr/>
                    <div>
                        {
                            state.departments.map((elem, idx) =>
                                <FacultyDepartmentSubmodal editFunc={editDepartment} removeFunc={removeDepartment} state={elem} key={idx} index={idx} />)
                        }
                    </div>
                </Form>

                <Button variant="outline-success" onClick={addDepartment}>
                    Добавить кафедру
                </Button>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => {
                    if(applyHandlerType.current === "insert")
                        props.insertHandler(state);
                    else if(applyHandlerType.current === "edit")
                        props.editHandler(state, props.data.id);
                }}>
                    {
                        applyHandlerType.current === "insert" ? "Добавить" : "Сохранить"
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    );

};


export default FacultiesPageModal;