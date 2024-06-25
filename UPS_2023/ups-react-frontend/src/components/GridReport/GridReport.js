import "./GridReport.scss";
// This import is required for some reason...
// eslint-disable-next-line no-unused-vars
import { Accordion } from "bootstrap";
import { useState } from "react";
import DataGrid from "../DataGrid/DataGrid";
import * as Gl from "../../common/Gl";
import ExcelExport from "../ExcelExport/ExcelExport";
import useFetchWithMsal from "../../webApi/useFetchWithMsal";
import useSettings from "../../common/SettingsContext";
import { protectedResources } from "../../authConfig";

export default function GridReport({ id, Filters, report }) {
  const { lang } = useSettings();

  const LangElements = report.languageElements;

  const [dataLoadingState, setDataLoadingState] = useState("NOT LOADED");
  const [gridData, setGridData] = useState([]);
  const [columns, setColumns] = useState([]);

  const { execute } = useFetchWithMsal({
    scopes: protectedResources.apiSelData.scopes.read,
  });

  function lng(key) {
    return Gl.LANG_GET_FormItem(LangElements, key, lang);
  }

  function getFilters() {
    const filtersArray = document.querySelectorAll(".reportFilter");
    const filters = {};
    let isFilterEmpty = true;
    filtersArray.forEach((e) => {
      filters[e.id] = e.value;
      if (e.value) isFilterEmpty = false;
    });
    return { isFilterEmpty, filters };
  }

  async function showDataIfNotCollapsed(e) {
    if (!e.target.classList.contains("collapsed")) {
      await showData();
    }
  }

  async function showData() {
    setColumns([]);
    setGridData([]);

    setDataLoadingState("LOADING");

    try {
      const { isFilterEmpty, filters } = getFilters();
      if (isFilterEmpty) {
        setDataLoadingState("MISSING-FILTER");
        return;
      }
      const body = {
        lang: lang,
        filters: filters,
      };

      const jsonData = await execute(
        "POST",
        protectedResources.apiSelData.endpoint,
        body
      );

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
              Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
