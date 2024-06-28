import React, {useState} from 'react';
import {Button, Col, Form, Modal} from "react-bootstrap";

const CrudModal = (props) => {

    let startState = {};
    props.struct.forEach(elem => startState[elem.name] = "");

    const [state, setState] = useState(startState)

    const getOnChangeHandler = (inputName) => {
        return (event) => {
            setState({...state, [inputName]: event.target.value});
        }
    }

    return (
        <Modal show={true} onHide={props.closeHandler}>
            <Modal.Header closeButton>
                <Modal.Title>Добавление</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {
                        props.struct.map((col, id) => {
                            return (
                                <Form.Group key={col.name} as={Col} className={id !== props.struct.length - 1 && "mb-3"}>
                                    <Form.Label>{col.title}</Form.Label>
                                    <Form.Control value={state[col.name]} onChange={getOnChangeHandler(col.name)} type="text" autoFocus={!id}/>
                                </Form.Group>
                            )
                        })
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => {props.insertHandler(state); props.closeHandler()}}>
                    Добавить
                </Button>
            </Modal.Footer>
        </Modal>
    )

};

export default CrudModal;