import "./GridReport.scss";
// This import is required for some reason...
// eslint-disable-next-line no-unused-vars
import { Accordion } from "bootstrap";
import { useState } from "react";
import DataGrid from "../DataGrid/DataGrid";
// import * as Gl from '../js/Gl';
import * as Gl from "../../common/Gl";
import ExcelExport from "../ExcelExport/ExcelExport";
import useFetchWithMsal from "../../webApi/useFetchWithMsal";
import useSettings from "../../common/SettingsContext";
import { protectedResources } from "../../authConfig";

export default function GridReport({ id, Filters, report }) {
  const { lang } = useSettings();

  const LangElements = report.languageElements;
  // const lang = props.lang;

  const [dataLoadingState, setDataLoadingState] = useState("NOT LOADED");
  const [gridData, setGridData] = useState([]);
  const [columns, setColumns] = useState([]);

  const {
    // error,
    execute,
    // , fetchSelexpedData
  } = useFetchWithMsal({
    scopes: protectedResources.apiSelData.scopes.read,
  });

  function lng(key) {
    return Gl.LANG_GET_FormItem(LangElements, key, lang);
  }

  function getSQL() {
    let filterFields = Array.from(
      document.querySelectorAll(".reportFilter")
    ).filter((e) => {
      return e.dataset.sql;
    });

    let sqlFilters = filterFields
      .filter((e) => e.value)
      .map((e) => {
        switch (e.type) {
          case "date":
            let dateValue = new Date(e.value);
            let sqlDate = `CONVERT(DATETIME, '${dateValue.getFullYear()}-${
              dateValue.getMonth() + 1
            }-${dateValue.getDate()}', 102)`;
            let sqlDate2359 = `CONVERT(DATETIME, '${dateValue.getFullYear()}-${
              dateValue.getMonth() + 1
            }-${dateValue.getDate()} 23:59:59', 102)`;

            let result = e.dataset.sql.replace(/\?\(2359\)/g, sqlDate2359);
            result = result.replace(/\?/g, sqlDate);

            return result;

          default:
            return `(${e.dataset.sql.replace(/\?/g, e.value)})`;
        }
      });

    return sqlFilters.join(" AND ");
  }

  function getFilters() {
    const filtersArray = document.querySelectorAll(".reportFilter");
    const filters = {};
    let isFilterEmpty = true;
    filtersArray.forEach((e) => {
      filters[e.id] = e.value;
      if (e.value) isFilterEmpty = false;
    });
    console.log("filters", filters);
    return { isFilterEmpty, filters };
  }

  async function showDataIfNotCollapsed(e) {
    // console.log("STARTING showDataIfNotCollapsed");
    if (!e.target.classList.contains("collapsed")) {
      await showData();
    }
  }

  async function showData() {
    setColumns([]);
    setGridData([]);

    setDataLoadingState("LOADING");

    // console.log("+++ API BASE", process.env.REACT_APP_API_BASE_URL);
    // debugger
    // fetch(process.env.REACT_APP_API_BASE_URL, {
    //   method: "POST",
    //   mode: "cors",
    //   cache: "no-cache",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     header: {
    //       function: "getData",
    //       lang: props.lang,
    //       token: props.loginData.token.token,
    //     },
    //     body: {
    //       portalOwnerId: process.env.REACT_APP_PORTAL_OWNER_ID,
    //       reportId: "ReportUpsTrackTrace",
    //       where: getSQL(),
    //       pageNo: 0,
    //       rowsPerPage: 50,
    //     },
    //   }),
    // })
    //   .then((result) => {
    //     if (result.status !== 200) {
    //       throw new Error("failed");
    //     }
    //     return result.json();
    //   })
    //   .then((jsonData) => {
    //     if (jsonData.header.result !== "ok") {
    //       throw new Error("nok");
    //     }

    //     setColumns(jsonData.body.selectedColumns);
    //     setGridData(jsonData.body.data);
    //     setDataLoadingState("LOADED");
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     setDataLoadingState("NOT_LOADED");
    //   });

    try {
      const { isFilterEmpty, filters } = getFilters();
      if (isFilterEmpty) {
        setDataLoadingState("MISSING-FILTER");
        return;
      }
      const body = {
        lang: lang,
        // header: {
        //   function: "getData",
        //   // token: props.loginData.token.token,
        // },
        // body: {
        // portalOwnerId: process.env.REACT_APP_PORTAL_OWNER_ID,
        // reportId: "ReportUpsTrackTrace",
        // where: getSQL(),
        filters: filters,
        // pageNo: 0,
        // rowsPerPage: 50,
        // },
      };
      // console.log(body);

      // const jsonData = await fetchSelexpedData(body);
      const jsonData = await execute(
        "POST",
        protectedResources.apiSelData.endpoint,
        body
      );

      // console.log("jsonData", jsonData);
      setColumns(jsonData.selectedColumns);
      setGridData(jsonData.data);
      setDataLoadingState("LOADED");
    } catch (e) {
      console.error(e);
      setDataLoadingState("NOT_LOADED");
    }
  }

  let gridOfReport;

  if (dataLoadingState === "LOADED") {
    gridOfReport = (
      <div className="accordion-body">
        <div className="accordion-body-header">
          <ExcelExport data={gridData} />
        </div>

        <DataGrid
          id={`${id}-dataGrid`}
          columns={columns}
          lang={lang}
          languageElements={report.languageElements}
          data={gridData}
        />
      </div>
    );
  }

  return (
    <div className="grid-report">
      <div className="accordion accordion-flush" id="accordionFlushExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="grid-report-flush-filter">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapse-filter"
              aria-expanded="false"
              aria-controls="flush-collapse-filter"
            >
              {lng("flush-filter")}
            </button>
          </h2>
          <div
            id="flush-collapse-filter"
            className="accordion-collapse collapse"
            aria-labelledby="grid-report-flush-filter"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">{Filters}</div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="grid-report-flush-data">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapse-data"
              aria-expanded="false"
              aria-controls="flush-collapse-data"
              onClick={(e) => showDataIfNotCollapsed(e)}
            >
              {lng("flush-data")}
            </button>
          </h2>
          <div
            id="flush-collapse-data"
            className="accordion-collapse collapse"
            aria-labelledby="grid-report-flush-data"
            data-bs-parent="#accordionFlushExample"
          >
            {dataLoadingState === "NOT LOADED" && (
              <div className="accordion-body"></div>
            )}

            {dataLoadingState === "LOADING" && (
              <div className="accordion-body loading-spinner">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {dataLoadingState === "MISSING-FILTER" && (
              <div className="d-flex justify-content-center my-3" role="status">
                <span className="">{lng("missing-filter")}</span>
              </div>
            )}

            {gridOfReport}
          </div>
        </div>
        <div className="accordion-item d-none">
          <h2
            className="accordion-header"
            id="grid-report-flush-select-columns"
          >
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapse-selectColumns"
              aria-expanded="false"
              aria-controls="flush-collapse-selectColumns"
            >
              {"###flush-select-columns"}
            </button>
          </h2>
          <div
            id="flush-collapse-selectColumns"
            className="accordion-collapse collapse"
            aria-labelledby="grid-report-flush-select-columns"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              Placeholder content for this accordion, which is intended to
              demonstrate the <code>.accordion-flush</code> class. This is the
              third item's accordion body. Nothing more exciting happening here
              in terms of content, but just filling up the space to make it
              look, at least at first glance, a bit more representative of how
              this would look in a real-world application.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
