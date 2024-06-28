import React, {useState} from 'react';
import {Col, Form, Row} from "react-bootstrap";

const FacultyDepartmentSubmodal = (props) => {

    const [state, setState] = useState(props.state);
    const [showState, setShowState] = useState(true);

    return (
        <>
            <div className="group-submodal">
                <div className="group-submodal__header">
                    <h4 className="group-submodal__header-text">
                        Кафедра #{props.index + 1}
                    </h4>
                    <div className="group-submodal__header-buttons">
                        <div className="group-submodal__header-button" onClick={() => {setShowState(!showState)}}>
                            {
                                showState ? <i className="bi bi-caret-up-fill ms-2"></i>
                                    : <i className="bi bi-caret-down-fill ms-2"></i>
                            }
                        </div>
                        <div className="group-submodal__header-button" onClick={() => {props.removeFunc(props.index)}}>
                            <i className="bi bi-x-lg"></i>
                        </div>
                    </div>
                </div>

                {
                    showState ?
                        <div className="group-submodal__body">
                            <Row>
                                <Col>
                                    <Form.Group as={Col} className={"mb-2"}>
                                        <Form.Label>Название кафедры</Form.Label>
                                        <Form.Control value={props.state.name} onChange={(e) => props.editFunc(props.index, {name: e.target.value})} type="text"/>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                        : null
                }

            </div>
        </>
    );

};

export default FacultyDepartmentSubmodal;