import React, {useEffect} from 'react';
import {useContext} from "react";
import {GlobalContext} from "./reducer";

const ContextMenu = (props) => {

    const elemClassName = "context-menu";
    const {globalState, dispatcher} = useContext(GlobalContext);

    useEffect(() => {

        const handler = (event) => {
            // alert("heh");
            if(event.target.className !== elemClassName)
                dispatcher({
                    type: "SET_CONTEXTMENU",
                    payload: {
                        component: null,
                        data: null
                    }
                })
        };
        window.addEventListener("click", handler);

        return () => {
            window.removeEventListener("click", handler);
        }


    }, [])

    const close = () => {

        dispatcher({
            type: "SET_CONTEXTMENU",
            payload: {
                component: null,
                data: null
            }
        })

    }


    return (
        <div style={{top: props.event.pageY, left: props.event.pageX}} className={elemClassName}>
            <ul className={`${elemClassName}__list`}>
                {
                    props.buttons.map((buttonObj, index) => {
                        return <li key={index} className={`${elemClassName}__item`} onClick={(e) => {buttonObj.handler(e); close();}}>{buttonObj.title}</li>
                    })
                }
            </ul>
        </div>
    );
};

export default ContextMenu;