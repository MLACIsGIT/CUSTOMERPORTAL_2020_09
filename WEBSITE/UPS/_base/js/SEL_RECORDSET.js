export default class Recordset {
    constructor(CPApp, recordsetParams) {
        this.CPApp = CPApp
        this.recordsetParams = recordsetParams
    }

    getDefaultSqlSelect() {
        return this.recordsetParams.defaultSqlSelect ?? "id"
    }
    loadData(params) {
        return fetch('http://localhost:7071/api/trial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "header": {
                    "Portal_owner_id": (this.CPApp.Settings_GET()).Portal_owner_id,
                    "Session_ID": "",
                    "function": "WAT_INTERFACE_GET_DATA",
                    "lang": "hu"
                },
                "body": {
                    "WAT_Session_ID": "",
                    "SELECT": params.sqlSelect || this.recordsetParams.defaultSqlSelect || "id",
                    "TOP": params.sqlTop ?? this.recordsetParams.defaultSqlTop,
                    "FROM": this.recordsetParams.sqlFrom,
                    "WHERE": params.sqlWhere ?? "",
                    "GROUP_BY": params.sqlGroupBy ?? "",
                    "ORDER_BY": params.sqlOrderBy ?? this.recordsetParams.defaultSqlOrderBy,
                    "PAGE_NO": params.pageNo ?? 0,
                    "ROWS_PER_PAGE": params.rowPerPage ?? this.recordsetParams.defaultRowPerPage ?? 0
                }
            })
        });
    }
}