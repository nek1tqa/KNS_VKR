import React, {useRef} from 'react';
import {useState} from "react";
import {Button, Col, Form, Modal} from "react-bootstrap";
import {useEffect} from "react";
import serverHost from "../../envVars";
import SelectWithSuggestions from "../../components/SelectWithSuggestions";

console.log(serverHost);

const TeachersPageModal = (props) => {

    const applyHandlerType = useRef(props.data ? "edit" : "insert");

    console.log(props.data);
    const [state, setState] = useState(props.data ? props.data : {surname: "", name: "", patronymic: "", post: "", faculty_department: null});



    const getOnChangeHandler = (inputName) => {
        return (event) => {
            setState({...state, [inputName]: event.target.value});
        }
    }


    debugger;
    console.log(state);


    // useEffect(() => {
    //     // alert(props.data);
    //     // alert(props.data ? "a" : "b");
    //     applyHandlerType.current = props.data ? "edit" : "insert";
    // }, []);



    let faculty_department = null;
    if(state.faculty_department !== null)
        faculty_department = {value: state.faculty_department, data: {id: state.faculty_department_id}};
    console.log("qwe", state);
    console.log(faculty_department);

    return (
        <Modal show={true} onHide={props.closeHandler}>
            <Modal.Header closeButton>
                <Modal.Title>Добавление преподавателя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Col}>
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control value={state.surname} onChange={getOnChangeHandler("surname")} type="text" />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Имя</Form.Label>
                        <Form.Control value={state.name} onChange={getOnChangeHandler("name")} type="text" />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Отчество</Form.Label>
                        <Form.Control value={state.patronymic} onChange={getOnChangeHandler("patronymic")} type="text" />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Должность</Form.Label>
                        <Form.Control value={state.post} onChange={getOnChangeHandler("post")} type="text" />
                    </Form.Group>

                    <hr/>


                    <SelectWithSuggestions className="faculty_department-select"
                                           selectedItem={faculty_department}
                                           suggestionsLibrary={props.suggestionsData}
                                           label={"Кафедра"}
                                           set={(item) => {
                                               // console.log(suggestionsData.lessonTypes);
                                               // activeLesson.setRoom(item);
                                               if(item)
                                                   setState({...state, faculty_department: item.name, faculty_department_id: item.id});
                                               else
                                                   setState({...state, faculty_department: "", faculty_department_id: null});

                                               // debugger;
                                               // dispatcher({type: "UPDATE"})
                                           }}/>


                    <div>
                        {/*{*/}
                        {/*    state.departments.map((elem, idx) =>*/}
                        {/*        <FacultyDepartmentSubmodal editFunc={editDepartment} removeFunc={removeDepartment} state={elem} key={idx} index={idx} />)*/}
                        {/*}*/}
                    </div>
                </Form>



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


export default TeachersPageModal;
