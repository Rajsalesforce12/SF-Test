import { LightningElement, track, wire } from 'lwc';
import getCreditorInfo from '@salesforce/apex/CreditorInfoTableController.getContents';
const columns = [
    { label: 'Creditor', fieldName: 'creditorName', type: 'text', editable: true  },
    { label: 'First Name', fieldName: 'firstName', type: 'text', editable: true },
    { label: 'Last Name', fieldName: 'lastName', type: 'text', editable: true },
    { label: 'Min Pay %', fieldName: 'minPaymentPercentage', type: 'percent', editable: true,typeAttributes: {
        minimumFractionDigits: 2},initialWidth: 130 },
    { label: 'Balance', fieldName: 'balance', type: 'currency', editable: true, typeAttributes: {
        minimumFractionDigits: 2},initialWidth: 130 }
];
export default class creditorInfoTable extends LightningElement {
    @track cols=columns;   
    @track tableData = [];
    @track totalRowCount = 0;
    @track selectedRowCount = 0;
    @track totalBalance = 0;
    @track error;
    draftValues = [];
    //get response from Apex
    @wire(getCreditorInfo) creditorInfoList(result){
        if(result.data) this.tableData=result.data;
        if(result.error) this.error=result.error;
    };

    get responseReceived(){
        if(this.creditorInfoList){
            return true;
        }
        return false;
    }
    //Set Total Row count on load of the component
    renderedCallback() {
        this.totalRowCount = this.tableData.length;
    }
    //Add Debt button handler
    addDebtHandler(){
        console.log('entered addDebtHandler');
          console.log('this.tableData'+this.tableData.length);
          //add empty row to tableData
          this.tableData = [...this.tableData,{
            "id": this.tableData.length+1,
            "creditorName": "",
            "firstName": "",
            "lastName": "",
            "minPaymentPercentage": 0.00,
            "balance": 0.00
          }];
          console.log('this.tableData1'+this.tableData);
    }
    //Remove Debt button handler
    removeDebtHandler(){
        console.log('entered removeDebtHandler');
        //get all selected records
        var selectedRows =  
        this.template.querySelector("lightning-datatable").getSelectedRows();  
        console.log('selectedRows'+selectedRows);
        const rows = []; 
        var rowIds = [];    
        //Build selected rowId list     
        selectedRows.forEach(function(element){
            rowIds.push(element.id);
            console.log('rowIds',rowIds);
        });
        //Build non-selected row List
        this.tableData.forEach(function(element){
            if(!rowIds.includes(element.id)){
                console.log('success');
                rows.push(element);
            }
        });
        console.log('rows'+rows);
        //update tableData with non-selected row list
        this.tableData = rows;
        //update total row count
        this.totalRowCount = rows.length;
    }
    //row selection handler
    rowSelectionHandler(event){
        console.log('entered rowSelectionHandler');
        //get Selected Rows
        var selectedRecords = event.detail.selectedRows; 
        //Calculate selected row count
        this.selectedRowCount = selectedRecords.length;
        var previousBalance = 0;
        //Calculate total Balance
        selectedRecords.forEach(function(element){
            previousBalance = previousBalance + element.balance;
            console.log('previousBalance'+previousBalance);
        });
        this.totalBalance = previousBalance;
    }

// Save handler
    onSaveHandler(event){
        console.log('entered save handler');
        //get updated row cells' values
        var updatedCells = event.detail.draftValues;       
        console.log('updatedCells'+updatedCells);
        var rows = [];
        var rowIds = [];
        const updatedCellMap = new Map();
        //Build updated rowids, map
        updatedCells.forEach(function(param){
            rowIds.push(param.id);
            updatedCellMap.set(param.id,param);
            console.log('rowIds',param.id);
            console.log('updatedCellMap',updatedCellMap);
        });
        //loop through tableData and update with new cell values
        this.tableData.forEach(function(param){
            var tempRow = {
                "id": param.id,
                "creditorName": param.creditorName,
                "firstName": param.firstName,
                "lastName": param.lastName,
                "minPaymentPercentage": param.minPaymentPercentage,
                "balance": param.balance
              };
            if(rowIds.includes(String(param.id))){
                console.log('success');
                var temp = {};
                temp = updatedCellMap.get(String(param.id));
                console.log('temp'+temp.id);
                if(temp.firstName) tempRow.firstName = temp.firstName;                
                if(temp.creditorName) tempRow.creditorName = temp.creditorName;              
                if(temp.lastName) tempRow.lastName = temp.lastName;
                if(temp.minPaymentPercentage) tempRow.minPaymentPercentage = parseFloat(temp.minPaymentPercentage);
                if(temp.balance) tempRow.balance = parseFloat(temp.balance);
            }
            rows.push(tempRow);
        });
        this.tableData = rows;
        this.draftValues = []; 
    }
}