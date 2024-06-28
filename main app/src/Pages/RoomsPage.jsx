import CRUDPage from "../components/CRUDPage/CRUDPage";
import serverHost from "../envVars";

const pageStyle = {
    display: "flex"
}

export default function RoomsPage(){

    return (
        <CRUDPage urls={{
                      get: serverHost.api + "/rooms",
                      insert: serverHost.api + "/rooms",
                      edit: serverHost.api + "/rooms/",
                      remove: serverHost.api + "/rooms/"
                  }}
                  title="Аудитории"
                  searchableCols={["number", "building_number"]}
                  struct={[
                      {name: "number", title: "Аудитория", width: 50},
                      {name: "building_number", title: "Корпус", width: 50},
                  ]}/>
    );

}