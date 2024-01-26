// trigger for create default case for contact
trigger AfterInsertContactTrigger on Contact (after insert) {
 
    List<Case> caseList = new List<Case>();   
    
    Map<Id, Contact> contactsWithAccOwner = new Map<Id, Contact>(
        [SELECT Id, Account.OwnerId FROM Contact WHERE Id IN :Trigger.new AND Account.OwnerId != null]);
    
    for(Contact contact : trigger.new) {
                
        Case newCase = new Case();
        newCase.Status = 'Working';
        newCase.Origin = 'New Contact';
        newCase.ContactId = contact.Id;

        if (contact.Contact_Level__c == 'Primary') {
            newCase.Priority = 'High';
        } else if (contact.Contact_Level__c == 'Secondary') {
            newCase.Priority = 'Medium';
        } else if (contact.Contact_Level__c == 'Tertiary') {
            newCase.Priority = 'Low'; 
        }
        
        if (contact.AccountId != null) {    
            newCase.AccountId = contact.AccountId;
            if(contactsWithAccOwner.containsKey(contact.Id)){
				newCase.OwnerId = contactsWithAccOwner.get(contact.Id).Account.OwnerId;  
            }
		}
			caseList.add(newCase);
	}

	insert caseList;
}