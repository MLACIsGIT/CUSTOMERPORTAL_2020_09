import React from "react";
import { AgGridReact } from "ag-grid-react";
import FieldFormatters from "./FieldFormatters";
// import * as Gl from "../js/Gl"
import * as Gl from "../../common/Gl";
// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function DataGrid(props) {
  function dateFormatter(params) {
    return FieldFormatters.dateFormatter(params.value, props.lang);
  }

  const columnTypes = {
    date: {
      valueFormatter: dateFormatter,
    },
  };

  function lng(key) {
    return Gl.LANG_GET_FormItem(props.languageElements, key, props.lang);
  }

  const columnDefs = props.columns.map((col) => {
    return {
      ...col,
      headerName: lng(`field-${col.field}`),
    };
  });

  // console.log(props.columns);
  // console.log(columnDefs);

  return (
    <div
      id={props.id}
      className="ag-theme-alpine"
      style={{ height: "70vh", width: "100%" }}
    >
      <AgGridReact
        rowData={props.data}
        columnDefs={columnDefs}
        columnTypes={columnTypes}
      ></AgGridReact>
    </div>
  );
}
