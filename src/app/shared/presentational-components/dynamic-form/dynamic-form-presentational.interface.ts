export interface Validator {
  name: string
  validator: any
  message: string
}

export interface FormFieldConfigInterface {
  label?: string
  name?: string
  type: string
  inputType?: string
  options?: FormSelectOptionInterface[]
  collections?: any
  value?: any
  validations?: Validator[]
  class?: string
  style?: {}
  disabled?: boolean
  appSearchSelections?: {
    data: number
    isStockCustomer?: boolean
    isShowLabel?: boolean
    placeHolder?: string
  }
}

export interface FormValueInterface {
  name: string
  value: any
}

export interface FormSelectOptionInterface {
  view: any
  value: any
}

// export interface TableConfigInterface {
// 	tableHeadCol: {
// 		tableHeadNames: [
// 			{ tableHeadDef: string, tableHeadDisplayName: string }
// 		],
// 		displayedColumns: string[]
// 	},
// 	tableProperty: {
// 		tableFormArrayName: any
// 	},
// 	tableData: any
// }
