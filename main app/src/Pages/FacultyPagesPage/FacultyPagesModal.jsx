import React, {useRef} from 'react';
import {useState} from "react";
import {Button, Col, Form, Modal} from "react-bootstrap";
import GroupSubmodal from "./GroupSubmodal";
import {useEffect} from "react";
import serverHost from "../../envVars";

console.log(serverHost);

const FacultyPagesModal = (props) => {

    const applyHandlerType = useRef(props.data ? "edit" : "insert");

    console.log(props.data);
    const [state, setState] = useState(props.data ?
        Array.from(props.data.groups.map(group => ({
            id: group.id,
            name: group.name,
            subgroupsCount: group.subgroups_count
        }))) : []);

    const addGroup = () => {
        setState([...state, {name: "", subgroupsCount: 2}]);
    }

    const editGroup = (index, data) => {

        setState(state.map((elem, elIndex) => {
            if(index === elIndex)
                return {...elem, ...data};
            else return elem;
        }))

    }

    const removeGroup = (index) => {

        setState(state.filter((elem, elIndex) => {
            return index !== elIndex;
        }))

    }



    // useEffect(() => {
    //     // alert(props.data);
    //     // alert(props.data ? "a" : "b");
    //     applyHandlerType.current = props.data ? "edit" : "insert";
    // }, []);


    return (
        <Modal show={true} onHide={props.closeHandler}>
            <Modal.Header closeButton>
                <Modal.Title>Добавление страницы</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {
                        state.map((elem, idx) =>
                            <GroupSubmodal editFunc={editGroup} removeFunc={removeGroup} state={elem} key={idx} index={idx} />)
                    }
                </Form>

                <Button variant="outline-success" onClick={addGroup}>
                    Добавить группу
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


export default FacultyPagesModal;