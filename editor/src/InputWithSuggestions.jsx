import React, {useEffect, useState} from 'react';
import SuggestionsList from "./SuggestionsList";

const InputWithSuggestions = (props) => {


    const minInputLength = props.minInputLength ? props.minInputLength : 0;
    const maxListLength = props.maxListLength ? props.maxListLength : 20;



    const suggestionsLibrary = props.suggestionsLibrary;

    const [value, setValue] = useState(props.value);
    const [suggestions, setSuggestions] = useState(null);

    const changeHandler = (event) => {

        setValue(event.target.value);
        props.set(event.target.value);
        if(event.target.value.length > minInputLength){

            if(suggestions && suggestions.length === 1 && suggestions[0].value === value)
                setSuggestions(null);

            const suggestionsArr = suggestionsLibrary.filter(item => {
                return item.value.toLowerCase().includes(event.target.value.toLowerCase());
            });
            console.log(suggestionsArr);
            setSuggestions(suggestionsArr.slice(0, Math.min(maxListLength, suggestionsArr.length)));
            // console.log();

        }else
            setSuggestions(null);

    }

    const selectHandlerByIndex = (itemIndex) => {

        // console.log(item)
        setValue(suggestions[itemIndex].value);
        props.set(suggestions[itemIndex].value);
        setSuggestions(null);
        console.log("select1");

    }

    const onBlurHandler = () => {
        setSuggestions(null);
        console.log("blur1");
    }

    useEffect(() => {
        setValue(props.value);
    }, [props.value])

    return (
        <div className={`input-with-suggestion ${props.className}`}>
            <label className="input-with-suggestion__label">
                {props.label}
                <input type="text" className="input-with-suggestion__input" onBlur={onBlurHandler} onChange={changeHandler} value={value}/>
            </label>
            <SuggestionsList items={suggestions} selectHandler={selectHandlerByIndex} />
        </div>
    );
};

export default InputWithSuggestions;