import React from 'react';
import {serverRootHost} from "./utils";
import {useContext} from "react";
import {GlobalContext} from "./reducer";

const Menu = (props) => {



    const {globalState, dispatcher} = useContext(GlobalContext);



    return (
        <div className="menu">
            <ul className="menu__list">
                <li className="menu__item">
                    <a href={serverRootHost}>Главная</a>
                </li>
                <li className="menu__item" onClick={() => {
                    dispatcher({type: "SAVE_PAGE"});
                }}>Сохранить</li>
                <li className="menu__item">
                    <a href="https://disk.yandex.ru/i/P0AwJKQyLD32wQ">Инструкция|Ответы на вопросы</a>
                </li>
            </ul>
        </div>
    );
};

export default Menu;