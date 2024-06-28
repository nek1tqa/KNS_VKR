import CRUDPage from "../components/CRUDPage/CRUDPage";
import serverHost from "../envVars";

const pageStyle = {
    display: "flex"
}

export default function LessonsPage(){

    return (
        <CRUDPage urls={{
                      get: serverHost.api + "/lessons",
                      insert: serverHost.api + "/lessons",
                      edit: serverHost.api + "/lessons/",
                      remove: serverHost.api + "/lessons/"
                  }}
                  title="Дисциплины"
                  searchableCols={["title"]}
                  struct={[
                      {name: "title", title: "Дисциплина", width: 100},
                  ]}
                  activePage="lessons"/>
    );

}