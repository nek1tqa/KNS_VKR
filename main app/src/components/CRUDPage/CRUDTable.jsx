import Table from 'react-bootstrap/Table';
import React from 'react';

const CRUDTable = (props) => {

    return (

        <div style={{height: "80vh", overflowY: "scroll"}}>
            <Table striped bordered hover>
                {props.children}
            </Table>
        </div>

    );
};

export default CRUDTable;

