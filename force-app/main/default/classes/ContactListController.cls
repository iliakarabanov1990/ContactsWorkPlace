//get contacts data for page of ContactsManagerComponent
public class ContactListController {
    //complex method of retrieving data from a database using query configuration by params
	@AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Integer pageSize, Integer pageNumber, String sortBy, String sortDirection, String searchString)
    {   
        Integer offset = (pageNumber - 1) * pageSize;
        String search = String.isEmpty(searchString) || String.isBlank(searchString) ? '' : '\'%' + searchString.trim() + '%\'';
        
        List<String> queryArray = new List<String>{
                'SELECT Id, Name, Email, Contact_Level__c, AccountId, Account.Name, OwnerId, Owner.Name, CreatedById, CreatedBy.Name, CreatedDate',
                'FROM Contact',
               	String.isEmpty(searchString) || String.isBlank(searchString) ? '' : 'WHERE Name LIKE ' + search,
                'ORDER BY ' + sortBy + ' ' + sortDirection,
                'LIMIT ' + pageSize + ' OFFSET ' + offset
    		};
                    
        return Database.query(String.join(queryArray, ' '));
    }
       
    //delete contact by button 'del' of ContactsManagerComponent
    @AuraEnabled
    public static void deleteContact(Contact contact)
    {
        delete contact;
    }
}