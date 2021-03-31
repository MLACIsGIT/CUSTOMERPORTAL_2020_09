export default class AgGrid {
    constructor(CPApp, reportId, agGridElementId) {
        this.CPApp = CPApp;
        this.reportId = reportId;
        this.agGridElementId = agGridElementId;
        this.agGrid = undefined;
    }

    removeDataAll() {
        let agGridElement = document.getElementById(this.agGridElementId);
        agGridElement.innerHTML = "";
    }

    renderFromMsSqlJson(msSqlRecordset) {
        this.removeDataAll();
        let agGridElement = document.getElementById(this.agGridElementId);
        let columnDefs = Object.keys(msSqlRecordset.columns).map(item => {
            return {
                field: item
            }
        });
        let gridOptions = {
            columnDefs: columnDefs,
            rowData: msSqlRecordset.data
        }

        this.agGrid = new agGrid.Grid(agGridElement, gridOptions);

        let agGridHeaderTexts = Array.from(agGridElement.querySelectorAll("span.ag-header-cell-text"));
        agGridHeaderTexts.forEach(span => {
            span.setAttribute("langelementid", `${this.reportId}_COLUMNAMES_${(span.innerText).replace(/ /g, '')}`);
        })
        this.CPApp.Lang_Selector.Lang_CURRENT_SET (this.CPApp.Lang_Selector.Lang_DEFAULT_GET());
    }
}
