
const contextMenuHandler = (event) => {

    event.preventDefault();
    console.log(event.target.dataset)
    const type = event.target.getAttribute('data-type');

    let buttons = [];
    let component = null;
    let data = {};

    let contextMenu = {};
    switch(type){

        case "lesson":
            buttons.push({title: "Копировать", handler: () => {
                alert("copy");
            }});
            component = <ContextMenu buttons={buttons} />
            data = {
                    day_index: event.target.dataset.day_index,
                    lesson_row_index: event.target.dataset.lesson_row_index,
                    cell_index: event.target.dataset.cell_index,
                    lesson_container_index: event.target.dataset.lesson_container_index,
                    lesson_index: event.target.dataset.lesson_index,
            };
            break;
        case "lesson_number":
            buttons.push({title: "Удалить", handler: () => {
                    alert("copy");
            }});
            component = <ContextMenu buttons={buttons} />
            break;
        case "day":

            break;
        case "group_title":

            break;
        case "lesson_container_item":

            break;
        case "lesson_item":

            break;
        default:
            break;



    }

    return {
        component, data
    };

    // dispatcher({type: "SET_CONTEXTMENU", payload: contextMenu});



    console.log(event.target.getAttribute('data-type'));

}

// export default contextMenuHandler;
