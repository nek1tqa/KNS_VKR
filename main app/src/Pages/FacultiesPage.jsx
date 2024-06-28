import CRUDPage from "../components/CRUDPage/CRUDPage";
import serverHost from "../envVars";

const pageStyle = {
    display: "flex"
}

export default function FacultiesPage(){

    return (
        <CRUDPage urls={{
                      get: serverHost.api + "/faculties",
                      insert: serverHost.api + "/faculties",
                      edit: serverHost.api + "/faculties/",
                      remove: serverHost.api + "/faculties/"
                  }}
                  title="Факультеты"
                  searchableCols={["name", "dean"]}
                  struct={[
                      {name: "name", title: "Факультет", width: 50},
                      {name: "dean", title: "ФИО декана", width: 50},
                  ]}
                  activePage="faculties"/>
    );

}