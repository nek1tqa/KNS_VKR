import LeftSideMenuItem from "./LeftSideMenuItem";
import {Col, Nav} from "react-bootstrap";


const pagesList = {
    "main": "Главная",
    "teachers": "Преподаватели",
    "rooms": "Аудитории",
    "lessons": "Дисциплины",
    "faculties": "Факультеты",
};



export default function LeftSideMenu(props){

    console.log(props)
    return (

        <Col xs={2} className="border-end px-0 vh-100" >
            <ul className="left-side-nav">
                {
                    props.routes.map((page) => {
                        if(page.visible)
                            return (
                                <LeftSideMenuItem value={page.title} key={page.name} pageName={page.name} />
                            )
                        else return null;
                    })
                }
            </ul>
            {/*<Nav className="d-block"*/}
            {/*     variant="pills"*/}
            {/*>*/}
            {/*</Nav>*/}
        </Col>

    );

}



// export default function LeftSideMenu(props){
//
//     const pagesList = {
//         "main": "Главная",
//         "teachers": "Преподаватели",
//         "rooms": "Аудитории",
//         "lessons": "Дисциплины",
//     };
//
//     return (
//
//         <Col xs={2} className="border-end px-0">
//              <Nav className="d-block"
//                  variant="pills"
//                  onSelect={selectedKey => alert(`selected ${selectedKey}`)}
//              >
//              {
//                  Object.keys(pagesList).map((key) => {
//                      return (
//
//                          <Nav.Item key={key}>
//                              <Nav.Link active={props.activePage === key} className="rounded-0" eventKey="key">
//                                  {pagesList[key]}
//                              </Nav.Link>
//                          </Nav.Item>
//
//                      )
//                  })
//              }
//              </Nav>
//
//         </Col>
//
//
//
//         // <div className="left-side-menu">
//         //     {
//         //         Object.keys(pagesList).map((key) => {
//         //             return <LeftSideMenuItem key={key} status={props.activePage === key} value={pagesList[key]}/>
//         //         })
//         //     }
//         // </div>
//     );
//
// }