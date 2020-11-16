import { FormControl } from '@angular/forms'

export class TransferProductRow {
  public ProductId: number
  public ProductControl = new FormControl('')
  public WarehouseControl = new FormControl('')
  public WarehouseList: any[] = []
  public TransportList: any[] = []

  public stockQuantity: number
  public transportQuantity: number

  public pickedStockWarehouse: any
  public pickedTransportWarehouse: any
}

/*
STOCK
{
  "fromCustomerId": 225,
  "toCustomerId": 226,
  "urls": [
    "f826dc10-976d-4aa2-97f5-58acfe356f42"
  ],
  "transferApplicationDetails": [
    {
      "productId": 1,
      "warehouseId": 2,
      "transportId": null,
      "quantity": 2
    }
  ]
}




TRANSPORT
{
  "fromCustomerId": 225,
  "toCustomerId": 226,
  "urls": [
    "f826dc10-976d-4aa2-97f5-58acfe356f42"
  ],
  "transferApplicationDetails": [
    {
      "productId": 1,
      "warehouseId": 5,
      "transportId": "35d9f838-2d93-4fb8-acda-d8a7f379d5b5",
      "quantity": 2
    }
  ]
}

*/

/*

{
            "WarehouseId": 8,
            "WarehouseName": "中创",
            "AvaliableStock": 100,
            "Quantity": 100
        }
    ],
    "Transports": [
        {
            "TransportId": "35d9f838-2d93-4fb8-acda-d8a7f379d5b5",
            "WarehouseId": 5,
            "WarehouseName": "重庆",
            "TransportNo": "ewrq",
            "TransportTypeId": 2,
            "TransportTypeName": "空运",
            "Quantity": 4
        }
    ]

*/
