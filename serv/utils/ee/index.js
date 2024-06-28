import exceljs from "exceljs";
import {
    days, defaultCellHeight, defaultFont,
    getAlphabetCoords,
    getNumericCoords, getTextHeightWithWraps, getTextWidth,
    initDayTitleColWidth, initLessonNumberTitleColWidth,
    mergeCellsByNumericCoords, writeDay, writeDaysSeparator,
    writeGroupsTitles
} from "./utils.js"
import {getFacultyPagesData, getGroupsData, getPageData, getScheduleData} from "./scheduleUtils.js";

//
//
// sheet.getColumn(5).width = 30;
//
// const row1 = sheet.getRow(5);
// const cell1 = row1.getCell(1);
// mergeCellsByNumericCoords(sheet, {row: 5, col: 1}, {row: 6, col: 1});
// cell1.value = "SUNDAY";
// cell1.font = {
//     bold: true
// };
// cell1.alignment = {
//     vertical: 'middle',
//     horizontal: 'center',
//     textRotation: "vertical"
// };
//
//
//
//
//
// const row2 = sheet.getRow(5);
// const cell2 = row2.getCell(2);
// cell2.value = "hello darkness my old friend";
// cell2.alignment = {
//     vertical: 'middle',
//     horizontal: 'left',
//     wrapText: true,
//     shrinkToFit: true
// };
//
//
// const row3 = sheet.getRow(6);
// const cell3 = row3.getCell(2);
// cell3.value = "hello darkness my old friend";
// cell3.alignment = {
//     vertical: 'middle',
//     horizontal: 'left',
//     wrapText: true,
//     shrinkToFit: true
// };
//
//



const pageId = 173;
const facultyId = 37;
const filename = "ИОиПП"
async function main(){

    const startCoords = {
        row: 5,
        col: 3
    };

    const workbook = new exceljs.Workbook();



    const facultyPagesData = await getFacultyPagesData(facultyId);

    // console.log(facultyPagesData);
    // return;
    for (const pageData of facultyPagesData) {

        pageData.struct = JSON.parse(pageData.struct);
        pageData.groups.forEach(group => {
            group.subgroupsCount = group.subgroups_count;
            delete group.subgroups_count;
        });
        // pageData.groups = JSON.parse(pageData.groups);
        const scheduleData = await getScheduleData(pageData.groups, pageData.struct.pageLessonNumbers);


        let sheetName = pageData.groups.map(group => group.name).join(", ");
        const replace = ["*", "?", ":", "\\", "/", "[", "]"];
        sheetName = replace.reduce((acc, sym) => acc.replaceAll(sym, ""), sheetName);

        const sheet = workbook.addWorksheet(sheetName);
        sheet.properties.defaultRowHeight = defaultCellHeight;



        initDayTitleColWidth(sheet, startCoords.col);

        const lessonNumbersCoords = {...startCoords};
        lessonNumbersCoords.col++;
        initLessonNumberTitleColWidth(sheet, lessonNumbersCoords.col);

        const groupsTitlesCoords = {...startCoords};
        groupsTitlesCoords.col += 2;
        writeGroupsTitles(sheet, pageData.groups, groupsTitlesCoords);


        const currentDayCoords = {...startCoords};
        currentDayCoords.row++;

        // writeDay(sheet, currentDayCoords, scheduleData[3], "Понедельник", 3, groupsData);
        let scheduleHeight = 0;
        days.map(day => {

            writeDay(sheet, currentDayCoords, scheduleData[day.index], day, pageData.groups);
            currentDayCoords.row += scheduleData[day.index].length*defaultCellHeight;

            if(day.separator){

                writeDaysSeparator(sheet, currentDayCoords, pageData.groups);
                currentDayCoords.row++;

            }

        });

        const scheduleWidth = pageData.groups.reduce((acc, group) => acc + group.subgroupsCount, 0) + 1;
        // startCoords

        const startCell = getAlphabetCoords(sheet, startCoords.col, startCoords.row);
        const endCell = getAlphabetCoords(sheet, startCoords.col + scheduleWidth, currentDayCoords.row + 1);
        sheet.pageSetup.printArea = `${startCell}:${endCell}`;
        sheet.pageSetup.fitToPage = true;
        sheet.pageSetup.paperSize = 9;
        console.log(sheetName, `${startCell}:${endCell}`);
        // getTextWidth("0000000000000000000000000000000000000000", "11pt Calibri");
        // getTextWidth("2Н. [2-3Н, 6-7Н, 10-11Н, 14-15Н, 17-18Н]", "11pt Calibri");

        // console.log(getTextHeightWithWraps("2Н. ПСИХОЛОГИЧЕСКАЯ ПОДГОТОВКА СОТРУДНИКОВ К ДЕЙСТВИЯМ В ЭКСТРЕМАЛЬНЫХ СИТУАЦИЯХ (ЛЕКЦ.)", 80, defaultFont));





    }
    workbook.xlsx.writeFile(`${filename}.xlsx`);


    // const pageData = await getPageData(pageId);
    // const groupsData = await getGroupsData(pageData.groupIds);
    // const scheduleData = await getScheduleData(groupsData, pageData.struct.pageLessonNumbers);

    // const sheetName = groupsData.map(group => group.name).join(", ");
    //
    // const sheet = workbook.addWorksheet(sheetName);
    // sheet.properties.defaultRowHeight = defaultCellHeight;
    //
    //
    //
    // initDayTitleColWidth(sheet, startCoords.col);
    //
    // const lessonNumbersCoords = {...startCoords};
    // lessonNumbersCoords.col++;
    // initLessonNumberTitleColWidth(sheet, lessonNumbersCoords.col);
    //
    // const groupsTitlesCoords = {...startCoords};
    // groupsTitlesCoords.col += 2;
    // writeGroupsTitles(sheet, groupsData, groupsTitlesCoords);
    //
    //
    // const currentDayCoords = {...startCoords};
    // currentDayCoords.row++;
    //
    // // writeDay(sheet, currentDayCoords, scheduleData[3], "Понедельник", 3, groupsData);
    // days.map(day => {
    //
    //     writeDay(sheet, currentDayCoords, scheduleData[day.index], day, groupsData);
    //     currentDayCoords.row += scheduleData[day.index].length*defaultCellHeight;
    //
    //     if(day.separator){
    //
    //         writeDaysSeparator(sheet, currentDayCoords, groupsData);
    //         currentDayCoords.row++;
    //
    //     }
    //
    // });
    //
    // // getTextWidth("0000000000000000000000000000000000000000", "11pt Calibri");
    // // getTextWidth("2Н. [2-3Н, 6-7Н, 10-11Н, 14-15Н, 17-18Н]", "11pt Calibri");
    //
    // // console.log(getTextHeightWithWraps("2Н. ПСИХОЛОГИЧЕСКАЯ ПОДГОТОВКА СОТРУДНИКОВ К ДЕЙСТВИЯМ В ЭКСТРЕМАЛЬНЫХ СИТУАЦИЯХ (ЛЕКЦ.)", 80, defaultFont));
    //
    //
    // workbook.xlsx.writeFile("test.xlsx");

}
main();













// ========= FOR SCHEDULE =========
//
// alignment = {
//     vertical: 'middle',
//     horizontal: 'left',
//     wrapText: true,
//     shrinkToFit: true
// };

// ========= DAYS STYLE =========
//
// font = {
//     bold: true
// };
// alignment = {
//     vertical: 'middle',
//     horizontal: 'center',
//     textRotation: "vertical"
// };
