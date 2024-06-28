
export class LessonRow{

    constructor(number, cells){

        this.number = number;
        this.cells = [...cells];

    }

    getNumber(){
        return this.number;
    }

    setNumber(value){
        if(typeof value === "string")
            throw new Error("number value is string");
        if(value <= 0 || value > 8)
            throw new Error("invalid number value");

        // for(let cell of this.cells)
        //     cell.lessonNumber = value;
        this.number = value;
    }

    getCells(){
        return [...this.cells];
    }

    setCell(cell, cellIndex){

        this.cells[cellIndex] = cell;

    }

}