import { analyzeAndValidateNgModules } from '@angular/compiler'
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren, AfterContentChecked } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { from, Subject } from 'rxjs'
import { groupBy, mergeMap, toArray } from 'rxjs/operators'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { InventoryEndpoint } from '../../../services/endpoints/inventory.endpoint'
import { InventoryInquiryHistoryComponent } from '../inventory-inquiry-history/inventory-inquiry-history.component'
import { ProductWarehouse } from './productWarehouse'
import { Stock } from './stock'
import { InventoryOutputManagementComponent } from '../inventory-output-management/inventory-output-management.component'
import { InventoryInquiryOrderDetailComponent } from '../inventory-inquiry-order-detail/inventory-inquiry-order-detail.component'
import { WholesaleOrderDialogComponent } from '../inventory-inquiry-dialog/wholesale-order-dialog/wholesale-order-dialog.component'
import { TransportDialogComponent } from '../inventory-inquiry-dialog/transport-dialog/transport-dialog.component'

@Component({
  selector: 'app-inventory-inquiry',
  templateUrl: './inventory-inquiry.component.html',
  styleUrls: ['./inventory-inquiry.component.css'],
})
export class InventoryInquiryComponent implements OnInit, AfterContentChecked {
  public customersJsonOb: any
  public customersDropDown: any[] = []
  public pickedCustomerId: number
  public pickedCustomerName: string

  public stocksJsonOb: any
  public stocksArray: Stock[] = []
  public warehousesDropDown: any[] = [
    {
      view: '清空所选仓库',
      value: 0,
    },
  ]
  // public warehousesDropDown: any[];
  public productWarehouseGroup: any[] = [] //this is the group by array
  public productWarehouseDataSource
  public displayedWarehouseColumns: string[] = [] //this is for the columns, which is the warehouse names
  public showProductWarehouseTable = false // to show after picking a customer
  public productWarehouseJsonObData: any
  public pickedWarehouseId: number
  public pickedWarehouseName: string
  public productDetailGroup: any[] = [] // row to column. row is product and column is detail
  // displayedDetailColumns is used to show the second table(which includes the 3 situations)
  public displayedDetailColumns: string[] = ['项目', '实际库存', '虚拟库存', '正在销售', '正在购买', '正在转出', '正在转入']
  public productDetailDataSource // the second table (3 situations) all using this datasource
  public productDetailJsonObData: any
  public pickedProductId = 0 // 0 when no picking
  public pickedProductName: string
  // just used for return product name, have used the search selection
  public productsDropDown: any[] = [
    {
      view: '清空所选产品',
      value: 0,
    },
  ]
  public showProductDetailTable = false // to show the second table
  public pendings = [] // 待出库Column的array，从api获取
  customerFC = new FormControl()

  private paginator: MatPaginator
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp
    if (this.productWarehouseDataSource) {
      this.setDataSourceAttributes()
    }
    if (this.productDetailDataSource) {
      this.setProductproductDetailDataSourcePaginator()
    }
  }

  public productFormControl = new FormControl('')
  // these two are used to show the detail button
  // public validWarehouse: boolean = false
  // public validProduct: boolean = false
  public validWarehouse = false
  public validProduct = false

  public currentStockId: string
  public showWarehouseAndProductTable = false
  excelExportValue = []

  constructor(
    private inventoryService: InventoryEndpoint,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.customerFC.valueChanges.subscribe((res) => {
      if (res) {
        this.getCustomer(res)
      }
    })
    this.inventoryService.getCustomersList().subscribe((value) => {
      this.customersJsonOb = value
      this.convertToCustomerDropDown(this.customersJsonOb)
    })
  }

  ngAfterViewInit() {
    // setTimeout(() =>{
    //     this.validWarehouse = (this.pickedWarehouseId != 0 && this.pickedWarehouseId)? true : false;
    // });
    // setTimeout(() =>{
    //     this.validProduct = (this.pickedProductId != 0 && this.pickedProductId)? true : false;
    // });
    // this.validWarehouse = (this.pickedWarehouseId != 0 && this.pickedWarehouseId)? true : false;
    // this.validProduct = (this.pickedProductId != 0 && this.pickedProductId)? true : false;
    // this.changeDetector.detectChanges()
  }

  ngAfterViewChecked() {
    // this.validWarehouse = (this.pickedWarehouseId != 0 && this.pickedWarehouseId)? true : false;
    // this.validProduct = (this.pickedProductId != 0 && this.pickedProductId)? true : false;
  }

  ngAfterContentChecked() {
    // this.validWarehouse = (this.pickedWarehouseId != 0 && this.pickedWarehouseId)? true : false;
    // this.validProduct = (this.pickedProductId != 0 && this.pickedProductId)? true : false;
    this.changeDetector.detectChanges()
  }

  setDataSourceAttributes() {
    this.productWarehouseDataSource.paginator = this.paginator
  }

  public setProductproductDetailDataSourcePaginator(): void {
    this.productDetailDataSource.paginator = this.paginator
  }

  private convertToCustomerDropDown(jsonOb: any): void {
    for (const customer of jsonOb) {
      this.customersDropDown.push({
        view: customer['CustomerName'],
        value: customer['CustomerId'],
      })
    }
  }

  //drop down button
  public getCustomer(customerId): void {
    this.showWarehouseAndProductTable = true //this one is for the wh and prod drop-down buttons
    // setTimeout(() => {
    //   this.validWarehouse = false;
    //   this.validProduct = false;
    // });
    this.validWarehouse = false
    this.validProduct = false
    this.pickedCustomerId = customerId
    this.pickedCustomerName = this.getCustomerNameById(customerId)
    this.getStocks(customerId)
  }

  private getCustomerNameById(id: number): string {
    let customerName: string
    for (let i = 0; i < this.customersDropDown.length; i++) {
      if (this.customersDropDown[i]['value'] === id) {
        customerName = this.customersDropDown[i]['view']
        break
      }
    }
    return customerName
  }

  // user picks customer then we get data from backend
  private getStocks(customerId: number) {
    this.inventoryService.getStockByCustomerId(customerId).subscribe((value: any) => {
      console.log(value)
      this.pendings = value.Pending
      this.stocksJsonOb = value.StockInfos
      this.stocksArray = this.convertToStocks(this.stocksJsonOb)
      this.convertToWarehouseDropDown(this.stocksArray)
      this.convertToProductDropDown(this.stocksArray)
      this.buildProductWarehouseTable(this.stocksJsonOb) // show the table when picks customer
    })
  }

  private convertToStocks(jsonOb: any): Stock[] {
    const res: Stock[] = []
    for (const stock of jsonOb) {
      const a_stock: any = {}
      a_stock.StockId = stock['StockId']
      a_stock.WarehouseId = stock['WarehouseId'] // 面单类型
      a_stock.WarehouseName = stock['WarehouseName'] // 订单编号
      a_stock.BaseProductId = stock['BaseProductId'] //拼命简称
      a_stock.ProductName = stock['ProductName'] //客户
      a_stock.CustomerId = stock['CustomerId']
      a_stock.CustomerName = stock['CustomerName']
      a_stock.Quantity = stock['Quantity']
      a_stock.PreSellQty = stock['PreSellQty']
      a_stock.PreBuyQty = stock['PreBuyQty']
      a_stock.PreTranInQty = stock['PreTranInQty']
      a_stock.PreTranOutQty = stock['PreTranOutQty']
      res.push(a_stock)
    }
    return res
  }

  // the duplicate warehouse no need to add
  // To show the warehouse dropdown button
  private convertToWarehouseDropDown(stocks: Stock[]): void {
    // this.warehousesDropDown = [];
    for (const stock of stocks) {
      let warehouseRes: any[] = []
      warehouseRes = this.warehousesDropDown.filter((wh) => wh['value'] === stock.WarehouseId)
      if (warehouseRes.length == 0) {
        this.warehousesDropDown.push({
          view: stock['WarehouseName'],
          value: stock['WarehouseId'],
        })
      }
    }
  }

  // To show the product dropdown button
  private convertToProductDropDown(stocks: Stock[]): void {
    for (const stock of stocks) {
      let productRes: any[] = []
      productRes = this.productsDropDown.filter((product) => product['value'] === stock.BaseProductId)
      if (productRes.length == 0) {
        this.productsDropDown.push({
          view: stock['ProductName'],
          value: stock['BaseProductId'],
        })
      }
    }
  }

  //To build table when user just picks customer, and show Product-Warehouse
  private buildProductWarehouseTable(stocks: any): void {
    this.displayedWarehouseColumns = this.getWarehouseNames()
    this.productWarehouseGroup = [] //reset the array
    const source = from(stocks)
    source
      .pipe(
        groupBy((stock) => stock['BaseProductId']),
        mergeMap((group) => group.pipe(toArray()))
      )

      .subscribe((val) => {
        this.productWarehouseGroup.push(val)
      })
    console.log(this.productWarehouseGroup)
    const productWarehouseJsonObsForTable: any[][] = []
    for (let i = 0; i < this.productWarehouseGroup.length; i++) {
      productWarehouseJsonObsForTable[i] = []
      const obj = {}
      for (let j = 0; j < this.productWarehouseGroup[i].length; j++) {
        // 第一个table的'项目'cloumn的内容
        obj['项目'] = {
          data: this.productWarehouseGroup[i][j]['ProductCode'] + ' -- ' + this.productWarehouseGroup[i][j]['ProductName'],
          id: 0,
        }
        obj['BaseProductId'] = this.productWarehouseGroup[i][j]['BaseProductId']
        obj['CustomerId'] = this.productWarehouseGroup[i][j]['CustomerId']
        obj[this.productWarehouseGroup[i][j]['WarehouseName']] = {
          data: this.productWarehouseGroup[i][j]['Quantity'],
          id: this.productWarehouseGroup[i][j]['WarehouseId'],
        }
        if (this.productWarehouseGroup[i][j]['PreBuyQty'] - this.productWarehouseGroup[i][j]['PreSellQty'] != 0) {
          if (!obj['待批发']) {
            obj['待批发'] = {
              data: this.productWarehouseGroup[i][j]['PreBuyQty'] - this.productWarehouseGroup[i][j]['PreSellQty'],
              id: 9992,
            }
          } else {
            obj['待批发'].data += this.productWarehouseGroup[i][j]['PreBuyQty'] - this.productWarehouseGroup[i][j]['PreSellQty']
          }
        }

        if (this.productWarehouseGroup[i][j]['PreTranInQty'] - this.productWarehouseGroup[i][j]['PreTranOutQty'] != 0)
          if (!obj['在途']) {
            obj['在途'] = {
              data: obj['在途']
                ? obj['在途'].data
                : 0 + this.productWarehouseGroup[i][j]['PreTranInQty'] - this.productWarehouseGroup[i][j]['PreTranOutQty'],
              id: 9993,
            }
          } else {
            obj['在途'].data += this.productWarehouseGroup[i][j]['PreTranInQty'] - this.productWarehouseGroup[i][j]['PreTranOutQty']
          }
        // obj['运输等待'] = this.productWarehouseGroup[i][j]['PreTranInQty'] - this.productWarehouseGroup[i][j]['PreTranInQty'];
        // 遍历api的Pendings数组来填入'待出库'column的值
        const pending = this.pendings.filter((item) => item.BaseProductId === this.productWarehouseGroup[i][j]['BaseProductId'])
        if (pending.length) {
          obj['待出库'] = {
            data: pending[0].Quantity,
            id: 9991,
          }
        }
      }
      productWarehouseJsonObsForTable[i].push(obj)
    }
    console.log(productWarehouseJsonObsForTable)

    this.productWarehouseJsonObData = productWarehouseJsonObsForTable
    this.productWarehouseDataSource = new MatTableDataSource<any>(this.productWarehouseJsonObData)
    this.productWarehouseDataSource.paginator = this.paginator
    //console.log(this.productWarehouseGroup);
    //everytime when we select a new customer, false the product-detail table and true the product warehouse table
    // this.showProductWarehouseTable = false
    // this.showProductDetailTable = true;
    setTimeout(() => {
      this.showProductWarehouseTable = true
      this.showProductDetailTable = false
    })

    this.productDetailGroup = []
  }

  //value from drop down warehouses
  public getWarehouse(warehouseId): void {
    console.log(warehouseId)
    this.pickedWarehouseId = warehouseId
    this.pickedWarehouseName = this.returnWarehouseName(warehouseId)
    // tslint:disable-next-line:triple-equals
    if (!warehouseId || warehouseId == 0) {
      console.log(this.pickedCustomerId)
      console.log(this.productFormControl.value)
      if (this.pickedCustomerId && (!this.productFormControl.value || this.productFormControl.value === ' ')) {
        this.getCustomer(this.pickedCustomerId)
        setTimeout(() => {
          this.getCustomer(this.pickedCustomerId)
        })
        return
      }
    }
    this.resetWarehouse()
    setTimeout(() => {
      this.validWarehouse = this.pickedWarehouseId != 0 && this.pickedWarehouseId ? true : false
    })
    //this.validWarehouse = this.pickedWarehouseId != 0 && this.pickedWarehouseId ? true : false
    this.checkWarehouseAndProduct(true)
  }

  // value from drop down of products
  public getProduct(): void {
    this.pickedProductId = this.productFormControl.value
    this.pickedProductName = this.returnProductName(this.pickedProductId)
    console.log(this.pickedProductId)
    setTimeout(() => {
      this.validProduct = this.pickedProductId != 0 && this.pickedProductId ? true : false
    })
    //this.validProduct = this.pickedProductId != 0 && this.pickedProductId ? true : false
    this.checkWarehouseAndProduct(false)
  }

  //This function is a core here. To check:
  // if user switches between the warehouse and product dropdown buttons.
  private checkWarehouseAndProduct(warehouseChanged: boolean): void {
    if ((this.pickedWarehouseId == 0 || !this.pickedWarehouseId) && (this.pickedProductId == 0 || !this.pickedProductId)) {
      // this.showProductWarehouseTable = false
      // this.showProductDetailTable = true
      setTimeout(() => {
        this.showProductWarehouseTable = true
        this.showProductDetailTable = false
      })
    } else if (this.pickedWarehouseId != 0 && (!this.pickedProductId || this.pickedProductId == 0)) {
      this.buildProductDetailsTable(this.stocksJsonOb)
    } else if ((!this.pickedWarehouseId || this.pickedWarehouseId == 0) && this.pickedProductId != 0) {
      this.buildWarehouseDetailsTable(this.stocksJsonOb)
    } else {
      this.buildSingleProductDetailTable(true)
    }
  }

  //Table for product and details
  private buildProductDetailsTable(stocks: any): void {
    //have to reset the array every time.
    this.productDetailGroup = []

    let stocksWithPickedWarehouse: any[]
    stocksWithPickedWarehouse = stocks.filter((stock) => stock['WarehouseId'] == this.pickedWarehouseId)
    const source = from(stocksWithPickedWarehouse)
    //group by product -- row by row product
    source
      .pipe(
        groupBy((stock) => stock['BaseProductId']),
        mergeMap((group) => group.pipe(toArray()))
      )
      .subscribe((val) => {
        this.productDetailGroup.push(val)
      })
    //console.log(this.productDetailGroup);

    const productDetailJsonObsForTable: any[][] = []
    this.excelExportValue = []
    for (let i = 0; i < this.productDetailGroup.length; i++) {
      productDetailJsonObsForTable[i] = []
      const obj = {}

      const quantity = this.productDetailGroup[i][0]['Quantity']
      const preSellQty = this.productDetailGroup[i][0]['PreSellQty']
      const preBuyQty = this.productDetailGroup[i][0]['PreBuyQty']
      const preTranOutQty = this.productDetailGroup[i][0]['PreTranOutQty']
      const preTranInQty = this.productDetailGroup[i][0]['PreTranInQty']
      // var availableQty = quantity + preSellQty - preTranOutQty
      const availableQty = quantity - preSellQty - preTranOutQty + preBuyQty + preTranInQty

      obj['项目'] = this.productDetailGroup[i][0]['ProductCode'] + ' -- ' + this.productDetailGroup[i][0]['ProductName']
      obj['实际库存'] = quantity
      obj['虚拟库存'] = availableQty
      obj['正在销售'] = preSellQty
      obj['正在购买'] = preBuyQty
      obj['正在转出'] = preTranOutQty
      obj['正在转入'] = preTranInQty

      productDetailJsonObsForTable[i].push(obj)
      this.excelExportValue.push(obj)
    }

    this.productDetailJsonObData = productDetailJsonObsForTable
    this.productDetailDataSource = new MatTableDataSource<any>(productDetailJsonObsForTable)
    //this.productDetailDataSource.paginator = this.paginator.toArray()[1];
    this.productDetailDataSource.paginator = this.paginator

    // this.showProductWarehouseTable = true
    // this.showProductDetailTable = false
    setTimeout(() => {
      this.showProductWarehouseTable = false
      this.showProductDetailTable = true
    })
    // this.showProductWarehouseTable = false
    // this.showProductDetailTable = true
  }

  // only a single line
  // there is a situation when customer -> warehouse -> product
  // goes to warehouse and switch again, because we have not loaded the warehouse-detail table
  // we have to load the table here so we can have data.
  private buildSingleProductDetailTable(warehouseChanged: boolean): void {
    let singleProductDetailJsonObForTable: any[][] = []
    if (warehouseChanged) {
      const temRes: any[] = []
      let stocksWithPickedProduct: any[]
      stocksWithPickedProduct = this.stocksJsonOb.filter((stock) => stock['BaseProductId'] === this.pickedProductId)
      const source = from(stocksWithPickedProduct)
      source
        .pipe(
          groupBy((stock) => stock['WarehouseId']),
          mergeMap((group) => group.pipe(toArray()))
        )
        .subscribe((val) => {
          temRes.push(val)
        })

      const temArray = temRes.filter((group) => {
        return this.pickedWarehouseName == group[0]['WarehouseName']
      })

      const warehouseDetailJsonObsForTable: any[][] = []
      for (let i = 0; i < temArray.length; i++) {
        warehouseDetailJsonObsForTable[i] = []
        const obj = {}
        for (let j = 0; j < temArray[i].length; j++) {
          const quantity = temArray[i][j]['Quantity']
          const preSellQty = temArray[i][j]['PreSellQty']
          const preBuyQty = temArray[i][j]['PreBuyQty']
          const preTranOutQty = temArray[i][j]['PreTranOutQty']
          const preTranInQty = temArray[i][j]['PreTranInQty']
          const availableQty = quantity - preSellQty + preTranOutQty + preBuyQty + preTranInQty

          obj['项目'] = temArray[i][j]['WarehouseName']
          obj['实际库存'] = quantity
          obj['虚拟库存'] = availableQty
          obj['正在销售'] = preSellQty
          obj['正在购买'] = preBuyQty
          obj['正在转出'] = preTranOutQty
          obj['正在转入'] = preTranInQty
        }
        warehouseDetailJsonObsForTable[i].push(obj)
      }
      singleProductDetailJsonObForTable = warehouseDetailJsonObsForTable
    } else {
      singleProductDetailJsonObForTable = this.productDetailJsonObData.filter((group) => {
        return this.pickedProductName === group[0]['项目']
      })
    }

    // console.log(singleProductDetailJsonObForTable);
    // here it is using the same datasource with product detail, but only showing one single row
    this.productDetailDataSource = new MatTableDataSource<any>(singleProductDetailJsonObForTable)
  }

  private buildWarehouseDetailsTable(stocks: any): void {
    this.productDetailGroup = [] //reset the array
    let stocksWithPickedProduct: any[]
    stocksWithPickedProduct = stocks.filter((stock) => stock['BaseProductId'] === this.pickedProductId)
    const source = from(stocksWithPickedProduct)
    source
      .pipe(
        groupBy((stock) => stock['WarehouseId']),
        mergeMap((group) => group.pipe(toArray()))
      )
      .subscribe((val) => {
        this.productDetailGroup.push(val)
      })

    const warehouseDetailJsonObsForTable: any[][] = []
    this.excelExportValue = []
    for (let i = 0; i < this.productDetailGroup.length; i++) {
      warehouseDetailJsonObsForTable[i] = []
      const obj = {}
      for (let j = 0; j < this.productDetailGroup[i].length; j++) {
        const quantity = this.productDetailGroup[i][j]['Quantity']
        const preSellQty = this.productDetailGroup[i][j]['PreSellQty']
        const preBuyQty = this.productDetailGroup[i][j]['PreBuyQty']
        const preTranOutQty = this.productDetailGroup[i][j]['PreTranOutQty']
        const preTranInQty = this.productDetailGroup[i][j]['PreTranInQty']
        // var availableQty = quantity + preSellQty - preTranOutQty
        const availableQty = quantity - preSellQty - preTranOutQty + preBuyQty + preTranInQty

        obj['项目'] = this.productDetailGroup[i][j]['WarehouseName']
        obj['实际库存'] = quantity
        obj['虚拟库存'] = availableQty
        obj['正在销售'] = preSellQty
        obj['正在购买'] = preBuyQty
        obj['正在转出'] = preTranOutQty
        obj['正在转入'] = preTranInQty
      }
      warehouseDetailJsonObsForTable[i].push(obj)
      this.excelExportValue.push(obj)
    }
    this.productDetailJsonObData = warehouseDetailJsonObsForTable
    this.productDetailDataSource = new MatTableDataSource<any>(this.productDetailJsonObData)
    this.productDetailDataSource.paginator = this.paginator

    // this.showProductWarehouseTable = true
    // this.showProductDetailTable = false
    setTimeout(() => {
      this.showProductWarehouseTable = false
      this.showProductDetailTable = true
    })
    // this.showProductWarehouseTable = false
    // this.showProductDetailTable = true
  }

  //have to reset the values otherwise the array gonna have stack values
  private resetWarehouse(): void {
    this.productDetailGroup = []
  }

  public test(event): void {
    console.log('test')
  }

  //get names for columns
  private getWarehouseNames(): string[] {
    const res: string[] = ['项目']
    for (const wh of this.warehousesDropDown) {
      if (wh['view'] != '清空所选仓库') {
        res.push(wh['view'])
      }
    }
    res.push('在途')
    res.push('待出库')
    res.push('待批发')
    return res
  }

  private returnProductName(pdId: number): string {
    for (const product of this.productsDropDown) {
      if (product['value'] === pdId) {
        return product['view']
      }
    }
  }

  private returnWarehouseName(whId: number): string {
    for (const wh of this.warehousesDropDown) {
      if (wh['value'] == whId) {
        return wh['view']
      }
    }
  }

  private getStockId(): string {
    console.log(this.pickedCustomerId)
    console.log(this.pickedWarehouseId)
    console.log(this.pickedProductId)
    let res: Stock[] = []
    res = this.stocksArray.filter(
      (stock: any) =>
        stock.CustomerId == this.pickedCustomerId && stock.WarehouseId == this.pickedWarehouseId && stock.BaseProductId == this.pickedProductId
    )
    return res[0] ? res[0].StockId : ''
  }

  public openHistory(): void {
    this.currentStockId = this.getStockId()
    console.log(this.currentStockId)
    if (this.currentStockId == '') {
      this.sweetAlert.showSweetAlert('No order information！')
    } else {
      this.inventoryService.currentStockId.next(this.currentStockId)
      const dialogRef = this.dialog.open(InventoryInquiryHistoryComponent, {
        width: '100%',
        height: '97%',
      })
    }
  }

  public openInventoryOutputManagement() {
    console.log(this.pickedCustomerId)
    this.dialog.open(InventoryOutputManagementComponent, {
      width: '100%',
      height: '97%',
      data: this.pickedCustomerId,
    })
  }

  public getRecord(): void {
    console.log('click!')
  }

  openHistoryFromCell(element, warehouseId) {
    if (warehouseId) {
      switch (warehouseId) {
        case 9991:
          this.inventoryService
            .GetOrderNosByType(element[0].BaseProductId, this.pickedCustomerId, 1)
            .toPromise()
            .then((res) => {
              this.dialog.open(InventoryInquiryOrderDetailComponent, {
                width: '2000px',
                height: '800px',
                data: res,
              })
            })
          break
        case 9992:
          this.inventoryService
            .GetOrderNosByType(element[0].BaseProductId, this.pickedCustomerId, 2)
            .toPromise()
            .then((res) => {
              this.dialog.open(WholesaleOrderDialogComponent, {
                width: '2000px',
                height: '800px',
                data: res,
              })
            })
          break
        case 9993:
          this.inventoryService
            .GetOrderNosByType(element[0].BaseProductId, this.pickedCustomerId, 3)
            .toPromise()
            .then((res) => {
              this.dialog.open(TransportDialogComponent, {
                width: '2000px',
                height: '800px',
                data: res,
              })
            })
          break
        default:
          console.log(element)
          console.log(warehouseId)
          this.pickedWarehouseId = warehouseId
          this.pickedProductId = element[0].BaseProductId
          this.openHistory()
          setTimeout(() => {
            this.getWarehouse(0)
            this.pickedProductId = this.productFormControl.value
          })
          break
      }
    }
  }
}

/*
http://45.76.123.59:5050/api/customer/getstockcustomer

http://45.76.123.59:5050/api/Stock/GetStockHistoriesByStockId/{stockId}
*/
