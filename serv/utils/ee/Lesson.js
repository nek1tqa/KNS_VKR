function capitalize(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export function getEmptyLessonData(){

    return {
        id: null,
        title: "",
        type: null,
        teachers: [],
        facultyDepartment: null,
        rooms: [],
        // weeks: [],
        weekRanges: [],
    };

}

export function getTeachersString(teachersData){

    const str = teachersData.map(teacherData => {

        let teacherString = `${capitalize(teacherData.surname)} ${teacherData.name.charAt(0).toUpperCase()}. ${teacherData.patronymic.charAt(0).toUpperCase()}.`;
        if(teacherData.post.trim().length)
            teacherString += `, ${teacherData.post}`;
        // if(teacherData.faculty_department.trim().length)
        //     teacherString += `, ${teacherData.faculty_department}`;
        return teacherString;

    }).join("/");

    return str;

}


export function getRoomsString(roomsData){

    const str = roomsData.map(roomData => {

        return getRoomString(roomData);

    }).join(", ");

    return str;

}

export function getRoomString(roomData){

    let str = roomData.number.toString();
    if(roomData.buildingNumber.trim().length)
        str += `(${roomData.buildingNumber}К.)`;
    return str;

}

export function getTeacherStringWithDepartment(teacherData){

    let teacherString = `${capitalize(teacherData.surname)} ${teacherData.name.charAt(0).toUpperCase()}. ${teacherData.patronymic.charAt(0).toUpperCase()}.`;
    if(teacherData.post.trim().length)
        teacherString += `, ${teacherData.post}`;

    // console.log(teacherData);

    if(teacherData.faculty_department.trim().length)
        teacherString += `, ${teacherData.faculty_department}`;
    return teacherString;

}

export function getWeekRangesString(weekRanges){

    return  weekRanges.length ?
        `[${weekRanges.map(weekRange => `${weekRange.start}-${weekRange.end}Н`).join(", ")}] ` :
        "";

}


export default class Lesson{

    constructor(data){

        // console.log(data)
        this.groupId = data.groupId;
        this.title = data.title;
        this.type = data.type;
        // console.log(data.teachers);
        this.teachers = [...data.teachers];
        // this.room = data.room;
        this.rooms = [...data.rooms];
        // this.weeks = data.weeks ? [...data.weeks] : [];
        this.weekRanges = [...data.weekRanges];
        this.facultyDepartment = data.facultyDepartment;

        this.text = [];
        this.updateText();

    }

    setTitle(value){

        this.title = value;
        this.updateText();

    }

    getTitle(){

        return this.title;

    }

    set(attr, value){

        this[attr] = value;
        this.updateText();

    }

    getFacultyDepartment(){

        return this.facultyDepartment ? {...this.facultyDepartment} : null;

    }

    setFacultyDepartment(data){

        this.facultyDepartment = data ? {...data} : null;
        this.updateText();

    }

    setTeachers(teachersData){
        this.teachers = Array.from(teachersData.filter((teacher) => teacher !== null));
        this.updateText();
    }

    setRooms(roomsData){
        this.rooms = Array.from(roomsData.filter((room) => room !== null));
        this.updateText();
    }

    getTeachers(){

        return this.teachers;

    }

    setWeekRanges(weekRanges){

        this.weekRanges = [...weekRanges];
        this.weekRanges.sort((a, b) => a.start - b.start);
        this.updateText();

    }

    getWeekRanges(){

        return [...this.weekRanges];

    }

    setType(typeData){
        this.type = typeData ? {...typeData} : null;
        this.updateText();
    }

    getType(){

        return this.type;

    }

    // setRoom(roomData){
    //     this.room = roomData ? {...roomData} : null;
    //     this.updateText();
    // }

    getRooms(){

        return [...this.rooms];

    }

    updateText(){

        this.text = [];
        // if(this.type === null || this.teacher === null || this.room === null){
        if(this.type === null || !this.rooms.length || (!this.teachers.length && this.facultyDepartment === null)){
            this.text.push("Ошибка");
            this.text.push("");
            return;
        }
        const weekRangesString = getWeekRangesString(this.weekRanges);
        // this.text.push(`${this.weekRanges.length ? `[${this.weekRanges[0]}-${this.weekRanges[1]}Н.] ` : ""}${this.title} (${this.type.value})`);
        this.text.push(`${weekRangesString} ${this.title} (${this.type.value})`);

        const teachersOrDepartmentsString = this.teachers.length ? getTeachersString(this.teachers) : this.facultyDepartment.name;
        this.text.push(`${teachersOrDepartmentsString}, ${getRoomsString(this.rooms)}`); // "%s, ауд. %s".format([this.teacher, this.room.number])

        this.text = this.text.map(str => str.toUpperCase());

    }

    getText(){

        return [...this.text];

    }

    getData(){

        return {
            groupId: this.groupId,
            title: this.title,
            type: this.type ? {...this.type} : null,
            teachers: [...this.teachers],
            rooms: [...this.rooms],
            facultyDepartment: this.facultyDepartment ? {...this.facultyDepartment} : null,
            // weeks: this.weeks,
            weekRanges: [...this.weekRanges]
        };


    }

    copy(){

        return new Lesson(this.getData());

    }

}


export class EmptyLesson{

    constructor(groupId){

        this.groupId = groupId;

    }

    getText(){

        return ["", ""];

    }

    getData(){

        return null;

    }

}
