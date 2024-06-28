// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';
import {Component, useRef} from "react";
import {Button, Col, FormControl, Row, InputGroup, Form, ButtonToolbar, ButtonGroup} from "react-bootstrap";
import React from 'react';

const style = {
    verticalAlign: "middle",
    textAlign: "center",
    cursor: "pointer"
}

function ButtonToolBar() {
    return null;
}


const CRUDSearch = (props) => {

    const inputRef = useRef();
    return (
        <Col xs={6}>
            <InputGroup>
                <FormControl ref={inputRef}
                             className="btn-without-shadow"
                             id="inlineFormInputGroup"
                             onKeyDown={event => event.key === "Enter" && props.setActiveData(inputRef.current.value)}
                             placeholder="Поиск"
                             onBlur={() => props.setActiveData(inputRef.current.value)}
                />
                <Button onClick={() => {props.setActiveData(inputRef.current.value)}}>Найти</Button>
            </InputGroup>
        </Col>
        // <div className="row">
        // </div>
    )
};

export default CRUDSearch;

// class CRUDSearch extends Component{
//
//     state = {
//         value: ""
//     };
//
//     onChangeHandler = (event) => {
//         this.setState({value: event.target.value});
//     }
//
//     save = () => {
//
//         let needToSave = false;
//         for(let col of this.props.struct){
//             if(this.props.data[col.name] !== this.state[col.name]){
//                 needToSave = true;
//                 break;
//             }
//         }
//         if(needToSave)
//             this.props.saveItem(this.state.id, this.state);
//         // this.props.editItem(null);
//
//     }
//
//     render(){
//
//         const {data} = this.props;
//
//         // console.log(!editing);
//         return (
//             <Row className="mb-2 mt-4 justify-content-between">
//                 <Col xs={6}>
//                     <InputGroup>
//                         <FormControl className="btn-without-shadow" id="inlineFormInputGroup" placeholder="Поиск" />
//                         <Button>Найти</Button>
//                     </InputGroup>
//                 </Col>
//                 <Col xs="auto">
//                     <ButtonToolbar>
//                         <ButtonGroup className="me-2">
//                             <Button disabled variant="outline-primary">Импорт</Button>
//                             <Button disabled variant="outline-primary">Экспорт</Button>
//                         </ButtonGroup>
//                         <Button onClick={this.props.handleShowModal}>Добавить</Button>
//                     </ButtonToolbar>
//                     {/*<InputGroup>*/}
//                     {/*</InputGroup>*/}
//                 </Col>
//             </Row>
//             // <div className="row">
//             // </div>
//         )
//
//     }
//
// }
//
// export default CRUDSearch;