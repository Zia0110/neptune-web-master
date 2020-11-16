import { Component, EventEmitter, Inject, NgModule, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { SearchSelectionServiceService } from '../../../../../shared/common-components/search-selection/search-selection-service.service'
import { ProductEndpoint } from '../../../services/endpoints/product.endpoint'
import { BaseProductMappingDialogComponent } from '../base-product-mapping-dialog/base-product-mapping-dialog.component'

@Component({
  selector: 'app-product-detail-edit',
  templateUrl: './product-detail-edit.component.html',
  styleUrls: ['./product-detail-edit.component.css'],
})
export class ProductDetailEditComponent implements OnInit {
  selectedFile: File = null
  imageUploaded: boolean
  // ProductForm: ProductForm;
  ProductForm: any
  ProductBaseForm: any
  productListTitle: string
  selectCategory1: [] = []
  selectCategory2: [] = []
  selectCategory3: [] = []
  selectPlaceOfOrigin: [] = []
  selectSupplier: [] = []
  selectProductType = []
  selectDisplay: number
  submitDisable = false
  imgSrc: any
  baseProductFC = new FormControl()
  isMixBaseProductSelected = false
  @Output() isOpenMix = new EventEmitter()

  constructor(
    private searchSelectionServiceService: SearchSelectionServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any | null,
    private fb: FormBuilder,
    // private dialogRef:MatDialogRef<ProductDetailEditComponent>,
    private productEndpoint: ProductEndpoint,
    public dialog: MatDialog,
    public _img: DomSanitizer,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<ProductDetailEditComponent>
  ) {}

  ngOnInit() {
    this.valueOfData()
  }

  openBaseProductMappingManagementDialog(type, id?) {
    if (type === 'update') {
      this.productEndpoint
        ._getBaseProductMappingById(this.data.response.ProductId)
        .toPromise()
        .then((res: any) => {
          if (!res.length) {
            this.dialog.open(BaseProductMappingDialogComponent, {
              width: '90%',
              height: '80%',
              autoFocus: false,
              data: {
                type: 'new',
                productId: this.data.response.ProductId,
              },
            })
          } else {
            this.dialog.open(BaseProductMappingDialogComponent, {
              width: '90%',
              height: '80%',
              autoFocus: false,
              data: {
                type,
                productId: this.data.response.ProductId,
              },
            })
          }
        })
    } else {
      this.dialog.open(BaseProductMappingDialogComponent, {
        width: '90%',
        height: '80%',
        autoFocus: false,
        data: {
          type,
          productId: id,
        },
      })
    }
  }

  // This method determines whether the form has value or not
  valueOfData() {
    if (this.data.response) {
      if (this.data.boolean) {
        this.productListTitle = 'Show all datas'
      } else {
        this.productListTitle = 'Edit data'
      }
      if (this.data.type === 'detail') {
        this.baseProductFC.valueChanges.subscribe((res) => {
          this.isMixBaseProductSelected = res === 0 || res === 1
        })
        console.log(this.data.response)
        this.baseProductFC.setValue(this.data.response.BaseProductId)
      }
      this.selectCategory1 = this.data.category1
      this.selectCategory2 = this.data.category2
      this.selectCategory3 = this.data.category3
      this.selectPlaceOfOrigin = this.data.placeOfOrigin
      this.selectSupplier = this.data.supplier
      this.selectProductType = this.data.productType
      this.selectDisplay = this.data.response.Display
      this.ProductBaseForm = this.fb.group({
        productName: [{ value: this.data.response.ProductName, disabled: this.data.boolean }, Validators.required],
        productCode: [{ value: this.data.response.ProductCode, disabled: this.data.boolean }, Validators.required],
        barCode: [{ value: this.data.response.BarCode, disabled: this.data.boolean }],
        weight: [{ value: this.data.response.Weight, disabled: this.data.boolean }, Validators.pattern('[0-9]*(.[0-9]*)?')],
        height: [{ value: this.data.response.Height, disabled: this.data.boolean }, Validators.pattern('[0-9]*(.[0-9]*)?')],
        length: [{ value: this.data.response.Length, disabled: this.data.boolean }, Validators.pattern('[0-9]*(.[0-9]*)?')],
        width: [{ value: this.data.response.Width, disabled: this.data.boolean }, Validators.pattern('[0-9]*(.[0-9]*)?')],
        display: [{ value: this.data.response.Display, disabled: this.data.boolean }, Validators.required],
        price: [{ value: this.data.response.Price, disabled: this.data.boolean }, Validators.pattern('[0-9]*(.[0-9]*)?')],
        supplierId: [{ value: this.data.response.SupplierId, disabled: this.data.boolean }],
        // stockControl: [{ value: this.data.response.StockControl, disabled: this.data.boolean }],
        stockControl: [{ value: 0, disabled: this.data.boolean }],
        categoryId1: [{ value: this.data.response.CategoryId1, disabled: this.data.boolean }],
        categoryId2: [{ value: this.data.response.CategoryId2, disabled: this.data.boolean }],
        categoryId3: [{ value: this.data.response.CategoryId3, disabled: this.data.boolean }],
        placeOfOriginId: [{ value: this.data.response.PlaceOfOriginId, disabled: this.data.boolean }],
      })
      console.log(this.data.response)
      this.ProductForm = this.fb.group({
        productName: [{ value: this.data.response.ProductName, disabled: this.data.boolean }, Validators.required],
        productCode: [{ value: this.data.response.ProductCode, disabled: this.data.boolean }, Validators.required],
        uom: [{ value: this.data.response.Uom, disabled: this.data.boolean }, [Validators.pattern('[0-9]*'), Validators.required]],
        display: [{ value: this.data.response.Display, disabled: this.data.boolean }, Validators.required],
        cin7Code: [{ value: this.data.response.Cin7Code, disabled: this.data.boolean }, Validators.required],
        productTypeId: [{ value: this.data.response.ProductTypeId, disabled: this.data.boolean }, Validators.required],
      })
    } else {
      this.productListTitle = ' Add new data'
      this.selectCategory1 = this.data.category1
      this.selectCategory2 = this.data.category2
      this.selectCategory3 = this.data.category3
      this.selectPlaceOfOrigin = this.data.placeOfOrigin
      this.selectSupplier = this.data.supplier
      this.selectProductType = this.data.productType
      this.ProductBaseForm = this.fb.group({
        productName: ['', Validators.required],
        productCode: ['', Validators.required],
        barCode: [''],
        weight: [0, Validators.pattern('[0-9]*(.[0-9]*)?')],
        height: [0, Validators.pattern('[0-9]*(.[0-9]*)?')],
        length: [0, Validators.pattern('[0-9]*(.[0-9]*)?')],
        width: [0, Validators.pattern('[0-9]*(.[0-9]*)?')],
        display: ['1', Validators.required],
        price: ['', Validators.pattern('[0-9]*(.[0-9]*)?')],
        supplierId: [null],
        stockControl: [0],
        categoryId1: [null],
        categoryId2: ['', Validators.required],
        categoryId3: [null],
        placeOfOriginId: [null],
      })
      this.ProductForm = this.fb.group({
        productName: ['', Validators.required],
        productCode: ['', Validators.required],
        uom: [6, [Validators.pattern('[0-9]*'), Validators.required]],
        display: ['1', Validators.required],
        cin7Code: ['', Validators.required],
        productTypeId: ['', Validators.required],
      })
    }
  }

  resetProductAndCustomerData() {
    this.searchSelectionServiceService.products = []
    this.searchSelectionServiceService.baseProducts = []
    this.searchSelectionServiceService.customers = []
    this.searchSelectionServiceService.stockCustomers = []
    this.searchSelectionServiceService.warehouses = []
  }

  async onSubmit() {
    console.log('submit', this.ProductForm.value)
    if (this.data.type === 'base' && !this.ProductBaseForm.valid) {
      this.sweetAlertService.showSweetAlert('Required fields are not completed！')
      return
    }
    if (this.data.type === 'detail' && !this.ProductForm.valid) {
      this.sweetAlertService.showSweetAlert('Required fields are not completed！')
      return
    }
    if (this.data.type === 'detail' && !this.baseProductFC.value && this.baseProductFC.value !== 0) {
      this.sweetAlertService.showSweetAlert('Please select basic product before submitting！')
      return
    }
    if (this.data.type === 'base') {
      delete this.ProductBaseForm.value.categoryName1,
        delete this.ProductBaseForm.value.categoryName2,
        delete this.ProductBaseForm.value.categoryName3
    }
    this.submitDisable = true

    // check that got new image or not
    if (this.data.type === 'base') {
      // console.log("you can submit",this.ProductBaseForm.valid)
      // if user upload a new image
      if (this.imageUploaded) {
        const fd = new FormData()
        fd.append('imageFile', this.selectedFile, this.selectedFile.name)
        await this.productEndpoint
          ._ImageUpload(fd)
          .toPromise()
          .then((response: any) => {
            // console.log(response)
            this.ProductBaseForm.value.image = `${response.FileNameForStorage}`
          })
        // console.log("image can send to backend")
      } else if (this.data.response) {
        this.ProductBaseForm.value.image = this.data.response.Image
      }

      // This method is used to determine whether the submit is used for add or edit
      if (this.data.response) {
        console.log('post data', this.ProductBaseForm.value)
        // console.log("post id",this.data.response.ProductId)
        await this.productEndpoint
          ._editBaseProductDetails(this.data.response.BaseProductId, this.ProductBaseForm.value)
          .toPromise()
          .then(
            (response) => {
              // console.log("post success", response)
              // alert('success')
              this.sweetAlertService.showSuccessMessage('Modified successed!')
              this.resetProductAndCustomerData()
            },
            (error) => {
              console.log('post error', error)
              this.sweetAlertService.showSweetAlert('Failed!')
            }
          )
      } else {
        // console.log("add data",typeof(this.ProductBaseForm.value.display))
        // console.log("add data",this.ProductBaseForm.value.display)
        this.productEndpoint._addBaseProductsList(this.ProductBaseForm.value).subscribe(
          (response: any) => {
            // console.log("add success", response)
            this.sweetAlertService.showSuccessMessage('Add successed!')
            this.resetProductAndCustomerData()
          },
          (error) => {
            console.log('add data gets error', error)
            this.sweetAlertService.showSweetAlert('Failed')
          }
        )
      }

      // dialog close
      this.dialog.closeAll()
    }
    if (this.data.type === 'detail' && this.ProductForm.valid) {
      // This method is used to determine whether the submit is used for add or edit
      if (this.data.response) {
        // console.log("post data",typeof(this.ProductForm.value.display))
        // console.log("post id",this.data.response.ProductId)
        this.ProductForm.value.baseProductId = this.baseProductFC.value
        await this.productEndpoint
          ._editProductDetails(this.data.response.ProductId, this.ProductForm.value)
          .toPromise()
          .then(
            (response) => {
              // console.log("post success", response)
              // alert('success')
              this.sweetAlertService.showSuccessMessage('Modified successed!')
              this.resetProductAndCustomerData()
              if (this.data.response.BaseProductId !== 0 && this.data.response.BaseProductId !== 1 && this.isMixBaseProductSelected) {
                this.openBaseProductMappingManagementDialog('new', response)
              }
            },
            (error) => {
              console.log('post error', error)
              this.sweetAlertService.showSweetAlert('Failed!')
            }
          )
      } else {
        // console.log("add data",typeof(this.ProductForm.value.display))
        // console.log("add data",this.ProductForm.value.display)
        this.ProductForm.value.baseProductId = this.baseProductFC.value
        this.productEndpoint._addProductsList(this.ProductForm.value).subscribe(
          (response: any) => {
            console.log('add success', response)
            this.resetProductAndCustomerData()
            this.sweetAlertService.successAlert('Product added successfully! Initial price is 0, you can update price on price management page.')
            if (this.baseProductFC.value === 0 || this.baseProductFC.value === 1) {
              this.openBaseProductMappingManagementDialog('new', response)
            }
          },
          (error) => {
            console.log('add data gets error', error)
            this.sweetAlertService.showSweetAlert('Failed!')
          }
        )
      }

      // dialog close
      this.dialogRef.close()
    }
    // else {
    //   console.log("you cant submit",this.ProductForm.valid)
    // }
  }

  onFileSelected(event) {
    // 利用event.target.files.length做判断
    this.selectedFile = event.target.files[0] as File
    // console.log(this.selectedFile)
    // console.log(this.data.response.Image)

    // Determine if there is a  new image
    if (event.target.files.length !== 0) {
      this.imageUploaded = true
      this.imgSrc = window.URL.createObjectURL(this.selectedFile) // thumbnail
      // console.log("got image")
    } else {
      this.imageUploaded = false
      // console.log("no image")
    }
  }
}
