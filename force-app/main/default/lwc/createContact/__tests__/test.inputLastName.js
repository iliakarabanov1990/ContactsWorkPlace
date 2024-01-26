import { createElement } from "lwc";
import createContact from "c/createContact";
import FIRST_NAME from '@salesforce/schema/Contact.FirstName';
import LAST_NAME from '@salesforce/schema/Contact.LastName';
import EMAIL from '@salesforce/schema/Contact.Email';
import CONTACT_LEVEL from '@salesforce/schema/Contact.Contact_Level__c';
import ACCOUNT from '@salesforce/schema/Contact.AccountId';

describe('c-create-contact-edit-form-dynamic-contact', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders lightning-record-edit-form with given input values', () => {
        const element = createElement('c-create-contact-edit-form-dynamic-contact', {
            is: createContact
        });

        document.body.appendChild(element);
        
         // Validate if correct parameters have been passed to base components
        const arrFields = [FIRST_NAME, LAST_NAME, EMAIL, CONTACT_LEVEL, ACCOUNT];
        const formEls = element.shadowRoot.querySelectorAll('lightning-input-field');

        arrFields.forEach((field, ind) => {
          expect(formEls[ind].fieldName.fieldApiName).toBe(field.fieldApiName);          
        });

        // Validate if cancel and submit button is defined
        const buttonEls = element.shadowRoot.querySelectorAll('lightning-button');
        expect(buttonEls[0].label).toBe('Cancel');
        expect(buttonEls[1].type).toBe('submit');
        expect(buttonEls[1].label).toBe('Save');
    });

});

/*describe("c-unit-test", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("displays unit LastName with input change event", () => {
    const element = createElement("create-contact", {
      is: createContact
    });

    const form = element.shadowRoot.querySelector("lightning-record-edit-form");
    form.submit = jest.fn();

    form.dispatchEvent(new CustomEvent("submit"));

    return Promise.resolve().then(() => {
      expect(form.submit).toHaveBeenCalledWith("");
    });
  });
});*/
