import React from 'react';
import {useEffect, useState} from "react";
import SuggestionsList from "./SuggestionsList";
import {logDOM} from "@testing-library/react";

const SelectWithSuggestions = (props) => {


    const minInputLength = props.minInputLength ? props.minInputLength : -1;
    const maxListLength = props.maxListLength ? props.maxListLength : 20;



    const suggestionsLibrary = props.suggestionsLibrary;

    const [selectedItem, setSelectedItem] = useState(props.selectedItem || null);
    const [value, setValue] = useState(props.selectedItem ? props.selectedItem.value : "");
    const [suggestions, setSuggestions] = useState(null);

    console.log(props.selectedItem)

    const changeHandler = (event) => {

        setValue(event.target.value);
        // props.set(event.target.value);
        if(event.target.value.length > minInputLength){

            // console.log(suggestions);
            // if(suggestions && suggestions.length === 1 && suggestions[0].data.id === selectedItem.data.id)
            //     setSuggestions(null);

            const suggestionsArr = suggestionsLibrary.filter(item => {
                return item.value.toLowerCase().includes(event.target.value.toLowerCase());
            });
            setSuggestions(suggestionsArr.slice(0, Math.min(maxListLength, suggestionsArr.length)));
            console.log(suggestionsArr);
            console.log(suggestionsArr.slice(0, Math.min(maxListLength, suggestionsArr.length)));
            console.log(maxListLength, suggestionsArr.length)
            // console.log();

        }else
            setSuggestions(null);

    }

    const selectHandlerByIndex = (itemIndex) => {

        console.log(itemIndex);
        setValue(suggestions[itemIndex].value);
        setSelectedItem(suggestions[itemIndex]);
        props.set(suggestions[itemIndex].data);
        setSuggestions(null);
        console.log("select");

    }

    const onBlurHandler = () => {
        console.log("blur");
        setSuggestions(null);
        if(!selectedItem || selectedItem.value !== value){
            setSelectedItem(null);
            props.set(null);
            setValue("");
        }
    }

    useEffect(() => {
        // setSelectedItem(props.selectedItem);
        if(props.selectedItem)
            setValue(props.selectedItem.value);
        else
            setValue("");

        // setValue(props.value);
    }, [props.selectedItem])

    return (
        <div className={`input-with-suggestion ${props.className}`}>
            <label className="input-with-suggestion__label">
                {props.label}
                <input type="text" className="input-with-suggestion__input" onFocus={changeHandler} onBlur={onBlurHandler} onChange={changeHandler} value={value}/>
            </label>
            <SuggestionsList items={suggestions} selectHandler={selectHandlerByIndex} />
        </div>
    );

};

export default SelectWithSuggestions;