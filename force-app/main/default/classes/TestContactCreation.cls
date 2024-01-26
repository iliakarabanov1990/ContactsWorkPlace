@isTest()
public class TestContactCreation {
  	 
    //prepare data
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
        
        contacts.add(new Contact(LastName='AutoTest_1', Email = 'autotest1@mail.com', Contact_Level__c = 'Primary'));
        contacts.add(new Contact(LastName='AutoTest_2', Email = 'autotest2@mail.com', Contact_Level__c = 'Secondary'));
        contacts.add(new Contact(LastName='AutoTest_3', Email = 'autotest3@mail.com', Contact_Level__c = 'Tertiary'));
     	contacts.add(new Contact(LastName='AutoTest_4', Email = 'autotest4@mail.com', Contact_Level__c = 'Primary'));
    	contacts.add(new Contact(LastName='AutoTest_5', Email = 'autotest5@mail.com', Contact_Level__c = 'Primary', AccountId = acc.Id));
        
        List<Database.SaveResult> results = Database.insert(contacts, false); 
        
        Test.stopTest();
        
        for(Database.SaveResult res: results){
            String errStr = res.getErrors().size() == 0 ? '' : res.getErrors()[0].getMessage();
    		System.assert(res.isSuccess(), 'Error when creating data for AfterInsertContactTrigger: ' + errStr);  
        }     
    }
    
    //test contact creating (!one for all because the test data is retrieved using SOQL and I wanted to get it in one query)
    @isTest static void TestCreateContactWithCase() {
    
        Test.startTest();
        
        List<Case> cases = [SELECT Id, Status, Origin, Priority, Account.OwnerId, OwnerId, Contact.Contact_Level__c 
                      FROM Case 
                      WHERE Contact.LastName = 'AutoTest_1' 
                      	OR Contact.LastName = 'AutoTest_2'
                      	OR Contact.LastName = 'AutoTest_3'
                      	OR Contact.LastName = 'AutoTest_4'
                      	OR Contact.LastName = 'AutoTest_5'
                      ORDER BY Contact.LastName
                      Limit 5];

        User userAcc = [SELECT Id, LastName FROM User WHERE LastName = 'UserAcc' Limit 1];
        
        Test.stopTest();      
        
        System.assertEquals('Working', cases[0].Status, 'Case Status is not Working in AfterInsertContactTrigger');
        System.assertEquals('New Contact', cases[0].Origin, 'Case Origin is not New Contact in AfterInsertContactTrigger');
        
        System.assertEquals('Primary', cases[0].contact.Contact_Level__c, 'Wrong Contact_Level__c for Primary in AfterInsertContactTrigger');
        System.assertEquals('High', cases[0].Priority, 'Wrong Priority for High in AfterInsertContactTrigger');
        
        System.assertEquals('Secondary', cases[1].contact.Contact_Level__c, 'Wrong Contact_Level__c for Secondary in AfterInsertContactTrigger');
        System.assertEquals('Medium', cases[1].Priority, 'Wrong Priority for Medium in AfterInsertContactTrigger');
        
        System.assertEquals('Tertiary', cases[2].contact.Contact_Level__c, 'Wrong Contact_Level__c for Tertiary in AfterInsertContactTrigger');
        System.assertEquals('Low', cases[2].Priority, 'Wrong Priority for Low in AfterInsertContactTrigger');   
              
        System.assertEquals(UserInfo.getUserId(), cases[3].OwnerId, 'Wrong Owner when Account in Contact is empty in AfterInsertContactTrigger');
        System.assertEquals(userAcc.Id, cases[4].OwnerId, 'Wrong Owner when Account in Contact is filled in AfterInsertContactTrigger');
        System.assertEquals(userAcc.Id, cases[4].Account.OwnerId, 'Wrong Owner when Account in Contact is filled in AfterInsertContactTrigger');
    }
}