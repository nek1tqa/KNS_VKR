import React from 'react';
import LeftSideMenu from "../components/LeftSideMenu/LeftSideMenu";
import {BrowserRouter, Route, Routes, useParams} from "react-router-dom";
import MainPage from "./MainPage/MainPage";
import TeachersPage from "./TeachersPage/TeachersPage";
import LessonsPage from "./LessonsPage";
import LeftSideMenuItem from "../components/LeftSideMenu/LeftSideMenuItem";
import RoomsPage from "./RoomsPage";
import FacultyPagesPage from "./FacultyPagesPage/FacultyPagesPage";
import LessonTypesPage from "./LessonTypesPage";
import FacultiesPage from "./FacultiesPage/FacultiesPage";
import RoomsSchedulePage from "./RoomsSchedulePage/RoomsSchedulePage";


const myRoutes = [
    {
        "name": "",
        "title": "Главная",
        "element": <MainPage />,
        "visible": true
    }, {
        "name": "faculty/:id",
        "title": "Страницы",
        "element": <FacultyPagesPage />,
        "visible": false
    }, {
        "name": "teachers",
        "title": "Преподаватели",
        "element": <TeachersPage />,
        "visible": true
    }, {
        "name": "lessons",
        "title": "Дисциплины",
        "element": <LessonsPage />,
        "visible": true
    }, {
        "name": "lesson_types",
        "title": "Типы пар",
        "element": <LessonTypesPage />,
        "visible": true
    }, {
        "name": "rooms",
        "title": "Аудитории",
        "element": <RoomsPage />,
        "visible": true
    }, {
        "name": "faculties",
        "title": "Факультеты",
        "element": <FacultiesPage />,
        "visible": true
    }, {
        "name": "rooms_schedule/:id",
        "title": "Шахматка",
        "element": <RoomsSchedulePage />,
        "visible": false
    },
    // {
    //     "name": "rooms_schedule",
    //     "title": "Шахматки",
    //     "element": <RoomsSchedulePage />,
    //     "visible": true
    // },
]


const MyRouter = () => {
    return (


        <BrowserRouter>
            <LeftSideMenu routes={myRoutes} />
            <Routes>
                {
                    myRoutes.map((page) => {
                        return (
                            <Route path={"/" + page.name} key={page.name} element={page.element} />
                        )
                    })
                }
                {/*<Route path="/" element={<RoomsSchedulePage />} />*/}
                {/*<Route path='teachers' element={<TeachersPage />} />*/}
                {/*<Route path="lessons" element={<LessonsPage />} />*/}
                {/*<Route path="faculties" element={<FacultiesPage />} />*/}
                {/*<Route path="rooms" element={<RoomsPage />} />*/}
            </Routes>
        </BrowserRouter>

    );
};

export default MyRouter;
