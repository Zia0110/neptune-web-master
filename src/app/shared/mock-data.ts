import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import {ProductList} from "../types/product-list.interface"

// Orders mock data
const orders = [
  {
    orderCondition: '1',
    orderType: '1',
    orderId: 2010001204,
    orderProdName: '安佳全4 脱2',
    orderProdTitle: 'ATC',
    orderCustomer: '2',
    orderWarehouse: '1',
    orderComments: '',
    orderBatch: '天津 2020021201',
    orderDate: new Date("2020-02-11"),
  },
  {
    orderCondition: '2',
    orderType: '2',
    orderId: 2010001204,
    orderProdName: '安佳全4 脱2',
    orderProdTitle: 'ATC',
    orderCustomer: '1',
    orderWarehouse: '2',
    orderComments: '',
    orderBatch: '天津 2020021201',
    orderDate: new Date("2020-02-11"),
  },
  {
    orderCondition: '1',
    orderType: '1',
    orderId: 2010001204,
    orderProdName: '安佳全4 脱2',
    orderProdTitle: 'ATC',
    orderCustomer: '3',
    orderWarehouse: '4',
    orderComments: '',
    orderBatch: '天津 2020021201',
    orderDate: new Date("2020-02-11"),
  },
]

// Order Types selection mock data
const orderTypes = [
  { value: '1', display: '电子单' },
  { value: '2', display: '纸单' }
];

// Warehouse selection mock data
const orderWarehouses = [
  { value: '1', display: '天津' },
  { value: '2', display: '武汉' },
  { value: '3', display: '重庆' },
  { value: '4', display: '香港' },
  { value: '5', display: '长沙' },
  { value: '6', display: '上海' },
  { value: '7', display: '青岛' },
  { value: '8', display: 'Auckland' },
  { value: '9', display: 'Sydney' }
];

// Business Customers selection mock data
const orderCustomers = [
  { value: '1', display: 'JDL' },
  { value: '2', display: 'Flyway' },
  { value: '3', display: 'NZH' },
  { value: '4', display: '华阳' }
];


// Order statues selection mock data
const orderStatues = [
  { value: '1', display: "已核单" },
  { value: '2', display: "未核单" }
]

// Business Transfer mock data
const transferData = [
  {
    prodName: 'A2白金',
    prodWarehouse: '1',
    prodStock: 200,
    prodTransferQuantity: 20
  },
  {
    prodName: 'XXXXXX',
    prodWarehouse: '2',
    prodStock: 200,
    prodTransferQuantity: 30
  }
]

//order cancel mock data
const orderCancelData = [
  {
    orderNumber: 2010001204,
    prodDescription: 'Abcd',
    prodName: '安佳全4 脱2',
    prodQuantity: 5,
    receiverName: 'Lory',
    receiverPhone: '0123123456',
    state: 'Auckland',
    city: 'Auckland',
    address: '123 Vincent St',
    statement: '',
    warehouse: '天津',
    orderStatus: 'Padding',
    agentCustomer: '',
    price: ''
  },
  {
    orderNumber: 2010001205,
    prodDescription: 'Qwer',
    prodName: '安佳全41 脱21',
    prodQuantity: 3,
    receiverName: 'Lory',
    receiverPhone: '0123123456',
    state: 'Auckland',
    city: 'Auckland',
    address: '123 Vincent St',
    statement: '',
    warehouse: '天津',
    orderStatus: 'Padding',
    agentCustomer: '',
    price: ''
  },
  {
    orderNumber: 2010001206,
    prodDescription: 'Wasd',
    prodName: '安佳全42 脱22',
    prodQuantity: 5,
    receiverName: 'Lory',
    receiverPhone: '0123123456',
    state: 'Auckland',
    city: 'Auckland',
    address: '123 Vincent St',
    statement: '',
    warehouse: '天津',
    orderStatus: 'Padding',
    agentCustomer: '',
    price: ''
  }
]

// Transfer Settings Mock Data
const transferSettingsData = [
	{
		transferCustomerName: '赵日天',
		trnasferProdName: '某物品',
		transferQuantity: 3,
		transferDescription: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Pariatur, eligendi.'
	},
	{
		transferCustomerName: '曹大地',
		trnasferProdName: '某物品',
		transferQuantity: 5,
		transferDescription: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, praesentium dolore?.'
	}
]

const UnhandledOrders = [
    {
        OrderDate: '2020/2/1',
        OrderType: '批发订单',
        OrderStatus: '',
        OrderContact: '',
        OrderAmount: 36,
        OrderAction: '',
    },
    {
        OrderDate: '2020/2/3',
        OrderType: '转库单',
        OrderStatus: '',
        OrderContact: '',
        OrderAmount: 15,
        OrderAction: '',
    },
    {
        OrderDate: '2020/2/3',
        OrderType: '普通订单',
        OrderStatus: '',
        OrderContact: '',
        OrderAmount: 20,
        OrderAction: '',
    },
    {
        OrderDate: '2020/2/5',
        OrderType: '投诉单',
        OrderStatus: '',
        OrderContact: '',
        OrderAmount: 50,
        OrderAction: '',
    }
]

const RecentOrders = [
    {
        OrderDate: '2020/2/6',
        OrderType: '批发订单',
        OrderStatus: '',
        OrderContact: '',
        OrderAmount: 52,
        OrderAction: '',
    }
]

// Information Card Mock Data
const cardProduct = [
  {
    productId: '2FADD993-BC02-4963-9C28-F20FD40ED866',
    image: 'https://img.xiaopiu.com/userImages/img12733170f4b518d0.png',
    barCode: '0705632441947',
    productName: '可瑞康普通3段',
    standardName: 'KRK003',
    standardPrice: 30,
    weight: 1000,
    category: '婴儿奶粉',
    wuhan: 1002,
    tianjin: 300,
    guangzhou: 204,
    auckland: 30,
    onTheWay: 30,
    ticket: 200
  }
];

const cardCustomer = [
  {
    customerId: '3FADD993-AC02-4963-9C28-F20FD40ED867',
    image: 'https://img.xiaopiu.com/userImages/img12735170f4bddee8.png',
    customerName: '华洋保健品',
    customerShortName: 'HUAYANG',
    phone: '0928331',
    level: 'VIP',
    deliveryAddress: '233 Jason st',
    billingEmail: 'huayang@gmail.com',
    billingAddress: '233 Jason st'
  }
];

const cardWarehouse = [
  {
    warehouseId: '4FADD993-AC02-4963-9C28-F20FD40ED868',
    warehouseName: '武汉仓',
    warehouseLetterName: 'wuhan',
    contactPerson: 'Jack',
    warehouseCode: 'WH023',
    atm1: 300,
    atm2: 300,
    atm3: 300
  }
];


@Injectable()
export class MockData {
  getOrders() {
    return orders;
  }

  getOrderTypeSelection() {
    return orderTypes;
  }

  getOrderWarehousesSelection() {
    return orderWarehouses;
  }

  getOrderCustomersSelection() {
    return orderCustomers;
  }

  getOrderStatues() {
    return orderStatues;
  }

  getTransfers() {
    return transferData;
  }

  getOrderCancel(){
    return orderCancelData;
  }

  getTansferSettings() {
	return transferSettingsData;
  }

  getTestingChartData() {
    return getTestingChartData;
  }

  getUnhandledOrders() {
    return UnhandledOrders;
  }

  getRecentOrders() {
    return RecentOrders;
  }

  getCardProduct() {
    return cardProduct;
  }

  getCardCustomer() {
    return cardCustomer;
  }

  getCardWarehouse() {
    return cardWarehouse;
  }

  getProductList(): Observable<ProductList[]>{
    return of(ProductList_DATA)
  }
  // getProductList(){
  //   return ProductList_DATA
  // }

}


















// Data used for testing d3 charts
const getTestingChartData = [
	{
		"letter": "A",
		"frequency": 0.08167
	},
	{
		"letter": "B",
		"frequency": 0.01492
	},
	{
		"letter": "C",
		"frequency": 0.02782
	},
	{
		"letter": "D",
		"frequency": 0.04253
	},
	{
		"letter": "E",
		"frequency": 0.12702
	},
	{
		"letter": "F",
		"frequency": 0.02288
	},
	{
		"letter": "G",
		"frequency": 0.02015
	},
	{
		"letter": "H",
		"frequency": 0.06094
	},
	{
		"letter": "I",
		"frequency": 0.06966
	},
	{
		"letter": "J",
		"frequency": 0.00153
	},
	{
		"letter": "K",
		"frequency": 0.00772
	},
	{
		"letter": "L",
		"frequency": 0.04025
	},
	{
		"letter": "M",
		"frequency": 0.02406
	},
	{
		"letter": "N",
		"frequency": 0.06749
	},
	{
		"letter": "O",
		"frequency": 0.07507
	},
	{
		"letter": "P",
		"frequency": 0.01929
	},
	{
		"letter": "Q",
		"frequency": 0.00095
	},
	{
		"letter": "R",
		"frequency": 0.05987
	},
	{
		"letter": "S",
		"frequency": 0.06327
	},
	{
		"letter": "T",
		"frequency": 0.09056
	},
	{
		"letter": "U",
		"frequency": 0.02758
	},
	{
		"letter": "V",
		"frequency": 0.00978
	},
	{
		"letter": "W",
		"frequency": 0.0236
	},
	{
		"letter": "X",
		"frequency": 0.0015
	},
	{
		"letter": "Y",
		"frequency": 0.01974
	},
	{
		"letter": "Z",
		"frequency": 0.00074
	}
]


export const ProductList_DATA = [
  {ProductId: 1,ProductCode: '313-231-3131', ProductName: 'Hydrogen', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQWMsn9kNQZfHtmqVgsJyQsadulGA-mWNcJzwIoixBJSoGK-ToQ&usqp=CAU',  uom:2131, BarCode:'1311',weight:1.3},
  {ProductId: 2,ProductCode: '313-231-3133331', ProductName: 'Hyd222rogen', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQWMsn9kNQZfHtmqVgsJyQsadulGA-mWNcJzwIoixBJSoGK-ToQ&usqp=CAU', uom:2123331, BarCode:'13213311'},

];
