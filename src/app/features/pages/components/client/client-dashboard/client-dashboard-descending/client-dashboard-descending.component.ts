/*
just handle the data and sort them by descending
then get the first N clients
*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-client-dashboard-descending',
  templateUrl: './client-dashboard-descending.component.html',
  styleUrls: ['./client-dashboard-descending.component.css'],
})
export class ClientDashboardDescendingComponent implements OnInit {
  @Input() pieChartData
  @Input() lineChartData
  @Output() outputData: EventEmitter<any> = new EventEmitter<any>()
  public pickedQuantityForClients: number
  // public descendingPieChartData: any[] = []
  public newPieChartData: any[] = []
  public newLineChartData: any[] = []

  constructor(private sweetalert: SweetAlertService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    console.log(this.pieChartData)
    console.log(this.lineChartData)
    // this.resetTheTwoNewData();
  }

  private resetTheTwoNewData(): void {
    this.newPieChartData = []
    this.newLineChartData = []
  }

  // show the dialog with boolean and get the number N
  public descendingByTotalPrice(): void {
    console.log(this.pieChartData)
    // this.outputData.emit([])
    console.log(this.pickedQuantityForClients)
    this.resetTheTwoNewData()
    this.sortDataByDescending()
    console.log(this.newPieChartData)
    this.buildNewLineChartData()
    console.log(this.newLineChartData)
    this.returnNewData()
  }

  private returnNewData(): void {
    let returnedArray: any[] = []
    returnedArray.push(this.newPieChartData)
    returnedArray.push(this.newLineChartData)
    this.outputData.emit(returnedArray)
  }

  public getDescendingClientQuantity(quantity): void {
    // console.log(quantity)
    if (quantity == 0) {
      this.sweetalert.showSweetAlert('Check the number of customers can not be 0, please re-enter！')
    } else {
      this.pickedQuantityForClients = quantity
    }
  }

  /*
  pieChartData is in good format we use it
  name: kej
  value: 189
  */
  private sortDataByDescending(): void {
    console.log(this.pieChartData)
    this.pieChartData.sort((a, b) => {
      return b.value - a.value
    })
    console.log(this.pieChartData)
    if (this.pickedQuantityForClients >= this.pieChartData.length) {
      //if user picks a number which is larger or equal than the pie length, we just return the same one
      this.newPieChartData = this.pieChartData
    } else {
      this.buildNewPieChartData()
    }
  }

  private buildNewPieChartData(): void {
    for (let record of this.pieChartData) {
      if (this.newPieChartData.length == this.pickedQuantityForClients) {
        break
      } else {
        this.newPieChartData.push(record)
      }
    }
  }

  private buildNewLineChartData(): void {
    for (let lineData of this.lineChartData) {
      for (let newPieData of this.newPieChartData) {
        if (lineData.name == newPieData.name) {
          this.newLineChartData.push(lineData)
        }
      }
    }
  }
}
