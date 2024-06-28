import CRUDPage from "../components/CRUDPage/CRUDPage";
import serverHost from "../envVars";

const pageStyle = {
    display: "flex"
}

export default function LessonTypesPage(){

    return (
        <CRUDPage urls={{
                      get: serverHost.api + "/lesson_types",
                      insert: serverHost.api + "/lesson_types",
                      edit: serverHost.api + "/lesson_types/",
                      remove: serverHost.api + "/lesson_types/"
                  }}
                  title="Типы пар"
                  searchableCols={["value"]}
                  struct={[
                      {name: "value", title: "Тип", width: 100},
                  ]}
                  activePage="lesson_types"/>
    );

}