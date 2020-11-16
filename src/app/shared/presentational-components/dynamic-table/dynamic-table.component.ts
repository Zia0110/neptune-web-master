import { Component, OnChanges, Input } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from "@angular/forms";
import { FormFieldConfigInterface, FormValueInterface } from "../../../shared/presentational-components/dynamic-form/dynamic-form-presentational.interface";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-dynamic-table",
  templateUrl: "./dynamic-table.component.html",
  styleUrls: ["./dynamic-table.component.css"]
})

export class DynamicTableComponent implements OnChanges {
  dataSource: MatTableDataSource<unknown>;
  displayedColumns: string[];
  tableHeaderNames = [];
  FormGroupsArray = [] ;
  dynamicFormArray = new FormArray([]);

  // Table form groups
  @Input() public formGroups: FormFieldConfigInterface[];
  // Table values 
  @Input() public formValues: FormValueInterface[];
  // Table display contents
  @Input() public tableConfig;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes) {
    console.log(changes)

    this.initTable()
    this.getFormGroupFromArray(this.formGroups);
    this.getTableData(this.formValues);
    this.dataSource = new MatTableDataSource(this.dynamicFormArray.controls);
    this.tableHeaderNames = this.tableConfig["tableHeadCol"].tableHeadNames;
    this.displayedColumns = this.tableConfig["tableHeadCol"].displayedColumns;

    // console.log("formGroups(Passed in):", this.formGroups);
    // console.log(this.dataSource);
  }


  initTable(){
    this.formValues.forEach((value)=>{

    })
  }


  getTableData(valueArray) {
    valueArray.forEach(eachValueSet => {
      // console.log("eachValueSet:", eachValueSet);
    });
  }


  getFormGroupFromArray(formGroupArray) {
    formGroupArray.forEach(FormGroup => {
      let individualFormGroup = this.formGroupInit(FormGroup);
      this.FormGroupsArray.push(individualFormGroup);
      this.dynamicFormArray.push(individualFormGroup);
      // console.log("individualFormGroup:", individualFormGroup);
    });
    // console.log(this.dynamicFormArray);
  }


  formGroupInit(individualFormGroup) {
    let formGroup = this.fb.group({});
    individualFormGroup.forEach(field => {
      if (field.type === "button") return;

      const formControl = this.fb.control(field.value);
      formGroup.addControl(
        field.name, 
        formControl
      );
    });
    return formGroup;
  }


  // assignValueToEachControl(values: FormValueInterface[]) {
  //   for (let value of values) {
  //     this.dynamicFormGroup.controls[value.name].setValue(value.value);
  //   }
  // }
}
