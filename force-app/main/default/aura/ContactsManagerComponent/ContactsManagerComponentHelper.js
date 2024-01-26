({ 
    //fill columns for dataTable
    renderColumnsAndActions: function(component) {
            
   		component.set('v.columns', [
            {label: 'Name', 			fieldName: 'Link', 				type: 'url', 	sortable: true, 	typeAttributes: {label: {fieldName: 'ContactName', }, 		target: '_blank', tooltip: 'go to contact',},},        
            {label: 'Email', 			fieldName: 'Email', 			type: 'email', 	sortable: true},        
            {label: 'Contact Level', 	fieldName: 'Contact_Level__c', 	type: 'text', 	sortable: true},
            {label: 'Account', 			fieldName: 'AccountLink', 		type: 'url', 	sortable: true, 	typeAttributes: {label: {fieldName: 'AccountName', }, 		target: '_blank', tooltip: 'go to account',},},         
            {label: 'Owner', 			fieldName: 'OwnerLink', 		type: 'url', 	sortable: true, 	typeAttributes: {label: {fieldName: 'OwnerName', }, 		target: '_blank', tooltip: 'go to contact owner',},},     
            {label: 'Created By', 		fieldName: 'CreatedByLink', 	type: 'url', 	sortable: true,		typeAttributes: {label: { fieldName: 'CreatedByName', }, 	target: '_blank', tooltip: 'go to contact creator',},},           
            {label: 'Created Date', 	fieldName: 'CreatedDate', 		type: 'date', 	sortable: true,   	typeAttributes: {label: { fieldName: 'CreatedDateName', },},},     
            {type: 'button', typeAttributes: {
                                                class: 			'slds-button slds-button_text-destructive',
                                                label: 			'Del',
                                                name: 			'delete',
                                                title: 			'Del',
                                                disabled: 		false,
                                                value: 			'view',
                                                iconPosition: 	'left',
            								},},
            
         ]);
             
    },
            
   	//retrive and fill Contacts for dataTable         
	renderContacts: function(component, helper) {
  		const action = component.get('c.getContacts');
        const pageSize = component.get('v.pageSize');
        const pageNumber = component.get('v.pageNumber');
        const sortDirection = component.get('v.sortDirection');       
        const searchString = component.get("v.searchStr");   
        let sortBy = component.get('v.sortBy');
        sortBy = sortBy === 'Link'? 'Name' : sortBy.replace('Link', '.Name');      
         
        action.setParams({
            'pageSize' : pageSize,
            'pageNumber' : pageNumber,
            'sortBy' : sortBy,
            'sortDirection' : sortDirection,
            'searchString' : searchString
        });
        action.setCallback(this, response => {
            this.handleSpinnerToggle(component);
            if (response.getState() === "SUCCESS") {
                const resultData = response.getReturnValue();
             	resultData.forEach(record => {
                 	record.Link = '/' + record.Id;
                 	record.ContactName = record.Name;
                 	record.AccountLink = record.Account ? '/' + record.AccountId : '';
            		record.AccountName = record.Account ? record.Account.Name : '';
                 	record.OwnerLink = '/' + record.OwnerId;
                 	record.OwnerName = record.Owner.Name;
                 	record.CreatedByLink = '/' + record.CreatedById;
                 	record.CreatedByName = record.CreatedBy.Name;
            		record.CreatedDateName = $A.localizationService.formatDate(record.CreatedDate);
             	});
             
                component.set('v.isLastPage', resultData.length < component.get('v.pageSize'));
                component.set('v.dataSize', resultData.length);
                component.set('v.filteredData', resultData);
                component.set('v.data', resultData);
            }
            else{
            	this.showToast(component, 'ERROR', 'error', 'Failed to retrieve contacts\n' + JSON.stringify(response.getError()));           
            }
        });
        this.handleSpinnerToggle(component);     
        $A.enqueueAction(action);
    },
           
    //delete contact and delete record of dataTable, if contact has been deleted successfully        
    deleteRecord: function(component, event) {
        const contact = event.getParam('row');
        const contactId = contact.Id;    
        const action = component.get('c.deleteContact');

        action.setParams({contact});        
     	action.setCallback(this, response => {                       
        	if (response.getState() === "SUCCESS" ) {
                const data = component.get('v.data');
            	const filteredData = component.get('v.filteredData');
            	const findFunc = element => element.Id === contactId;
                    
            	const rowIndex = data.findIndex(findFunc);
            	data.splice(rowIndex, 1);
            	component.set('v.data', data);
            		
            	const filteredRowIndex = filteredData.findIndex(findFunc);                             
                filteredData.splice(filteredRowIndex, 1);
                component.set('v.filteredData', filteredData);
            
                this.showToast(component, "Success!","success","The contact was deleted successfully.");
         	}            
           	else{
            	const errObj = response.getError();
            	//const errMessage = Array.isArray(errObj) && errObj.length && errObj[0].pageErrors && errObj[0].pageErrors.length 
            	//				? errObj[0].pageErrors[0].message : JSON.stringify(response.getError());
            	const errMessage = JSON.stringify(response.getError());				
          		this.showToast(component, "ERROR", "error", errMessage);
            }           
        }); 
            
       	$A.enqueueAction(action);
    },
	
    //change view sort parametors by clicking column         
    processSortDataTable: function(component, event) {
        const sortBy = event.getParam('fieldName');      
        const sortDirection = event.getParam('sortDirection');
        component.set('v.sortDirection', sortDirection);
        component.set('v.sortBy', sortBy);      
    },
            
    //process searching in data table         
    processSearch: function(component, event) {
     	component.set('v.pageNumber', 1);     
    },         
            
    // look for snippet in field of row        
	filterCurrPage: function(row, columns, regex) {
 		for(const column of columns){
            const columnName = column.typeAttributes ? column.typeAttributes.label.fieldName : column.fieldName;        
            if(!columnName) continue;         
            if(row[columnName] !== undefined && regex.test(row[columnName])){
                return true;
            }
        } 
    
    	return false;
	},
        
    //for manage spinner    
    handleSpinnerToggle: function (component) {
        $A.util.toggleClass(component.find("spinner"), "slds-hide");
    },
    
    // helper for sends toast (or alert if toast is not available) to user
    showToast: function(component, title, type, message){      
        if(type === 'success'){
         	component.set('v.visibleSucc', true);
        	component.set('v.messSucc', message);   
            setTimeout(() => {
                component.set('v.visibleSucc', false);
            }, 2000 );}
        else if(type === 'error'){
            component.set('v.visibleErr', true);
        	component.set('v.messErr', message);}  
        else
         	alert(message);                  
    },
})