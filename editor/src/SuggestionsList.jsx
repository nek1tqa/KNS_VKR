import React, {useState} from 'react';
import SuggestionItem from "./SuggestionItem";

const SuggestionsList = (props) => {

    const items = props.items;
    // const [selectedItemIndex, setSelectedItemIndex] = useState(null);


    if(items === null || !items.length)
        return null;

    // const
    const selectHandler = (event) => {

        if(event.target.dataset.index)
            props.selectHandler(event.target.dataset.index)

    }

    return (
        <div className="input-with-suggestion__suggestions-block" onMouseDown={selectHandler}>
            {
                items.map((item, idx) => <SuggestionItem itemData={item} key={idx} index={idx} />)
            }
        </div>
    );
};

export default SuggestionsList;