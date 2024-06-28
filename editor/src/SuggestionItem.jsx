import React from 'react';

const SuggestionItem = (props) => {

    // props.data
    return (
        <div data-index={props.index} className="input-with-suggestion__suggestion-item">
            {props.itemData.value}
        </div>
    );
};

export default SuggestionItem;