export default function TevaTigReportFilter(props) {
    return (
        <div className="TevaTigreportFilter">


            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">Suppliers position:</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="TIG_SuppliersPosition like'?%'" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">Route ID:</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="TIG_RouteID like'?%'" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">ETA:</label>
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="TIG_ArrivalDate >=?" />
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="TIG_ArrivalDate <=?(2359)" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">Order number:</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="TIG_OrderNumber like'?%'" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">Arrival warehouse:</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="TIG_ArrivalWarehouse like'?%'" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">Arrival city:</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="TIG_ArrivalCity like'?%'" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">Shipment type:</label>
                </div>
                <div className="col-3">
                    <select className="form-select reportFilter" aria-label="Default select example" data-sql="TIG_ShipmentType='?'">
                        <option value=""></option>
                        <option value="BC">BC</option>
                        <option value="EM1">EM1</option>
                        <option value="EM2">EM2</option>
                    </select>
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">Packaging:</label>
                </div>
                <div className="col-3">
                    <select className="form-select reportFilter" aria-label="Default select example" data-sql="TIG_WrappingType='?'">
                        <option value=""></option>
                        <option value="Box">Box</option>
                        <option value="Pallets">Pallets</option>
                    </select>
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
            <br />

        </div>
    )
}