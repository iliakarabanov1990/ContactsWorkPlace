import { LightningElement } from 'lwc';

import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRST_NAME from '@salesforce/schema/Contact.FirstName';
import LAST_NAME from '@salesforce/schema/Contact.LastName';
import EMAIL from '@salesforce/schema/Contact.Email';
import CONTACT_LEVEL from '@salesforce/schema/Contact.Contact_Level__c';
import ACCOUNT from '@salesforce/schema/Contact.AccountId';

export default class CreateCase extends LightningElement {
    contactObject = CONTACT_OBJECT;
    firstNameField = FIRST_NAME;
    lastNameField = LAST_NAME;
    emailField = EMAIL;
    contactLevelField = CONTACT_LEVEL;
    accountIdField = ACCOUNT;

    handleSave() {
        //this.dispatchEvent(evt);
        const saveEvt = new CustomEvent('save');
        this.dispatchEvent(saveEvt);
    }

    handleCancel() {
        const cancelEvt = new CustomEvent('cancel');
        this.dispatchEvent(cancelEvt);
    }
}