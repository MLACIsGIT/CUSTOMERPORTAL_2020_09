import * as Gl from "../../../_SelComponents/_SelWebComponents/js/Gl"
import LangJSON from "./ReportInvoices01-lang";

export default function ReportInvoices01Filter(props) {
    const LangElements = LangJSON();
    const lang = props.lang;

    function lng(key) {
         return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    return (
        <div className="ReportInvoices01Filter">
            <div className="row g-3 align-items-center">
                <div className="col-4">
                    <label className="col-form-label">{lng("filter-invDate")}</label>
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="InvDate >=?" />
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="InvDate <=?(2359)" />
                </div>
            </div>
            <br />

            <div className="row g-3 align-items-center">
                <div className="col-4">
                    <label className="col-form-label">{lng("filter-deliveryDate")}</label>
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="DeliveryDate >=?" />
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="DeliveryDate <=?(2359)" />
                </div>
            </div>
            <br />

            <div className="row g-3 align-items-center">
                <div className="col-4">
                    <label className="col-form-label">{lng("filter-dueDate")}</label>
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="DueDate >=?" />
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="DueDate <=?(2359)" />
                </div>
            </div>
            <br />

            <div className="row g-3 align-items-center">
                <div className="col-4">
                    <label className="col-form-label">{lng("filter-paymentDate")}</label>
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="Fully_paid_date >=?" />
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="Fully_paid_date <=?(2359)" />
                </div>
            </div>
            <br />

            <div className="row g-3 align-items-center">
                <div className="col-4">
                    <label className="col-form-label">{lng("filter-invNum")}</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="InvNum like'?%'" />
                </div>
            </div>
            <br />

            <div className="row g-3 align-items-center">
                <div className="col-4">
                    <label className="col-form-label">{lng("filter-invRegNum")}</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="Inv_SeqNum like'?%'" />
                </div>
            </div>
            <br />

            <div className="row g-3 align-items-center">
                <div className="col-4">
                    <label className="col-form-label">{lng("filter-paymentStatus")}</label>
                </div>
                <div className="col-3">
                    <select className="form-select reportFilter" aria-label="Default select example" data-sql="PayStatus='?'">
                        <option value=""></option>
                        <option value="NOT PAID">{lng("NOT PAID")}</option>
                        <option value="PAID">{lng("PAID")}</option>
                        <option value="CANCELLED">{lng("CANCELLED")}</option>
                    </select>
                </div>
            </div>
            <br />

            <div className="row g-3 align-items-center">
                <div className="col-4">
                    <label className="col-form-label">{lng("filter-currency")}</label>
                </div>
                <div className="col-3">
                    <select className="form-select reportFilter" aria-label="Default select example" data-sql="Inv_Curr_DC='?'">
                        <option value=""></option>
                        <option value="AUD">AUD</option>
                        <option value="CAD">CAD</option>
                        <option value="CNY">CNY</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="HKD">HKD</option>
                        <option value="HUF">HUF</option>
                        <option value="JPY">JPY</option>
                        <option value="KRW">KRW</option>
                        <option value="MYR">MYR</option>
                        <option value="SGD">SGD</option>
                        <option value="THB">THB</option>
                        <option value="USD">USD</option>
                    </select>
                </div>
            </div>
            <br />
        </div>
    )
}