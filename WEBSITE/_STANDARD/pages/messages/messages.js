import * as M_GL from '../../_base/js/GL.js';
import * as M_CP_APP from '../../_base/js/CP_App.js';
import * as M_SEL_NAVBAR from '../../_base/js/SEL_NAVBAR.js'
import * as M_SEL_HAM from '../../_base/js/SEL_HAM.js'
import * as AG_GRID from "https://unpkg.com/ag-grid-enterprise/dist/ag-grid-enterprise.min.noStyle.js"

let CP_App = new M_CP_APP.CP_App(
    {
        "Language_Selector_ID": "FPc_Language_Selector",
        "Language_Files": ["./messages_Lang.json"]
    }
);

let FPc_NAVBAR_MAIN = document.getElementById("NAVBAR_MAIN");
let NAVBAR_SETTINGS_URL = `${CP_App.Host_Location_url()}/_EASYSETUP/NAVBARS/NAVBAR_MAIN_DEF.json`
let NAVBAR_MAIN;
let p_NAVBAR_SETTINGS_GET = fetch(NAVBAR_SETTINGS_URL);

// ----------- AG GRID ------------------------------------------
var columnDefs = [
    {headerName: "Make",  field: "make",  sortable: true, filter: true, checkboxSelection: true, rowGroup: true },
    {headerName: "Model", field: "model", sortable: true, filter: true },
    {headerName: "Price", field: "price", sortable: true, filter: true }
  ];

  // specify the data
  /*
  var rowData = [
    {make: "Toyota", model: "Celica", price: 35000},
    {make: "Ford", model: "Mondeo", price: 32000},
    {make: "Porsche", model: "Boxter", price: 72000}
  ];
  */
      
  // let the grid know which columns and what data to use
  var gridOptions = {
    columnDefs: columnDefs,
    //rowData: rowData,
    rowSelection: 'multiple',
    pagination: true
  };
  
  // setup the grid after the page has finished loading
  document.addEventListener('DOMContentLoaded', function() {
      var gridDiv = document.querySelector('#myGrid');
      new agGrid.Grid(gridDiv, gridOptions);

      agGrid.simpleHttpRequest({url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/sample-data/rowData.json'}).then(function(data) {
        gridOptions.api.setRowData(data);
    });
  });
  
  function getSelectedRows() {
    var selectedNodes = gridOptions.api.getSelectedNodes()
    var selectedData = selectedNodes.map( function(node) { return node.data })
    var selectedDataStringPresentation = selectedData.map( function(node) { return node.make + ' ' + node.model }).join(', ')

    console.log(selectedData);
}
// ----------- AG GRID END --------------------------------------

let FPc_HAM_MENU = document.getElementById("HAM_MENU");


let HAM_MENU = new M_SEL_HAM.SEL_HAM_MENU({
    HAM_ID: "HAM_MENU",
    HAM_BUTTON_ID: "FPc_HAM_MENU_BUTTON",
    HAM_display_mode: "flex"
})

let HAM_SELECT_ITEM = ( HAM_ITEM_id ) => {
    console.log("+++ HAM_SELECT_ITEM")
    HAM_MENU.SELECTED_ITEM_SET( HAM_ITEM_id);
}

FPc_HAM_MENU.addEventListener('HAM_ITEM_CLICKED', (e) => {
    let Clicked_HAM_ITEM_id = e.detail.HAM_ITEM.id;
    HAM_SELECT_ITEM(Clicked_HAM_ITEM_id);
})

let NAVBAR_SELECT_ITEM = ( NAVBAR_ITEM_id ) => {
    NAVBAR_MAIN.SELECTED_ITEM_SET(NAVBAR_ITEM_id);
    HAM_MENU.HAM_FILTER_ITEMS(NAVBAR_ITEM_id)
}

FPc_NAVBAR_MAIN.addEventListener('NAVBAR_ITEM_CLICKED', (e) => {
    let Clicked_NAVBAR_ITEM_id = e.detail.NAVBAR_ITEM.id;
    NAVBAR_SELECT_ITEM(Clicked_NAVBAR_ITEM_id)
})

p_NAVBAR_SETTINGS_GET
    .then(function (response) {
        return response.json();
    })
    .then(function (NAVBAR_DEF) {
        NAVBAR_MAIN = new M_SEL_NAVBAR.SEL_NAVBAR(NAVBAR_DEF);
        NAVBAR_SELECT_ITEM("FPc_NAVBAR_MAIN_ITEM_NEWS")
    })

/*
let HAM_ITEM_1_CLICK = () => {
    document.getElementById("grid_demo").style.display = "none"
    document.getElementById("filter_demo").style.display = "block"
    HAM_MENU.HAM_HIDE();
}

let BTN_SHOW_GRID_CLICK = () => {
    document.getElementById("filter_demo").style.display = "none"
    document.getElementById("grid_demo").style.display = "block"
    getSelectedRows()
}

let HAM_ITEM_NEWS_1 = document.getElementById("HAM_ITEM_NEWS_1")
HAM_ITEM_NEWS_1.addEventListener("click", HAM_ITEM_1_CLICK)

let BTN_SHOW_GRID = document.getElementById("BTN_SHOW_GRID")
BTN_SHOW_GRID.addEventListener("click", BTN_SHOW_GRID_CLICK)
*/
