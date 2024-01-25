import { LightningElement } from 'lwc';
import { FlowNavigationFinishEvent, FlowAttributeChangeEvent, FlowNavigationBackEvent, FlowNavigationNextEvent, FlowNavigationPauseEvent } from 'lightning/flowSupport';
/*FlowAttributeChangeEvent — Informs the runtime that a component property has changed.
FlowNavigationBackEvent — Requests navigation to the previous screen.
FlowNavigationNextEvent — Requests navigation to the next screen.
FlowNavigationPauseEvent — Requests the flow runtime to pause the flow.
FlowNavigationFinishEvent — Requests the flow runtime to terminate the flow.*/
export default class LWCFLOW extends LightningElement {
    // accountName;
    // accountNumber;
    // phone;
    //handleReset(event) {
        // this.template.querySelectorAll('lightning-input').forEach(element => {
        //     element.value = null;
        // });
        // this.accountName = undefined;
        // this.accountNumber = undefined;
        // this.phone = undefined;
    //}
    handleSaveData() {
        // navigate to the next screen
        this.First_Name = 'test';
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    }
    handleClose() {
        // navigate to the back screen
        // let p = new PageReference('https://iliacorp5-dev-ed.develop.lightning.force.com/lightning/n/ContactsManager');
        // p.setRedirect(false);
        this.dispatchEvent(new CloseActionScreenEvent());
    }
    get isDisableSaveBtn() {
        return false;
        //!this.accountName;
    }
    // handleFieldChange(event) {
    //     if (event.target.name === 'name') {
    //         this.accountName = event.detail.value;
    //     } else if (event.target.name === 'accountnumber') {
    //         this.accountNumber = event.detail.value;
    //     } else if (event.target.name === 'phone') {
    //         this.phone = event.detail.value;
    //     }
    // }
}