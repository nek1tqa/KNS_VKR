import {EmptyLessonContainer, LessonContainer} from "./LessonContainer.js";
import {checkSubgroupsArrCorrectness, checkWeekParityArrCorrectness} from "./scheduleUtils.js";

export class Cell{

    constructor(lessonContainersArr, subgroupsCount, lessonNumber, groupId){

        this.lessonContainers = lessonContainersArr.length ? [...lessonContainersArr] : [];
        this.subgroupsCount = subgroupsCount;
        this.groupId = groupId;
        this.lessonNumber = lessonNumber;
        this.height = 0;
        this.WPRowHeight = [4, 4];


        this.table = [];
        this.updateTable();
        this.updateHeight();

    }

    updateTable(){

        this.table = [];
        for(let i = 0; i < 2; i++){
            this.table.push([]);
            for(let j = 0; j < this.subgroupsCount; j++)
                this.table[i].push(false);

        }

        this.lessonContainers.forEach((lessonContainer) => {
            const weekParity = lessonContainer.weekParity ? [lessonContainer.weekParity] : [1, 2];
            const minSubgroup = Math.min(...lessonContainer.subgroups);
            const maxSubgroup = Math.max(...lessonContainer.subgroups);
            weekParity.forEach((wp) => {
                for(let i = minSubgroup - 1; i < maxSubgroup; i++)
                    this.table[wp-1][i] = true;
            });
        });

    }

    updateHeight(){

        let maxHeight = 0;
        const maxWPRowHeight = [4, 4];

        this.lessonContainers.forEach((lessonContainer) => {

            if(lessonContainer.weekParity){

                if (maxWPRowHeight[lessonContainer.weekParity - 1] < lessonContainer.getHeight())
                    maxWPRowHeight[lessonContainer.weekParity - 1] = lessonContainer.getHeight();

            }else{

                if(lessonContainer.getHeight() > maxHeight)
                    maxHeight = lessonContainer.getHeight();

            }

        });

        if (maxWPRowHeight[0] + maxWPRowHeight[1] > maxHeight)
            maxHeight = maxWPRowHeight[0] + maxWPRowHeight[1];

        this.height = maxHeight;
        this.WPRowHeight = maxWPRowHeight;


    }

    addLessonContainer(lessonContainer = null){

        if(!this.isHasFreeSpace())
            throw new Error("not enough space for new lessonContainer");

        // if(lessonContainer)

        const emptyLessonContainer = this.getEmptyLessonContainers()[0];
        const weekParity = emptyLessonContainer.getWeekParity();
        const subgroupsArr = emptyLessonContainer.getSubgroups();


        const newLessonContainer = new LessonContainer([], weekParity, subgroupsArr, this.groupId);

        const LCIndex = this.lessonContainers.push(newLessonContainer) - 1;
        this.updateTable();
        this.updateHeight();

        // alert(this.height);
        // alert(this.WPRowHeight);
        return LCIndex;

    }

    removeLessonContainer(lessonContainerIndex){

        if(lessonContainerIndex < 0 || lessonContainerIndex >= this.lessonContainers.length)
            throw new Error("incorrect index");
        this.lessonContainers.splice(lessonContainerIndex, 1);
        this.updateTable();
        this.updateHeight();

    }

    addLesson(lessonData, lessonContainerIndex){

        this.lessonContainers[lessonContainerIndex].addLesson(lessonData);
        this.updateHeight();

        // alert(this.height);
        // alert(this.WPRowHeight);

    }

    removeLesson(lessonContainerIndex, lessonIndex){

        // debugger;
        const newLessonsCount = this.lessonContainers[lessonContainerIndex].removeLesson(lessonIndex);
        if(!newLessonsCount){

            this.lessonContainers.splice(lessonContainerIndex, 1);
            this.updateTable();

        }
        this.updateHeight();
        return newLessonsCount;

    }

    getLessonContainers(){

        return [...this.lessonContainers];

    }

    getEmptyLessonContainers(){

        if(!this.lessonContainers.length){

            const subgroups = Array.from(Array(this.subgroupsCount)).map((val, idx) => idx + 1);
            return [new EmptyLessonContainer(null, subgroups, this.groupId)];

        }

        const lessonContainers = [];

        for(let i = 0; i < this.subgroupsCount; i++){

            let weekParity = [];
            for(let j = 0; j < 2; j++)
                if(!this.table[j][i])
                    weekParity.push(j + 1);

            if(weekParity.length === 0)
               continue;
            else if(weekParity.length === 1)
                weekParity = weekParity[0];
            else if(weekParity.length === 2)
                weekParity = null;

            // console.log(weekParity)
            lessonContainers.push(new EmptyLessonContainer(weekParity, [i + 1], this.groupId));

        }

        return lessonContainers;

    }

    getHeight(){

        return {
            height: this.height,
            WPRowHeight: this.WPRowHeight
        };

    }

    isHasFreeSpace(){

        for(let i = 0; i < 2; i++)
            for(let j = 0; j < this.subgroupsCount; j++)
                if(!this.table[i][j])
                    return true;
        return false;

    }

    setLessonContainerPosition(LCIndex, weekParityArr, subgroups){

        if(!checkSubgroupsArrCorrectness(subgroups))
            throw new Error("subgroups arr is not correct");
        if(!checkWeekParityArrCorrectness(weekParityArr))
            throw new Error("weekParity arr is not correct");

        const lessonContainer = this.lessonContainers[LCIndex];
        console.log(LCIndex);
        this.removeLessonContainer(LCIndex);

        for(let subgroup of subgroups)
            for(let weekParity of weekParityArr)
                if(this.table[weekParity-1][subgroup-1]){

                    this.lessonContainers.splice(LCIndex, 0, lessonContainer);
                    this.updateTable();
                    throw new Error("занято");

                }

        lessonContainer.setPosition(weekParityArr, subgroups);
        this.lessonContainers.splice(LCIndex, 0, lessonContainer);

        this.updateTable();
        this.updateHeight();

    }

    copy(){

        const lessonContainersArr = this.getLessonContainers().map(lessonContainer => lessonContainer.copy());
        return new Cell(lessonContainersArr, this.subgroupsCount, this.lessonNumber, this.groupId);

    }

}


export class EmptyCell{



    constructor(subgroupsCount, groupId){

        this.lessonContainers = [new EmptyLessonContainer(null, Array.from(Array(subgroupsCount),(x, i) => i+1)), groupId];
        this.subgroupsCount = subgroupsCount;
        this.groupId = groupId;
        this.height = 0;
        this.WPRowHeight = [0, 0];


        this.table = [];
        this.updateTable();
        this.updateHeight();

    }

    updateTable(){

        this.table = [];
        for(let i = 0; i < 2; i++){
            this.table.push([]);
            for(let j = 0; j < this.subgroupsCount; j++)
                this.table[i].push(false);

        }

        this.lessonContainers.forEach((lessonContainer) => {
            const weekParity = lessonContainer.weekParity ? [lessonContainer.weekParity] : [1, 2];
            const minSubgroup = Math.min(...lessonContainer.subgroups);
            const maxSubgroup = Math.max(...lessonContainer.subgroups);
            weekParity.forEach((wp) => {
                for(let i = minSubgroup - 1; i < maxSubgroup; i++)
                    this.table[wp-1][i] = true;
            });
        });

    }

    updateHeight(){

        let maxHeight = 0;
        const maxWPRowHeight = [0, 0];

        this.lessonContainers.forEach((lessonContainer) => {

            if(lessonContainer.weekParity){

                if (maxWPRowHeight[lessonContainer.weekParity - 1] < lessonContainer.getHeight())
                    maxWPRowHeight[lessonContainer.weekParity - 1] = lessonContainer.getHeight();

            }else{

                if(lessonContainer.getHeight() > maxHeight)
                    maxHeight = lessonContainer.getHeight();

            }

        });

        if (maxWPRowHeight[0] + maxWPRowHeight[1] > maxHeight)
            maxHeight = maxWPRowHeight[0] + maxWPRowHeight[1];

        this.height = maxHeight;
        this.WPRowHeight = maxWPRowHeight;

    }

    getLessonContainers(){

        return [...this.lessonContainers];

    }

    getEmptyLessonContainers(){

        const lessonContainer = new EmptyLessonContainer(null, Array.from(Array(this.subgroupsCount).map((val, i) => i + 1)), this.groupId);
        return [lessonContainer];

    }

    getHeight(){

        return {
            height: this.height,
            WPRowHeight: this.WPRowHeight
        };

    }

}
