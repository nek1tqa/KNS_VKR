import React from 'react';

const WeekRangeCalendarWeek = (props) => {

    // let color = "orange";
    // if(props.active)
    //     color = "green";
    // else if(props.disabled)
    //     color = "gray";
    // const color = props.color;

    const borderRadius = props.size/2;
    const borderStyle = {
        borderTopLeftRadius: props.isStartWeek ? borderRadius : 0,
        borderBottomLeftRadius: props.isStartWeek ? borderRadius : 0,
        borderTopRightRadius: props.isEndWeek ? borderRadius : 0,
        borderBottomRightRadius: props.isEndWeek ? borderRadius : 0,
    }


    return (
        <div className={`week-range-calendar__week`} data-number={props.number}>
            <div className={`week-range-calendar__week-inner week-range-calendar__week-inner_${props.type}`} style={{width: props.size, height: props.size, ...borderStyle}}  data-number={props.number}>
                {props.number}
            </div>
        </div>
    );
};

export default WeekRangeCalendarWeek;