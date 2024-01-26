@isTest()
public class TestgetContactsManager {
    
    //prepare data for test
    @testSetup static void CreateData(){
                
        Test.startTest();
        
        Profile profile = [SELECT Id FROM Profile WHERE Name='Standard User']; 
        User userAcc = new User(	
            			Alias = 'iliaAcc', 
                        Email = 'iliaAcc@testdomain.com', 
          				EmailEncodingKey = 'UTF-8', 
                        LastName = 'UserAcc', 
                        LanguageLocaleKey = 'en_US', 
          				LocaleSidKey = 'en_US', 
                        ProfileId = profile.Id, 
          				TimeZoneSidKey = 'America/New_York', 
                        UserName = 'iliaAcc@testdomain.com');        
        
        insert userAcc;
        
        Account acc = new Account(Name = 'AutoTest', OwnerId = userAcc.Id); 
		insert acc;
        
        List<Contact> contacts = new List<Contact>();
        
        contacts.add(new Contact(LastName='iliaA karab', Email = 'autotest1@mail.com', Contact_Level__c = 'Primary'));
        contacts.add(new Contact(FirstName='iliaB', LastName='karab', Email = 'autotest2@mail.com', Contact_Level__c = 'Secondary'));
        contacts.add(new Contact(LastName='ili', Email = 'autotest3@mail.com', Contact_Level__c = 'Tertiary'));
        contacts.add(new Contact(LastName='west', Email = 'autotest4@mail.com', Contact_Level__c = 'Secondary', AccountId = acc.Id));
        contacts.add(new Contact(FirstName='iliaC', LastName='karab', Email = 'autotest5@mail.com', Contact_Level__c = 'Tertiary', AccountId = acc.Id));
    	contacts.add(new Contact(LastName='iliaD karab', Email = 'autotest6@mail.com', Contact_Level__c = 'Primary', AccountId = acc.Id));
                  
        List<Database.SaveResult> results = Database.insert(contacts, false); 
        
        Test.stopTest();
        
        for(Database.SaveResult res: results){
            String errStr = res.getErrors().size() == 0 ? '' : res.getErrors()[0].getMessage();
    		System.assert(res.isSuccess(), 'Error when creating data for ContactListController.getContacts: ' + errStr);  
        }     
    }
    
    //testing delition contacts from workplace Contacts Manager with cases
    @isTest static void TestDeleteContactWithCase() {
        try{
            Test.startTest();
            //Case caseInst = [SELECT Id, ContactId FROM Case Limit 1];    
            Contact cont = [SELECT Id FROM Contact WHERE Id IN (SELECT ContactId FROM Case) Limit 1];
            ContactListController.deleteContact(cont);//caseInst.ContactId);
            Test.stopTest();
        
        	throw new StringException('WARNING! Contacts with existing cases can be deleted');
            
        }catch(Exception e){
        	System.assert(e.getMessage().contains('not be completed because it is associated with the following cases'), e.getMessage());
    	}
    }
      
  	// testing delition contacts from workplace Contacts Manager without cases
    @isTest static void TestDeleteContactWithoutCase() {
        Test.startTest();     
        List<Case> cases = [SELECT Id FROM Case];    
        delete cases;
        
        List<Contact> contacts = [SELECT Id FROM Contact];  
        for(Contact contact: contacts){
         	ContactListController.deleteContact(contact);
      	}
        Test.stopTest();
    }
    
    //pageSize = 10, pageNumber = 1, sortBy = 'Name', sortDirection = 'asc', searchString = 'Ilia'
    @isTest static void getContactWithSearch() {  
        List<Contact> contacts = ContactListController.getContacts(10, 1, 'Name', 'asc', 'Ilia');
        System.assertEquals(4, contacts.size(), 'Wrong nuber of contacts in ContactListController.getContacts');
        System.assertEquals('iliaA karab', contacts[0].Name, 'Wrong sort Name in ContactListController.getContacts');
    }
    
    //pageSize = 10, pageNumber = 1, sortBy = 'Email', sortDirection = 'desc', searchString = ''
    @isTest static void getContactEmailDesc() {
        List<Contact> contacts = ContactListController.getContacts(10, 1, 'Email', 'desc', '');
        System.assertEquals(6, contacts.size(), 'Wrong nuber of contacts in ContactListController.getContacts');
        System.assertEquals('autotest6@mail.com', contacts[0].Email, 'Wrong sort Email in ContactListController.getContacts');
    }
    
    //pageSize = 10, pageNumber = 1, sortBy = 'Contact_Level__c', sortDirection = 'desc', searchString = ''
    @isTest static void getContactContactLevel() {
        List<Contact> contacts = ContactListController.getContacts(10, 1, 'Contact_Level__c', 'desc', '');
        System.assertEquals(6, contacts.size(), 'Wrong nuber of contacts in ContactListController.getContacts');
        System.assertEquals('Tertiary', contacts[0].Contact_Level__c, 'Wrong sort Contact_Level__c in ContactListController.getContacts');
    }
    
    //pageSize = 10, pageNumber = 1, sortBy = 'Name', sortDirection = 'desc', searchString = ''
    @isTest static void getContactControllOffset() {
        List<Contact> contacts = ContactListController.getContacts(3, 2, 'Name', 'desc', '');
        System.assertEquals(3, contacts.size(), 'Wrong nuber of contacts in ContactListController.getContacts');
    }
}