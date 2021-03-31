export default class Report {
    constructor(CPApp, reportId, agGrid, recordset, controls) {
        this.CPApp = CPApp;
        this.reportId = reportId;
        this.agGrid = agGrid;
        this.recordset = recordset;

        this.btnLoadDataId = controls?.btnLoadDataId;

        this.loadingSpinnerId = controls?.loadingSpinnerId;
        if (this.btnLoadDataId !== undefined) {
            document.getElementById(this.btnLoadDataId).addEventListener('click', this.showDataIfNotCollapsed.bind(this));
        }

        this.btnFilterSettings = controls?.btnFilterSettings;
        if (this.btnFilterSettings !== undefined) {
            document.getElementById(this.btnFilterSettings).addEventListener('click', this.clickSettings.bind(this))
        }

        this.btnExcelExport = controls?.btnExcelExport;
        if (this.btnExcelExport !== undefined) {
            document.getElementById(this.btnExcelExport).addEventListener('click', this.excelExport)
        }

        this.exitFilterSettings(); //hogy eltunjenek azok a szurok, amelyek nincsenek kivalasztva
    }

    excelExport() {
        alert("Excel export...")
    }

    isFilterSettingsMode() {
        let elementBtnFilterSettings = document.getElementById(this.btnFilterSettings);
        return ((elementBtnFilterSettings == undefined) ? false : elementBtnFilterSettings.classList.contains("toggle-pressed"))
    }

    enterFilterSettings() {
        let elementBtnFilterSettings = document.getElementById(this.btnFilterSettings);
        if (elementBtnFilterSettings != undefined) {
            elementBtnFilterSettings.classList.add("toggle-pressed");
            elementBtnFilterSettings.querySelector("span").innerHTML = "done";

            Array.from(document.querySelectorAll(`.${this.reportId}_FILTER_ACTIVATED`)).forEach(item => {
                let chkBox = item.parentElement.querySelector("input[type='checkbox']");
                chkBox.parentElement.classList.remove("d-none");
                chkBox.parentElement.parentElement.classList.remove("d-none");
            });
        }
    }

    exitFilterSettings() {
        let elementBtnFilterSettings = document.getElementById(this.btnFilterSettings);
        if (elementBtnFilterSettings != undefined) {
            elementBtnFilterSettings.classList.remove("toggle-pressed");
            elementBtnFilterSettings.querySelector("span").innerHTML = "settings";

            Array.from(document.querySelectorAll(`.${this.reportId}_FILTER_ACTIVATED`)).forEach(item => {
                let chkBox = item.parentElement.querySelector("input[type='checkbox']");
                chkBox.parentElement.classList.add("d-none");
                if (!chkBox.checked) {
                    chkBox.parentElement.parentElement.classList.add("d-none");
                }
            });
        }
    }

    clickSettings() {
        if (this.isFilterSettingsMode()) {
            this.exitFilterSettings();
        } else {
            this.enterFilterSettings();
        }
    }

    getSqlSelect() {
        return [].slice.call(document.querySelectorAll(`.${this.reportId}.SETTINGS.COLUMN:checked`)).map(item => item.value).join(", ");
    }

    getSqlFilter() {
        let out = "";
        Array.from(document.querySelectorAll(`.${this.reportId}_FILTER_ACTIVATED:checked`)).forEach(item => {
            Array.from(item.parentElement.parentElement.querySelectorAll("input[sql]")).forEach(subitem => {
                if (subitem.value) {
                    if (out > "") {
                        out += " AND "
                    }

                    out += subitem.attributes["sql"].value.replace("?", subitem.value).replace("?", subitem.value);
                }
            });
        });

        return out;
    }

    hideLoadingSpinner() {
        if (this.loadingSpinnerId !== undefined) {
            document.getElementById(this.loadingSpinnerId).classList.add("d-none");
        }
    }

    showLoadingSpinner() {
        if (this.loadingSpinnerId !== undefined) {
            document.getElementById(this.loadingSpinnerId).classList.remove("d-none");
        }
    }

    showDataIfNotCollapsed(event) {
        if (!event.target.classList.contains("collapsed")) {
            this.showData();
        }
    }
    showData() {
        this.agGrid.removeDataAll();
        this.showLoadingSpinner();
        this.recordset.loadData({
            sqlSelect: this.getSqlSelect(),
            sqlWhere: this.getSqlFilter()
        }).then((response) => {
            if (response.status === 200) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }).then(data => {
            this.agGrid.renderFromMsSqlJson(data.body);
            this.hideLoadingSpinner();

        }).catch(err => {
            console.log(err);
        });
    }
}