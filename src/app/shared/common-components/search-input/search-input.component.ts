import { Component, OnChanges, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from "@angular/forms";
import { FormFieldConfigInterface, FormValueInterface } from "../../../shared/presentational-components/dynamic-form/dynamic-form-presentational.interface";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

@Component({
    selector: "app-search-input",
    templateUrl: "./search-input.component.html",
    styleUrls: []
})

export class SearchInputComponent implements OnChanges {

    // Search box params
    @Input() public searchBoxParams;
    
    @Output() outputData: EventEmitter<any> = new EventEmitter<any>();

    searchBox = new FormControl('');

    // Autocomplete values will be in state 
    autoCompleteValues = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    filteredOptions: Observable<any>;

    constructor(

    ) { }

    ngOnChanges(changes) {
        console.log(changes)
        // If changed run auto complete subscribe
    }

    // Auto complete list subscription here
    ngOnInit() {
        this.filteredOptions = this.searchBox.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
          );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
    
        return this.autoCompleteValues.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    }

    // Output & emit here
    submit(data){
        this.outputData.emit(data.value);
    }
}

