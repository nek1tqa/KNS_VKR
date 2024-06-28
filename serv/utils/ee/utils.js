import {getDayVirtualTable} from "./scheduleUtils.js";
import {createCanvas} from "canvas";

export const days = [
    {
        index: 0,
        title: "Понедельник",
        separator: true
    },
    {
        index: 1,
        title: "Вторник",
        separator: true
    },
    {
        index: 2,
        title: "Среда",
        separator: true
    },
    {
        index: 3,
        title: "Четверг",
        separator: true
    },
    {
        index: 4,
        title: "Пятница",
        separator: true
    },
    {
        index: 5,
        title: "Суббота",
        separator: false
    },
];

export const defaultCellHeight = 8;

const dayTitleColWidth = 4;
const lessonNumberTitleColWidth = 4;

const groupNameCellStyle = {
    font: {
        bold: true
    },
    alignment: {
        vertical: 'middle',
        horizontal: 'center'
    },
    border: {
        top: {style: 'medium'},
        left: {style: 'medium'},
        bottom: {style: 'medium'},
        right: {style: 'medium'}
    },
    fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "FFFFFF"
        }
    }
};


export const lessonNumberCellStyle = {
    font: {
        // bold: true
    },
    alignment: {
        vertical: 'middle',
        horizontal: 'center'
    },
    border: {
        top: {style: 'medium'},
        left: {style: 'medium'},
        bottom: {style: 'medium'},
        right: {style: 'medium'}
    },
    fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "FFFFFF"
        }
    }
};

export const dayTitleCellStyle = {
    font: {
        // bold: true
    },
    alignment: {
        vertical: 'middle',
        horizontal: 'center',
        textRotation: "vertical"
    },
    border: {
        top: {style: 'medium'},
        left: {style: 'medium'},
        bottom: {style: 'medium'},
        right: {style: 'medium'}
    },
    fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "FFFFFF"
        }
    }
}

export const lessonUpperPartCellStyle = {
    alignment: {
        vertical: 'bottom',
        horizontal: 'center',
        wrapText: true,
        shrinkToFit: true
    },
    border: {
        top: {style: 'thin'},
        left: {style: 'thin'},
        // bottom: {style: 'thin'},
        right: {style: 'thin'}
    },
    fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "FFFFFF"
        }
    }
};

export const lessonBottomPartCellStyle = {
    alignment: {
        vertical: 'top',
        horizontal: 'center',
        wrapText: true,
        shrinkToFit: true
    },
    border: {
        // top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
    },
    fill: {
        type: "pattern",
		pattern: "solid",
        fgColor: {
            argb: "FFFFFF"
        }
    }
};


export const defaultFont = "11pt Calibri";
export const defaultRowHeight = 8*2;

export const getTextWidth = (text, font) => {

    const width = 600;
    const height = 600;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.font = font;
    let textMetrics = ctx.measureText(text);

    return textMetrics.width;

}


export const getTextHeightWithWraps = (text, maxWidthCH, font) => {

    const maxWidthString = "0".repeat(maxWidthCH - 1);
    const maxWidthPX = getTextWidth(maxWidthString, font);

    const splitText = text.split(" ");
    let countOfLines = 1;
    splitText.reduce((prev, cur) => {

        const newText = prev.concat(" ", cur);
        const newTextWidth = getTextWidth(newText, font);
        if(newTextWidth > maxWidthPX){
            countOfLines++;
            return cur;
        }
        return newText;

    }, "");

    return countOfLines*defaultRowHeight;

}

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



export const getAlphabetCoords = (sheet, col, row) => sheet.getRow(row).getCell(col)._address;

export const getNumericCoords = (sheet, alphabetCoords) => {
    const cell = sheet.getCell(alphabetCoords);
    return {
        row: cell.row,
        col: cell.col
    };
}

export const mergeCellsByNumericCoords = (sheet, numericCoords1, numericCoords2) => {
    // numericCoords1 < numericCoords2
    sheet.mergeCells(numericCoords1.row, numericCoords1.col, numericCoords2.row, numericCoords2.col);
}






export const initDayTitleColWidth = (sheet, col) => {
    sheet.getColumn(col).width = dayTitleColWidth;
}

export const initLessonNumberTitleColWidth = (sheet, col) => {
    sheet.getColumn(col).width = lessonNumberTitleColWidth;
}

export const writeCell = (sheet, coords, sizes, style, value) => {

    // MERGE CELLS
    if(sizes.width !== 1 || sizes.height !== 1){

        const endMergedCellCoords = {...coords};
        endMergedCellCoords.col += sizes.width - 1;
        endMergedCellCoords.row += sizes.height - 1;
        mergeCellsByNumericCoords(sheet, coords, endMergedCellCoords);

    }

    const cell = sheet.getCell(coords.row, coords.col);


    // STYLE
    Object.entries(style).forEach(([key, value]) => {

        cell[key] = value;

    });



    // VALUE
    cell.value = value;


}

export const writeGroupsTitles = (sheet, groups, startNumericCoords) => {

    const currentCoords = {...startNumericCoords};

    groups.map((group) => {

        const startGroupCellCoords = {...currentCoords};

        const subgroupWidth = group.width / group.subgroupsCount;
        for (let i = 0; i < group.subgroupsCount; i++) {

            // width
            sheet.getColumn(currentCoords.col).width = subgroupWidth;
            currentCoords.col++;

        }

        // const endGroupCellCoords = {...currentCoords};
        // endGroupCellCoords.col--;

        // console.log(startGroupCellCoords, {width: group.subgroupsCount, height: 1});
        writeCell(sheet, startGroupCellCoords, {width: group.subgroupsCount, height: 1}, groupNameCellStyle, group.name);



        // //merge
        // mergeCellsByNumericCoords(sheet, startGroupCellCoords, endGroupCellCoords);
        // const cell = sheet.getCell(startGroupCellCoords.row, startGroupCellCoords.col);
        //
        // //border
        // cell.border = groupNameCellStyle.border;
        //
        // //align
        // cell.alignment = groupNameCellStyle.alignment;
        //
        // //bold
        // cell.font = groupNameCellStyle.font;
        //
        // //value
        // cell.value = group.name;

    });

}


export const writeDay = (sheet, coords, lessonRows, day, groups) => {


    const currentCoords = {...coords};
    const virtualTable = getDayVirtualTable({lessonRows, title: day.title, index: day.index}, groups);


    // console.log(virtualTable[0], virtualTable[0].length, virtualTable.length);

    debugger

    virtualTable.map((row, index) => {

        currentCoords.col = coords.col;
        row.forEach((col, idx) => {

            if(col !== null){

                if(col.needToRender){

                    // console.log(currentCoords, col.sizes);
                    if(col.type === "lesson"){

                        const groupData = groups[col.data.cell_index];
                        const subgroupsCount = groupData.subgroupsCount;
                        const groupWidth = groupData.width;
                        const subgroupWidth = groupWidth/subgroupsCount;

                        const lessonWidth = col.sizes.width*subgroupWidth;

                        // debugger
                        const rowHeight = getTextHeightWithWraps(col.text, lessonWidth, defaultFont) / col.sizes.height;

                        const curHeight = sheet.getRow(currentCoords.row).height;
                        if(curHeight === undefined){

                            for(let row = currentCoords.row; row < currentCoords.row + col.sizes.height; row++)
                                sheet.getRow(row).height = defaultRowHeight/2;

                        }else if(curHeight < rowHeight){

                            // console.log(getAlphabetCoords(sheet, currentCoords.col, currentCoords.row));
                            // debugger
                            for(let row = currentCoords.row; row < currentCoords.row + col.sizes.height; row++)
                                sheet.getRow(row).height = rowHeight;

                        }

                        writeCell(sheet, currentCoords, col.sizes, col.styles, col.text);

                    }else if(col.type === "lessonNumber"){

                        writeCell(sheet, currentCoords, col.sizes, lessonNumberCellStyle, col.text);

                    }else if(col.type === "day"){


                        writeCell(sheet, currentCoords, col.sizes, dayTitleCellStyle, day.title);

                    }else{


                    }

                    col.needToRender = false;

                }
                // currentCoords.col += col.sizes.width;
                currentCoords.col++;

            }else{


            }

        });


        currentCoords.row++;

    })



    let row = coords.row;
    for(let lessonRowIndex = 0; lessonRowIndex < lessonRows.length; lessonRowIndex++){

        let col = coords.col + 2; // dayTitle and lessonNumber = 2 width
        groups.forEach(group => {

            drawBorders(sheet, {
                row: coords.row + lessonRowIndex*defaultCellHeight,
                col
            }, {
                width: group.subgroupsCount,
                height: defaultCellHeight
            }, "medium");
            col += group.subgroupsCount;

        });



    }




}


export const writeDaysSeparator = (sheet, coords, groups) => {

    const currentCoords = {...coords};
    const style = {
        border: {
            top: {style: 'medium'},
            left: {style: 'medium'},
            bottom: {style: 'medium'},
            right: {style: 'medium'}
        },
        fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "008000"
            }
        }
    };
    const groupsWidthSum = groups.reduce((acc, group) => acc + group.subgroupsCount, 0);

    writeCell(sheet, currentCoords, {height: 1, width: 2}, style, "");
    currentCoords.col += 2;
    writeCell(sheet, currentCoords, {height: 1, width: groupsWidthSum}, style, "");

}


export const drawBorders = (sheet, coords, sizes, borderStyle) => {

    for(let col = coords.col; col < coords.col + sizes.width; col++){

        const topCell = sheet.getCell(coords.row, col);
        topCell.border = {
            ...topCell.border,
            top: {
                style: borderStyle
            }
        };

        const bottomCell = sheet.getCell(coords.row + sizes.height - 1, col);
        bottomCell.border = {
            ...bottomCell.border,
            bottom: {
                style: borderStyle
            }
        };

    }

    for(let row = coords.row; row < coords.row + sizes.height; row++){

        const leftCell = sheet.getCell(row, coords.col);
        leftCell.border = {
            ...leftCell.border,
            left: {
                style: borderStyle
            }
        };

        const rightCell = sheet.getCell(row, coords.col + sizes.width - 1);
        rightCell.border = {
            ...rightCell.border,
            right: {
                style: borderStyle
            }
        };

    }


};







export const writeHeader = (sheet, startCoords, scheduleWidth) => {

    const coords = {...startCoords};
    coords.col += 2;

    


}
