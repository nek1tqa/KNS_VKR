import './App.css';
import TeachersPage from "./Pages/TeachersPage/TeachersPage";
import FacultiesPage from "./Pages/FacultiesPage";
import MainPage from "./Pages/MainPage/MainPage";
import LessonsPage from "./Pages/LessonsPage";
import LeftSideMenu from "./components/LeftSideMenu/LeftSideMenu";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MyRouter from "./Pages/MyRouter";
import {Container, Row} from "react-bootstrap";



function App() {
  return (
      <Container fluid>
        <Row>
          <MyRouter />
        </Row>

      </Container>
      // <>
      //     <BrowserRouter>
      //         <LeftSideMenu />
      //         <Routes>
      //             <Route path="/" element={<RoomsSchedulePage />} />
      //             <Route path='teachers' element={<TeachersPage />} />
      //             <Route path="lessons" element={<LessonsPage />} />
      //             <Route path="faculties" element={<FacultiesPage />} />
      //             {/*<Route path="rooms" element={<RoomsPage />} />*/}
      //         </Routes>
      //     </BrowserRouter>
      // </>


      // <TeachersList />
      // <TeachersPage />
      // <LessonsPage />
      // <FacultiesPage />
      // <RoomsSchedulePage />
  );
}

export default App;
