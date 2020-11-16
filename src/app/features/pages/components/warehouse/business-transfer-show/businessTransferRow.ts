// having created transfer being used for showing
export class BusinessTransferRow {
  public ApplicationId: string
  public CreatedAt: string
  public UpdatedAt: string
  public FromCustomerId: number
  public FromCuctomerName: string
  public FromCuctomerCode: string
  public ToCustomerId: number
  public ToCuctomerName: string
  public ToCuctomerCode: string
  public AttachedImages: string[] = []

  public WarehouseList: any[] = []
  public TransportList: any[] = []
}

/*


"ApplicationId": "eb95611f-2a21-49c8-9f79-d057d435988d",
        "CreatedAt": "2020-05-19T07:17:09.59",
        "UpdatedAt": null,
        "FromCustomerId": 225,
        "FromCuctomerName": "100health Ltd",
        "FromCuctomerCode": "666666",
        "ToCustomerId": 226,
        "ToCuctomerName": "4S Trading Ltd",
        "ToCuctomerCode": "C226",
        "AttachedImages": [
            "ba794c4d-3bb2-4e6d-8f65-d48fea645bb3",
            "19af1b9a-312d-4cc4-a2bf-ed444782b081"
        ],

"ApplicationDetails": [
            {
                "ProductId": 7,
                "ProductName": "S26 A2一段*2罐",
                "ProductCode": "SP1-2Tin",
                "Quantity": 60,
                "WarehouseId": 6,
                "WarehouseName": "武汉",
                "TransportId": "0691df42-2217-4108-9238-cf201c8aa447",
                "TransportNo": "qwer",
                "TransportStatus": 3,
                "TransportStatusName": "确定发送"
            },
            {
                "ProductId": 7,
                "ProductName": "S26 A2一段*2罐",
                "ProductCode": "SP1-2Tin",
                "Quantity": 60,
                "WarehouseId": 4,
                "WarehouseName": "广州",
                "TransportId": null,
                "TransportNo": null,
                "TransportStatus": null,
                "TransportStatusName": null
            },

*/

/*
This is the UPDATE business transfer
{
  "applicationId": "7d4c4908-e1f9-4c41-91ec-80bcbdc35f8a",
  "urls": [
    "211a79a7-80d1-4572-8a6a-3df8ca0737f1"
  ],
  "transferApplicationDetails": [
    {
      "productId": 1,
      "warehouseId": 6,
      "transportId": null,
      "quantity": 1
    },
    {
      "productId": 1,
      "warehouseId": 5,
      "transportId": "35d9f838-2d93-4fb8-acda-d8a7f379d5b5",
      "quantity": 1
    }
  ]
}

*/
