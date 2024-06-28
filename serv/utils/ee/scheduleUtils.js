import Lesson, {EmptyLesson, getRoomsString, getTeachersString} from "./Lesson.js";
import {Cell} from "./Cell.js";
import {LessonRow} from "./LessonRow.js";
import {lessonBottomPartCellStyle, lessonNumberCellStyle, lessonUpperPartCellStyle} from "./utils.js";
import {LessonContainer} from "./LessonContainer.js";

const serverHost = "http://umo.math.csu.ru/api";
const credentials = btoa('umo:csu247');
const auth = { "Authorization" : `Basic ${credentials}` };

export function getLessonDataForRender(lesson, weekParity, coords, sizes, positionData){ // size of lesson. Pos of lesson

    const lessonText = lesson.getText();

    const upperPartText = `${weekParity !== null && !(lesson instanceof EmptyLesson) ? weekParity.toString() + "Н. " : ""}${lessonText[0]}`;
    const lowerPartText = lessonText[1];

    const styles = {};

    const upperPart = {
        groupId: lesson.groupId,
        needToRender: true,
        type: "lesson",
        data: {...positionData},
        coords: {
            ...coords,
        },
        sizes: {
            ...sizes,
            height: sizes.height/2,
        },
        styles: lessonUpperPartCellStyle,
        text: upperPartText,
    };
    const lowerPart = {
        groupId: lesson.groupId,
        needToRender: true,
        type: "lesson",
        data: {...positionData},
        coords: {
            ...coords,
            y: coords.y + sizes.height/2,
        },
        sizes: {
            ...sizes,
            height: sizes.height/2,
        },
        styles: lessonBottomPartCellStyle,
        text: lowerPartText,
    };

    return {upperPart, lowerPart};

}


export function getLessonContainerDataForRender(lessonContainer, y, height, positionData){

    const lessonsDataForRender = [];

    const lessons = lessonContainer.getLessons();
    const needToSeparateLessons = lessons.length === 2 ? true : false;

    const lessonsWidth = Math.max(...lessonContainer.subgroups) - Math.min(...lessonContainer.subgroups) + 1;

    // alert(height)
    const lessonHeight = needToSeparateLessons ? height/2 : height;
    const sizes = {width: lessonsWidth, height: lessonHeight};

    const lessonX = Math.min(...lessonContainer.subgroups) - 1;
    const lessonWeekParity = lessonContainer.weekParity;

    lessons.forEach((lesson, index) => {

        const positionDataCopy = {...positionData, lesson_index: index};
        const lessonY = y + index*lessonHeight;
        const coords = {x: lessonX, y: lessonY};

        const lessonDataForRender = getLessonDataForRender(lesson, lessonWeekParity, coords, sizes, positionDataCopy);

        if(needToSeparateLessons)
            if(index === 0)
                lessonDataForRender.lowerPart.styles.border.bottom.style = "dashDot";
            else if(index === 1)
                delete lessonDataForRender.upperPart.styles.border.top;

        lessonsDataForRender.push(lessonDataForRender.upperPart, lessonDataForRender.lowerPart);

    });

    return lessonsDataForRender;

}


export function getLessonContainerPosAndSize(lessonContainer, heightData){

    const result = {
        y: null,
        height: null
    };

    const weekParity = lessonContainer.weekParity;

    if(weekParity){

        result.height = heightData.WPRowHeight[weekParity - 1];
        result.y = heightData.WPRowHeight[weekParity - 2] ? heightData.WPRowHeight[weekParity - 2] : 0;

    }else{

        result.height = heightData.height;
        result.y = 0;

    }

    return result;

}


export function getCellDataForRender(cell, heightData, positionData){

    const lessonsDataForRender = [];
    let flag = false;
    let flag2 = false;

    const lessonContainers = cell.getLessonContainers();
    lessonContainers.push(...cell.getEmptyLessonContainers());

    let ignoredIndexes = [];
    for(let lessonContainerIndex = 0; lessonContainerIndex < lessonContainers.length; lessonContainerIndex++){

        const lessonContainer = lessonContainers[lessonContainerIndex];
        if(ignoredIndexes.includes(lessonContainerIndex)){

            continue;

        }




        if(lessonContainer.getLessons().length === 1 && lessonContainer.getWeekParity()){

            let ignoredIndex = null;
            for(let j = lessonContainerIndex + 1; j < lessonContainers.length; j++){
                const anotherLessonContainer = lessonContainers[j];
                if(anotherLessonContainer.getLessons().length === 1 && anotherLessonContainer.getWeekParity()){

                    const subgroups1 = lessonContainer.getSubgroups();
                    const subgroups2 = anotherLessonContainer.getSubgroups();
                    let subgroupsEqualsFlag = true;
                    if(subgroups1.length !== subgroups2.length)
                        continue;
                    for(let subgroup of subgroups1)
                        if(!subgroups2.includes(subgroup)){
                            subgroupsEqualsFlag = false;
                            break;
                        }

                    if(!subgroupsEqualsFlag)
                        continue;


                    const lessonData1 = lessonContainer.getLessons()[0].getData();
                    const lessonData2 = anotherLessonContainer.getLessons()[0].getData();

                    if(lessonData1 === null || lessonData2 === null)
                        continue;
                    if(lessonData1.teachers.length !== lessonData2.teachers.length)
                        continue;

                    let teachersEqualsFlag = true;
                    for(let teacher1 of lessonData1.teachers){

                        let innerFlag = false;
                        for(let teacher2 of lessonData2.teachers)
                            if(teacher1.id === teacher2.id){
                                innerFlag = true;
                                break;
                            }
                        if(!innerFlag){
                            teachersEqualsFlag = false;
                            break;
                        }

                    }


                    if(lessonData1.title === lessonData2.title &&
                        lessonData1.type &&
                        lessonData2.type &&
                        lessonData1.type.id === lessonData2.type.id &&
                        teachersEqualsFlag
                        // lessonData1.weekRanges !== lessonData2.weekRanges
                    ){

                        flag2 = true;
                        const positionDataCopy = {...positionData, lesson_container_index: lessonContainerIndex};
                        const y = 0;
                        const height = heightData.height;
                        // const {y, height} = getLessonContainerPosAndSize(lessonContainer, heightData);
                        const LCLessonDataForRender = getLessonContainerDataForRender(lessonContainer, y, height, positionDataCopy);

                        debugger;



                        LCLessonDataForRender[0].text = LCLessonDataForRender[0].text.substring(4);
                        LCLessonDataForRender[0].sizes.height = heightData.WPRowHeight[0];

                        const teacherString = getTeachersString(lessonData1.teachers);
                        // const teacherString2 = getTeachersString(lessonData2.teachers);

                        LCLessonDataForRender[1].text = `${teacherString}, АУД. `;
                        LCLessonDataForRender[1].text += lessonContainer.getWeekParity() > anotherLessonContainer.getWeekParity() ?
                            `${getRoomsString(lessonData2.rooms)}/${getRoomsString(lessonData1.rooms)}` :
                            `${getRoomsString(lessonData1.rooms)}/${getRoomsString(lessonData2.rooms)}`;
                        // `${lessonData1.room.number}(${lessonData1.room.buildingNumber})/${lessonData2.room.number}(${lessonData2.room.buildingNumber})`;
                        LCLessonDataForRender[1].sizes.height = heightData.WPRowHeight[1];
                        LCLessonDataForRender[1].coords.y = heightData.WPRowHeight[0];

                        lessonsDataForRender.push(...LCLessonDataForRender);


                        ignoredIndex = j;
                        ignoredIndexes.push(ignoredIndex);

                    }

                }

            }

            if(!ignoredIndex){

                const positionDataCopy = {...positionData, lesson_container_index: lessonContainerIndex};
                const {y, height} = getLessonContainerPosAndSize(lessonContainer, heightData);
                const LCLessonDataForRender = getLessonContainerDataForRender(lessonContainer, y, height, positionDataCopy);
                lessonsDataForRender.push(...LCLessonDataForRender);
                // alert("55");

            }

        }else{

            const positionDataCopy = {...positionData, lesson_container_index: lessonContainerIndex};
            const {y, height} = getLessonContainerPosAndSize(lessonContainer, heightData);
            const LCLessonDataForRender = getLessonContainerDataForRender(lessonContainer, y, height, positionDataCopy);
            lessonsDataForRender.push(...LCLessonDataForRender);

        }



    }

    return lessonsDataForRender;

}


export function getHeightData(cells){

    const WPRowHeight = [0, 0];
    let height = 0;

    cells.forEach((cell) => {
        if(cell === null)
            return;

        const cellHeightData = cell.getHeight();
        if(cellHeightData.WPRowHeight){

            if(cellHeightData.WPRowHeight[0] > WPRowHeight[0])
                WPRowHeight[0] = cellHeightData.WPRowHeight[0];
            if(cellHeightData.WPRowHeight[1] > WPRowHeight[1])
                WPRowHeight[1] = cellHeightData.WPRowHeight[1];

        }else
        if(cellHeightData.height > height)
            height = cellHeightData.height;

    });

    if (WPRowHeight[0] + WPRowHeight[1] > height)
        height = WPRowHeight[0] + WPRowHeight[1];

    return {height, WPRowHeight};

}


export function getLessonsRowVirtualTable(lessonRow, groupsData, positionData){

    const lessonNumber = lessonRow.getNumber();
    const cells = lessonRow.getCells();

    let partIndex = 0;
    const groupsVirtualTable = [];

    const heightData = getHeightData(cells);
    const dataForRender = [];

    cells.forEach((cell, index) => {

        const positionDataCopy = {...positionData, cell_index: index};
        if(cell)
            dataForRender.push(getCellDataForRender(cell, heightData, positionDataCopy));

    });

    cells.forEach((cell, i) => { // init virtual table with groupCols

        groupsVirtualTable.push([]);
        for(let j = 0; j < heightData.height; j++){ // add row

            groupsVirtualTable[i].push([]);
            for(let k = 0; k < cell.subgroupsCount; k++) // add subgroup cols
                groupsVirtualTable[i][j].push(null);

        }


        dataForRender[i].forEach((partForRender, index) => {

            partIndex++;
            for(let x = partForRender.coords.x; x < partForRender.coords.x + partForRender.sizes.width; x++)
                for(let y = partForRender.coords.y; y < partForRender.coords.y + partForRender.sizes.height; y++)
                    groupsVirtualTable[i][y][x] = partForRender;
            // groupsVirtualTable[i][y][x] = partIndex;

        });

    });




    const lessonNumberPart = {
        needToRender: true,
        type: "lessonNumber",
        data: {
            lesson_row_index: lessonNumber,
            ...positionData
        },
        sizes: {
            width: 1,
            height: heightData.height,
        },
        styles: lessonNumberCellStyle,
        text: lessonNumber,
    };


    const virtualTable = [];

    // debugger
    for(let k = 0; k < heightData.height; k++)
        virtualTable.push([lessonNumberPart]);

    groupsVirtualTable.forEach((groupCol) => {
        groupCol.forEach((row, index) => virtualTable[index].push(...row));
    });

    // console.log(groupsVirtualTable)
    groupsVirtualTable.forEach((groupVirtualTable) => {

        groupVirtualTable[groupVirtualTable.length-1].forEach((part) => {
            part.styles.border.bottom.style = "thin"; //todo
        });
    })

    return virtualTable;

}


export function getDayVirtualTable(dayData, groupsData){

    let height = 0;
    const virtualTable = [];
    const dayIndex = dayData.index;

    dayData.lessonRows.forEach((lessonRow, lessonRowIndex) => {

        const cells = lessonRow.getCells();
        cells.forEach((cell, index) => {
            if(cell === null)
                cells[index] = new Cell([], groupsData[index].subgroupsCount, lessonRow.number, groupsData[index].id);
        });
        const lessonRowCopy = new LessonRow(lessonRow.number, cells);

        const positionData = {
            day_index: dayIndex,
            lesson_row_index: lessonRowIndex
        };
        const lessonRowVirtualTable = getLessonsRowVirtualTable(lessonRowCopy, groupsData, positionData);
        virtualTable.push(...lessonRowVirtualTable);
        height += lessonRowVirtualTable.length;

    });


    const dayPart = {
        needToRender: true,
        coords: {
            x: 0,
            y: 0
        },
        sizes: {
            width: 1,
            height: height,
        },
        styles: {
            verticalAlign: "center",
            writingMode: "vertical-lr",
            textOrientation: "upright",
            borderBottom: "2px solid black"
        },
        type: "day",
        data: {
            dayIndex
        },
        text: dayData.title,
    };

    virtualTable.forEach((virtualRow) => {
        virtualRow.unshift(dayPart);
    });

    return virtualTable;

}


export function convertLessonData(lessonData){

    const res = {
        groupId: lessonData.group_id,
        dayNumber: lessonData.day_number,
        lessonNumber: lessonData.lesson_number,
        title: lessonData.title,
        type: lessonData.type,
        teachers: Array.from(lessonData.teachers.map(teacher => ({
            id: teacher.id,
            name: teacher.name,
            surname: teacher.surname,
            patronymic: teacher.patronymic,
            post: teacher.post,
            faculty_department: teacher.faculty_department,
        }))),
        facultyDepartment: lessonData.faculty_department,
        // room: {
        //     id: lessonData.room_id,
        //     number: lessonData.room_number,
        //     buildingNumber: lessonData.room_building_number
        // },
        rooms: Array.from(lessonData.rooms.map(room => ({
            id: room.id,
            number: room.number,
            buildingNumber: room.building_number
        }))),
        weekParity: lessonData.week_parity,
        subgroups: lessonData.subgroups,
        weekRanges: lessonData.week_ranges,
        // weeks: lessonData.weeks ? JSON.parse(lessonData.weeks) : null,
        // weekRanges: lessonData.week_ranges ? JSON.parse(lessonData.week_ranges) : null,
    };

    return res;

}




export async function getGroupScheduleData(groupId, subgroupsCount) {

    const days = [[], [], [], [], [], []];

    const res = await fetch(serverHost + "/schedule/" + groupId.toString(), {
        headers: auth
    });
    const data = await res.json();
    const lessons = data.result;

    let prevDayNumber;
    let prevLessonNumber;
    let prevLessonWP;
    let prevLessonSubgroups;
    let lessonContainerLessons = [];
    let cellLessonContainers = []

    // alert(lessons.length)
    if(!lessons.length)
        return days;

    for(let i = 0; i < lessons.length; i++){

        const lesson = lessons[i];

        const lessonData = convertLessonData(lesson);
        if(prevDayNumber === undefined)
            prevDayNumber = lessonData.dayNumber;
        if(prevLessonNumber === undefined)
            prevLessonNumber = lessonData.lessonNumber;
        if(prevLessonWP === undefined)
            prevLessonWP = lessonData.weekParity;
        if(prevLessonSubgroups === undefined)
            prevLessonSubgroups = lessonData.subgroups;


        if(lessonContainerLessons.length && (
            prevLessonWP !== lessonData.weekParity ||
            prevLessonSubgroups.join(",") !== lessonData.subgroups.join(",") ||
            prevLessonNumber !== lessonData.lessonNumber ||
            prevDayNumber !== lessonData.dayNumber
        )){

            const lc = new LessonContainer(lessonContainerLessons, prevLessonWP, prevLessonSubgroups, groupId);
            cellLessonContainers.push(lc);
            lessonContainerLessons = [];

        }


        if(prevLessonNumber !== lessonData.lessonNumber || prevDayNumber !== lessonData.dayNumber){
            days[prevDayNumber-1].push(new Cell(cellLessonContainers, subgroupsCount, prevLessonNumber, groupId));
            cellLessonContainers = [];
        }

        lessonContainerLessons.push(new Lesson(lessonData));

        prevDayNumber = lessonData.dayNumber;
        prevLessonNumber = lessonData.lessonNumber;
        prevLessonWP = lessonData.weekParity;
        prevLessonSubgroups = lessonData.subgroups;

    }
    cellLessonContainers.push(new LessonContainer(lessonContainerLessons, prevLessonWP, prevLessonSubgroups, groupId));
    days[prevDayNumber-1].push(new Cell(cellLessonContainers, subgroupsCount, prevLessonNumber, groupId));

    return days;

}


export async function getScheduleData(groups, pageLessonNumbers){

    const lessonNumbersInDays = [...pageLessonNumbers];
    // const lessonNumbersInDays = [[], [], [], [], [], []];
    const scheduleOfGroups = [];
    for(let groupIndex = 0; groupIndex < groups.length; groupIndex++){

        const group = groups[groupIndex];
        // console.log(group)
        // alert(groups)
        const groupScheduleData = await getGroupScheduleData(group.id, group.subgroupsCount);
        scheduleOfGroups.push(groupScheduleData);

        groupScheduleData.forEach((day, dayIndex) => {
            day.forEach((cell) => {
                if(!lessonNumbersInDays[dayIndex].includes(cell.lessonNumber))
                    lessonNumbersInDays[dayIndex].push(cell.lessonNumber)
            })
        });

    }

    lessonNumbersInDays.forEach((day) => day.sort((a, b) => a - b));

    const scheduleCellsVirtualTable = [[], [], [], [], [], []];
    lessonNumbersInDays.forEach((day, dayIndex) => {
        day.forEach((lessonNumber) => {
            const cellsRowArr = [];
            // alert(scheduleOfGroups.length);
            scheduleOfGroups.forEach((groupSchedule, groupIndex) => {
                const cell = groupSchedule[dayIndex].find((cell) => cell.lessonNumber === lessonNumber);
                cellsRowArr.push(cell ? cell : new Cell([], groups[groupIndex].subgroupsCount, lessonNumber, groups[groupIndex].id));
            })
            scheduleCellsVirtualTable[dayIndex].push(new LessonRow(lessonNumber, cellsRowArr));
        })
    });

    return scheduleCellsVirtualTable;

}



export async function getGroupsData(groupIds){

    const groups = [];
    // console.log(groupIds.length);
    for(let groupId of groupIds){

        const res = await fetch(serverHost + "/groups/" + groupId.toString(), {
            headers: auth
        });
        const data = await res.json();
        const groupData = data.result;

        groups.push({
            id: groupData.id,
            name: groupData.name,
            subgroupsCount: groupData.subgroups_count,
            width: groupData.width
        });

    }

    return groups;

}

export async function getPageData(pageId){

    // console.log(pageId);
    const res = await fetch(serverHost + "/pages/" + pageId.toString(), {
        headers: auth
    });
    // console.log(res);
    const data = await res.json();
    const pageData = data.result;

    const resultData = {
        id: pageId,
        semesterId: pageData.semester_id,
        facultyId: pageData.faculty_id,
        groupIds: JSON.parse(pageData.group_ids),
        struct: JSON.parse(pageData.struct)
    };

    return resultData;

}


export async function getFacultyData(facultyId){

    // console.log(pageId);
    const res = await fetch(serverHost + "/faculties/" + pageId.toString(), {
        headers: auth
    });
    // console.log(res);
    const data = await res.json();
    const pageData = data.result;

    const resultData = {
        id: pageId,
        semesterId: pageData.semester_id,
        facultyId: pageData.faculty_id,
        groupIds: JSON.parse(pageData.group_ids),
        struct: JSON.parse(pageData.struct)
    };

    return resultData;

}

export async function getFacultyPagesData(facultyId){

    const res = await fetch(serverHost + "/pages/byFacultyId/" + facultyId.toString(), {
        headers: auth
    });
    const data = await res.json();
    const facultyPagesData = data.result;
    // console.log(facultyPagesData)
    // facultyPagesData.struct = JSON.parse(facultyPagesData.struct);

    return facultyPagesData;

}


















export function checkSubgroupsArrCorrectness(subgroupsArr){

    if(!subgroupsArr.length)
        return false;
    if(subgroupsArr.length == 1)
        return true;

    subgroupsArr.sort((a, b) => (a - b));
    for(let i = 0; i < subgroupsArr.length - 1; i++)
        if(subgroupsArr[i] + 1 !== subgroupsArr[i+1])
            return false;
    return true;

}



export function checkWeekParityArrCorrectness(weekParityArr){

    return weekParityArr.length ? true : false;

}











export function getTeacherString(teacher){
    return `${teacher.surname} ${teacher.name} ${teacher.patronymic}, ${teacher.post}`;
}

