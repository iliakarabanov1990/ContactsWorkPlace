({
    //fill dataTable and its columns first time
	init : function(component, event, helper) {  
        //helper.processSortDataTable(component, event);
        helper.renderColumnsAndActions(component);
        helper.renderContacts(component, helper); 
        //becouse render with sorting by asc
        component.set('v.defaultSortDirection', 'desc');
    },
    
    // handle sorting after click on colums header
	handleSort: function(component, event, helper) {
        helper.processSortDataTable(component, event);
        helper.renderContacts(component, helper);     
    },
    
    // handle searching after click search button
    handleSearch: function(component, event, helper) { 
        helper.processSearch(component, event);
        helper.renderContacts(component, helper);
    }, 
    
    //update data if search has been cleared
    handleClear: function(component, event, helper) {  
        if(!component.get('v.searchStr'))
        	helper.renderContacts(component, helper);
    },
    
    // handle filtering after clicking on column header
    handleFilter: function(component, event, helper) {            
        const data = component.get("v.data"); 
        const term = component.get("v.filter");          
        const columns = component.get("v.columns");   
        let results = data;
                   
        let regex;
        try {
            regex = new RegExp(term, "i");
            results = data.filter(row=>helper.filterCurrPage(row, columns, regex));
        } catch(e) {
            helper.showToast(component, "ERROR", "error", 'Filtering error occurred: ' + e);
        }
        component.set("v.filteredData", results);
    },
    
    // handle action after clicking on button in row
    handleRowAction: function(component, event, helper) {
        var action = event.getParam('action');
        switch (action.name) {
            case 'delete':
                helper.deleteRecord(component, event);
                break;
            default:
                helper.showToast(component, "ERROR", "error", "Something went wrong. Action not completed!");
                break;
        }
    },
    
    //process click button "New Contact" and show modal form
    handleNewContactButton: function(component, event, helper){
        component.set('v.isOpen', true);     
    },
       
    //handle pagination next button
   	handleNext: function(component, event, helper) { 
        var pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber+1);
        helper.renderContacts(component, helper);
    },
	
    //handle pagination prev button
 	handlePrev: function(component, event, helper) {        
        var pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber-1);
        helper.renderContacts(component, helper);
    },     
    
    // handle close button on error message
    handleErrCancel : function(component, event, helper) {
        component.set("v.visibleErr", false);
    },
    
    // handle close button on success message
    handleSuccCancel : function(component, event, helper) {
        component.set("v.visibleSucc", false);
    },

    //process when contact successfully created
    handleNewContactSuccess: function(component, event, helper) {
        helper.showToast(component, "Success!","success","The contact has been delete successfully.");
        component.set("v.isOpen", false);
    }, 
    
    //process when modal form of new contact cancel
    handleNewContactCancel: function(component, event, helper) {
        component.set("v.isOpen", false);
    }, 
})