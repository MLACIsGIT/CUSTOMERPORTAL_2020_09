export default function TrackAndTraceReportFilter(props) {
    return (
        <div className="TrackAndTraceReportFilters">
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">Order Number:</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="OrderNum like'?%'" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">Unit ID number:</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="DocNum01 like'?%'" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">ETA:</label>
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="Loading_from >=?" />
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="Loading_from <=?(2359)" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">Temperature:</label>
                </div>
                <div className="col-3">
                    <select className="form-select reportFilter" aria-label="Default select example" data-sql="GDS_UserFld_nvarchar03='?'">
                        <option value=""></option>
                        <option value="2-8">2-8</option>
                        <option value="2-25">2-25</option>
                        <option value="8-15">8-15</option>
                        <option value="15-25">15-25</option>
                        <option value="KH">KH</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
