import React from 'react';
import {Button, ButtonGroup, ButtonToolbar, Col} from "react-bootstrap";

const CRUDButtons = (props) => {
    return (
        <Col xs="auto">
             <ButtonToolbar>
                 <ButtonGroup className="me-2">
                     <Button disabled variant="outline-primary">Импорт</Button>
                     <Button disabled variant="outline-primary">Экспорт</Button>
                 </ButtonGroup>
                 <Button onClick={props.showModal}>Добавить</Button>
             </ButtonToolbar>
        </Col>
    );
};

export default CRUDButtons;