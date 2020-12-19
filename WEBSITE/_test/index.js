let selectedStatusBtn

function Address_setStatus(Addr) {
    let Statuses = Array.prototype.slice.call(Addr.querySelectorAll(".page-routes-status"));
    if (!Statuses.some((e) => { return !e.classList.contains("page-routes-status-ok") })) {
        Addr.querySelector(".page-routes-address-data").classList.add("page-routes-address-ok");
    }
}

function event_Transport_click() {
    statusRemoveSelectedClass(true);

    let Current_Transport = this.parentElement;
    let Transports = Array.prototype.slice.call(document.querySelector(".page-routes-transports").querySelectorAll(".page-routes-transport"))
    for (t of Transports) {
        let e = t.querySelector(".page-routes-addresses");
        if (t.id == Current_Transport.id) {
            e.style.display = (e.style.display == "block") ? "none" : "block";
        } else {
            e.style.display = "none";
        }
        if (e.style.display == "none") {
            t.classList.remove("selected-transport");
        } else {
            t.classList.add("selected-transport");
        }
    }
    console.log(Transports)
}

function event_Address_click() {
    statusRemoveSelectedClass(true);

    let Current_Address = this.parentElement;
    let Addresses = Array.prototype.slice.call(Current_Address.parentElement.querySelectorAll(".page-routes-address"))
    for (a of Addresses) {
        let e = a.querySelector(".page-routes-address-statuses");
        if (a.id == Current_Address.id) {
            e.style.display = (e.style.display == "block") ? "none" : "block";
        } else {
            e.style.display = "none"
        }
        if (e.style.display == "none") {
            a.classList.remove("selected-address");
        } else {
            a.classList.add("selected-address");
        }
    }
}

function statusRemoveSelectedClass(removeSelectedStatusBtnAlso) {
    if (selectedStatusBtn != undefined) {
        selectedStatusBtn.classList.remove("page-routes-status-selected");
        document.querySelector(".NAVBAR_MAIN").classList.remove("page-routes-status-selected")
        if (removeSelectedStatusBtnAlso) {
            selectedStatusBtn = undefined;
        }
    }
}

function FPc_NAVBAR_MAIN_ITEM_OK_click() {
    if (selectedStatusBtn != undefined) {
        selectedStatusBtn.classList.remove("page-routes-status-selected");
        if (!selectedStatusBtn.classList.contains("page-routes-status-done")) {
            let doIt = true;
            let prevElement = selectedStatusBtn.previousElementSibling;
            let nextElement = selectedStatusBtn.nextElementSibling;
            let Current_Address = selectedStatusBtn.parentElement.parentElement;

            if (prevElement != null) {
                if (!prevElement.classList.contains("page-routes-status-done")) {
                    doIt = false;
                }
            }

            if (doIt) {
                selectedStatusBtn.classList.add("page-routes-status-done");
                selectedStatusBtn.classList.add("page-routes-status-ok");
                Address_setStatus(selectedStatusBtn.parentElement.parentElement);
                if (nextElement == null) {
                    Current_Address.querySelector(".page-routes-address-data").querySelector(".page-routes-address-pict").innerHTML = TransportData_handler.Icons.ok;
                    Current_Address.classList.remove("selected-address");
                    Current_Address.querySelector(".page-routes-address-statuses").style.display = "none";
                }
                statusRemoveSelectedClass();
            }
        }
    }
}

function FPc_NAVBAR_MAIN_ITEM_NOK_click() {
    if (selectedStatusBtn != undefined) {
        selectedStatusBtn.classList.remove("page-routes-status-selected");
        if (!selectedStatusBtn.classList.contains("page-routes-status-done")) {
            let doIt = true;
            let prevElement = selectedStatusBtn.previousElementSibling;
            let nextElement = selectedStatusBtn.nextElementSibling;
            let Current_Address = selectedStatusBtn.parentElement.parentElement;

            if (prevElement != null) {
                if (!prevElement.classList.contains("page-routes-status-done")) {
                    doIt = false;
                }
            }

            if (doIt) {
                selectedStatusBtn.classList.add("page-routes-status-done");
                selectedStatusBtn.classList.add("page-routes-status-nok");
                Address_setStatus(selectedStatusBtn.parentElement.parentElement);
                Current_Address.querySelector(".page-routes-address-data").querySelector(".page-routes-address-pict").innerHTML = TransportData_handler.Icons.cancelled;
                Current_Address.classList.remove("selected-address");
                Current_Address.querySelector(".page-routes-address-statuses").style.display = "none";
                statusRemoveSelectedClass();
            }
        }
    }
}

function event_Status_click() {
    statusRemoveSelectedClass(true);

    if (!this.classList.contains("page-routes-status-done")) {
        let doIt = true;
        let prevElement = this.previousElementSibling;

        if (prevElement != null) {
            if (!prevElement.classList.contains("page-routes-status-ok")) {
                doIt = false;
            }
        }

        if (doIt) {
            this.classList.add("page-routes-status-selected");
            selectedStatusBtn = this;
            document.querySelector(".NAVBAR_MAIN").classList.add("page-routes-status-selected")
        }
    }
}

class cl_TransportData {
    LOAD_Templates() {
        if (this.Templates_Loaded) {
            return;
        }

        Promise.all(
            [
                fetch("./templates/transports.html").then(tempData => tempData.text()),
                fetch("./templates/address.html").then(tempData => tempData.text()),
                fetch("./templates/status.html").then(tempData => tempData.text()),
                fetch("./pictures/location.svg").then(tempData => tempData.text()),
                fetch("./pictures/ok.svg").then(tempData => tempData.text()),
                fetch("./pictures/cancelled.svg").then(tempData => tempData.text()),
            ]).then((Data) => {
                this.Templates.transport_html = Data[0];
                this.Templates.address_html = Data[1];
                this.Templates.status_html = Data[2];
                this.Icons.location = Data[3];
                this.Icons.ok = Data[4];
                this.Icons.cancelled = Data[5];
                this.Templates_Loaded = true
            });
    };

    GET_TransportData() {
        Promise.all(
            [
                fetch("./TOUREXPORT_DATA.json").then(function (response) { return response.json(); })
            ]
        ).then((Data) => {
            this.TransportData = Data[0].body.message.transport;
            this.SHOW_TransportData();
        });
    };

    Element_setInnerText(parentElement, ElementQuerySelector, Text) {
        for (let e of parentElement.querySelectorAll(ElementQuerySelector)) {
            e.innerText = Text;
        }
    }

    SHOW_TransportData() {
        if (!this.Templates_Loaded) {
            setTimeout(this.SHOW_TransportData.bind(this), 2000);
            return;
        }

        let e_page_routes_transports = document.querySelector("#page-routes-transports");

        //transport
        for (let transport of this.TransportData) {
            let current_transport = document.createElement("div");
            current_transport.setAttribute("id", transport.transportId);
            current_transport.classList.add("page-routes-transport");
            current_transport.innerHTML = this.Templates.transport_html;
            this.Element_setInnerText(current_transport, ".page-routes-transport-line1", transport.line1);
            this.Element_setInnerText(current_transport, ".page-routes-transport-line2", transport.line2);
            this.Element_setInnerText(current_transport, ".page-routes-transport-line3", transport.line3);
            this.Element_setInnerText(current_transport, ".page-routes-transport-line4", transport.line4);
            this.Element_setInnerText(current_transport, ".page-routes-transport-line5", transport.line5);
            let current_transport_addresses = current_transport.querySelector(".page-routes-addresses");
            //addresses
            for (let address of transport.address) {
                let current_address = document.createElement("div");
                current_address.setAttribute("id", [transport.transportId, address.groupId].join("|"));
                current_address.classList.add("page-routes-address");
                current_address.innerHTML = this.Templates.address_html;
                this.Element_setInnerText(current_address, ".page-routes-address-line1", address.line1);
                this.Element_setInnerText(current_address, ".page-routes-address-line2", address.line2);
                this.Element_setInnerText(current_address, ".page-routes-address-line3", address.line3);
                this.Element_setInnerText(current_address, ".page-routes-address-line4", address.line4);
                this.Element_setInnerText(current_address, ".page-routes-address-line5", address.line5);
                this.Element_setInnerText(current_address, ".page-routes-address-status-remarks", (address.remarks == undefined) ? '' : address.remarks);
                let current_address_statuses = current_address.querySelector(".page-routes-address-statuses");
                //statuses
                for (let status of address.statusTemplate) {
                    let current_status = document.createElement("div");
                    current_status.setAttribute("id", [transport.transportId, address.id, status.id].join("|"));
                    current_status.classList.add("page-routes-status");
                    current_status.innerHTML = this.Templates.status_html;
                    this.Element_setInnerText(current_status, ".page-routes-status-text", status.hu);
                    current_address_statuses.appendChild(current_status);
                    current_status.addEventListener("click", event_Status_click);
                }
                current_transport_addresses.appendChild(current_address);
                current_address.querySelector(".page-routes-address-data").addEventListener("click", event_Address_click);
            }

            e_page_routes_transports.appendChild(current_transport);
            current_transport.querySelector(".page-routes-transport-head").addEventListener("click", event_Transport_click);
        }
    }

    constructor() {
        this.Templates_Loaded = false;
        this.Templates = {
            "transport_html": "Not loaded",
            "address_html": "Not loaded",
            "status_html": "Not loaded"
        };
        this.Icons = {
            "location": "",
            "ok": "",
            "cancelled": ""
        };
        this.Templates_Timer = undefined;
        this.TransportData = [];

        this.LOAD_Templates();
    }
}

TransportData_handler = new cl_TransportData();
TransportData_handler.GET_TransportData();

document.querySelector('#FPc_NAVBAR_MAIN_ITEM_OK').addEventListener("click", FPc_NAVBAR_MAIN_ITEM_OK_click)
document.querySelector('#FPc_NAVBAR_MAIN_ITEM_NOK').addEventListener("click", FPc_NAVBAR_MAIN_ITEM_NOK_click)
