import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-button',
  templateUrl: './dynamic-button.component.html',
  styleUrls: ['./dynamic-button.component.css']
})

/* Demo for Dynamic Button can be found in finance-invoice-sales component */

/* Dynamic Button Interface Standards:
    This component takes in One input value: buttonConfig
      e.g.    buttonConfig = {
                name: '',
                usage: '',
                color: ''
              };
    *The name property set the text that displayed on the button itself.
    *The usage property define the function of this button.
    *The color property set the ccolor schemeof the button, for now only support FOUR color set: Basic, Primary, Accent, Warn; which defined by Angular Material.

    * In the demo, if no button name was given, then the default button name 
      "Sample Button" will be applied.
    * In the demo, if no color was specified, Angular Matrial will apply 
      'Basic' color scheme.
*/

export class DynamicButtonComponent implements OnChanges {
  @Input() buttonConfig; // Input instructions to construct the button
  @Input() initialName; // Initial sample button name FOR DEMO PURPOSE ONLY
  // @Output() public dynamicButtonEvent = new EventEmitter();
  buttonName: string;
  buttonColor: string;
  
  constructor() { }

  ngOnChanges() {
    // If no button name was specified, default button name will be dispalyed
    if (this.buttonConfig.name != "") {
      this.buttonName = this.buttonConfig.name;
    }
    else {
      this.buttonName = "Sample Button";
    }
    this.buttonColor = this.buttonConfig.color;
  }

  eventHandler() {
   switch (this.buttonConfig.usage) {
    case "trigger": 
      this.onClickEvent();
      break;
    case "submit": 
      this.onSubmit();
      break;
    case "cancel":
      this.onCancel();
      break;
    case "search":
      this.onSearch();
      break;
   }
  }

  onClickEvent() {
    alert("This is a pop up message.");
  }

  onSubmit() {
    console.log("Successfully Submited!");
    // this.dynamicButtonEvent.emit('');
  }

  onCancel() {
    alert("Canceled!");
  }

  onSearch() {
    alert("Search works!")
  }
}