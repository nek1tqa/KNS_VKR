import {Nav} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import "./LeftSide.css"



export default function LeftSideMenuItem(props){

    return (
        // key={props.pageName}
        <li className="left-side-nav__item border-bottom">
            <NavLink style={{
                textDecoration: "none"
            }} to={"/" + props.pageName}>
                {props.value}
            </NavLink>
        </li>
    );

}