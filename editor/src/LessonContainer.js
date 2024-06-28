import Lesson, {EmptyLesson} from "./Lesson";
import {checkSubgroupsArrCorrectness} from "./utils";

export class LessonContainer{

    constructor(lessonsArr, weekParity, subgroupsArr, groupId){

        if(subgroupsArr && !checkSubgroupsArrCorrectness(subgroupsArr))
            throw new Error("subgroups arr is not correct");
        this.lessons = [...lessonsArr];
        this.weekParity = weekParity;
        this.groupId = groupId;
        this.subgroups = [...subgroupsArr];

    }

    addLesson(lessonData){

        // lessonData = {
        //     id,
        //     groupId: this.groupId,
        //     title,
        //     type,
        //     teacher,
        //     room,
        //     weeks,
        //     weekRanges
        // }


        if(this.lessons.length === 2)
            throw new Error("count of lessons in lesson container is 2");

        const newLesson = new Lesson({...lessonData, groupId: this.groupId});
        this.lessons.push(newLesson);

    }

    removeLesson(index){

        if(index < 0 || index >= this.lessons.length)
            throw new Error("incorrect index");
        this.lessons.splice(index, 1);

        return this.lessons.length;

    }

    getHeight(){

        return 2*2*this.lessons.length;

    }

    getLessons(){

        return [...this.lessons];

    }

    getWeekParity(){

        if(this.weekParity === 0)
            debugger;
        return this.weekParity;

    }

    getSubgroups(){

        return [...this.subgroups];

    }

    setPosition(weekParityArr, subgroups){

        this.subgroups = [...subgroups];
        this.weekParity = weekParityArr.length === 2 ? null : weekParityArr[0];

    }

    copy(){

        const lessons = this.getLessons().map(lesson => lesson.copy());
        return new LessonContainer(lessons, this.weekParity, [...this.subgroups], this.groupId);

    }

}


export class EmptyLessonContainer{

    constructor(weekParity, subgroupsArr, groupId){

        // console.log(subgroupsArr);
        if(subgroupsArr && !checkSubgroupsArrCorrectness(subgroupsArr))
            throw new Error("subgroups arr is not correct");
        this.lessons = [new EmptyLesson(groupId)];
        this.weekParity = weekParity;
        this.groupId = groupId;
        this.subgroups = subgroupsArr ? [...subgroupsArr] : null;

    }

    getHeight(){

        return 2*2*this.lessons.length;

    }

    getLessons(){

        return [...this.lessons];

    }

    getWeekParity(){

        return this.weekParity;

    }

    getSubgroups(){

        return [...this.subgroups];

    }


}
