import React, {useEffect, useState} from 'react';
import WeekRangeCalendarWeek from "./WeekRangeCalendar.Week";
import {getSingleElementValue} from "@testing-library/jest-dom/dist/utils";

const weekSize = 35;




const isFreeWeek = (weekNumber, weeksRanges, disabledWeekRanges) => {

    let isFreeWeek = true;
    for(let weekRange of weeksRanges)
        if(weekNumber >= weekRange.start && weekNumber <= weekRange.end){

            isFreeWeek = false;
            break;

        }

    if(isFreeWeek)
        for(let weekRange of disabledWeekRanges)
            if(weekNumber >= weekRange.start && weekNumber <= weekRange.end){

                isFreeWeek = false;
                break;

            }

    return isFreeWeek;

}

const isContainWR = (weekRange, weekRanges) => {

    const minWeek = weekRange.start;
    const maxWeek = weekRange.end;
    for(let weekRangeIt of weekRanges)
        if((weekRangeIt.start <= maxWeek && weekRangeIt.start >= minWeek) ||
            (weekRangeIt.end <= maxWeek && weekRangeIt.end >= minWeek))
            return true;
    return false;

}




const WeekRangeCalendar = (props) => {

    const maxWeeksInRow = 6;



    const minWeekNumber = props.minWeekNumber ? props.minWeekNumber : 1;
    const maxWeekNumber = props.maxWeekNumber ? props.maxWeekNumber : 18;
    const countOfWeeks = maxWeekNumber - minWeekNumber + 1;
    // const disabledWeekRanges = props.disabledWeekRanges ? props.disabledWeekRanges : [];


    const [disabledWeekRanges, setDisabledWeekRanges] = useState(props.disabledWeekRanges ? props.disabledWeekRanges : []);
    const [weeksRanges, setWeeksRanges] = useState(props.weekRanges ? props.weekRanges : []);
    const [selectedWeekNumber, setSelectedWeekNumber] = useState(null);
    const [hoveredWeek, setHoveredWeek] = useState(null);


    useEffect(() => {
        setWeeksRanges(props.weekRanges);
        // render();
    }, [props.weekRanges]);

    useEffect(() => {
        setDisabledWeekRanges(props.disabledWeekRanges);
        // render();
    }, [props.disabledWeekRanges]);


    const updateWeekRanges = (weekRanges) => {

        setWeeksRanges(weekRanges);
        props.updateWeekRangesCallback(weekRanges);

    }


    const clickHandler = (event) => {

        const weekNumber = parseInt(event.target.dataset.number);

        if(selectedWeekNumber === null){

            let isFreeWeekFlag = true;
            for(let weekRange of weeksRanges) {

                if (weekNumber === weekRange.start) {

                    setSelectedWeekNumber(weekRange.end);
                    setHoveredWeek(weekNumber);
                    updateWeekRanges(weeksRanges.filter(wr => wr !== weekRange));
                    // setWeeksRanges(weeksRanges.filter(wr => wr !== weekRange));
                    isFreeWeekFlag = false;
                    break;

                } else if (weekNumber === weekRange.end) {

                    setSelectedWeekNumber(weekRange.start);
                    setHoveredWeek(weekNumber);
                    updateWeekRanges(weeksRanges.filter(wr => wr !== weekRange));
                    // setWeeksRanges(weeksRanges.filter(wr => wr !== weekRange));
                    isFreeWeekFlag = false;
                    break;

                } else if (weekNumber > weekRange.start && weekNumber < weekRange.end) {

                    isFreeWeekFlag = false;
                    break;

                }

            }

            if(isFreeWeekFlag)
                for(let weekRange of disabledWeekRanges)
                    if(weekNumber >= weekRange.start && weekNumber <= weekRange.end){

                        isFreeWeekFlag = false;
                        break;

                    }


            if(isFreeWeekFlag){

                setSelectedWeekNumber(weekNumber);
                setHoveredWeek(weekNumber);

            }

        }else{

            if(weekNumber === selectedWeekNumber){

                setSelectedWeekNumber(null);
                setHoveredWeek(null);
                return;

            }


            const weekRange = {start: Math.min(weekNumber, selectedWeekNumber), end: Math.max(weekNumber, selectedWeekNumber)};
            if(isFreeWeek(weekNumber, weeksRanges, disabledWeekRanges) && !(isContainWR(weekRange, weeksRanges) || isContainWR(weekRange, disabledWeekRanges)))
                updateWeekRanges([...weeksRanges, weekRange]);
            setSelectedWeekNumber(null);
            setHoveredWeek(null);

        }








    }






    const render = () => {


        let weeksComponents = [];
        // console.log(props.weekRanges);
        // console.log(props.disabledWeekRanges);
        // alert("render");
        const hoveredWeekRange = selectedWeekNumber !== null ?
            {start: Math.min(selectedWeekNumber, hoveredWeek), end: Math.max(selectedWeekNumber, hoveredWeek)} :
            null;

        for(let i = 0; i < countOfWeeks; i++){

            // let color = "orange";
            let weekType = "default";
            let weekNumber = i + minWeekNumber;

            let isStartWeek = false;
            let isEndWeek = false;


            if(hoveredWeekRange && weekNumber >= hoveredWeekRange.start && weekNumber <= hoveredWeekRange.end){

                isStartWeek = weekNumber === hoveredWeekRange.start;
                isEndWeek = weekNumber === hoveredWeekRange.end;


                if(isContainWR(hoveredWeekRange, weeksRanges) || isContainWR(hoveredWeekRange, disabledWeekRanges))
                    // color = "red";
                    weekType = "error";
                else
                    // color = "blue";
                    weekType = "hovered";

            }else{

                let active = false;
                for(let weekRange of weeksRanges)
                    if(weekNumber >= weekRange.start && weekNumber <= weekRange.end){

                        isStartWeek = weekNumber === weekRange.start;
                        isEndWeek = weekNumber === weekRange.end;
                        if(hoveredWeekRange && weekNumber + 1 === hoveredWeekRange.start)
                            isEndWeek = true;
                        if(hoveredWeekRange && weekNumber - 1 === hoveredWeekRange.end)
                            isStartWeek = true;

                        active = true;
                        // color = "green";
                        weekType = "active";
                        break;

                    }

                let disabled = false;
                if(!active)
                    for(let weekRange of disabledWeekRanges)
                        if(weekNumber >= weekRange.start && weekNumber <= weekRange.end){

                            isStartWeek = weekNumber === weekRange.start;
                            isEndWeek = weekNumber === weekRange.end;
                            if(hoveredWeekRange && weekNumber + 1 === hoveredWeekRange.start)
                                isEndWeek = true;
                            if(hoveredWeekRange && weekNumber - 1 === hoveredWeekRange.end)
                                isStartWeek = true;
                            disabled = true;
                            // color = "gray";
                            weekType = "disabled";
                            break;

                        }

            }

            // if(weekNumber === 10)
            //     alert(weekType);
            weeksComponents.push(<WeekRangeCalendarWeek isStartWeek={isStartWeek} isEndWeek={isEndWeek} size={weekSize} type={weekType} number={weekNumber} key={i} index={i} />)

        }

        return weeksComponents;


    }







    const hoverHandler = (event) => {

        if(selectedWeekNumber === null)
            return;

        const weekNumber = parseInt(event.target.dataset.number);
        setHoveredWeek(weekNumber);

    }



    return (
        <div className="week-range-calendar">
            <div className="week-range-calendar__header">
                <span>Диапазон недель</span>
            </div>
            <div onMouseDown={clickHandler} onMouseMove={hoverHandler} onMouseLeave={() => {
                setSelectedWeekNumber(null);
                setHoveredWeek(null);
            }} style={{width: `${maxWeeksInRow*weekSize}px`}} className="week-range-calendar__main">
                {render()}
            </div>
        </div>
    );
};

export default WeekRangeCalendar;