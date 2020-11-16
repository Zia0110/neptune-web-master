export interface ProductList {
    ProductId:number,
    ProductName: string;
    supplierId?: number;
    ProductCode: string;
    stockControl?: number;
    image?: string; 
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    BarCode: string;
    display?: number;
    uom?: number;
    Price?: number;
    categoryId1?: number,
    categoryId2?: number,
    categoryId3?: number,
    CategoryName1?: string;
    CategoryName2?: string;
    CategoryName3?: string;
    PlaceOfOrigonId?: number;
    Cin7Code?: string
  } 

  export interface ProductForm {
    productId?:number | null,
    productName: string  | null;
    supplierId?: number | null;
    productCode?: string | null;
    stockControl?: number | null;
    image?: string | null; 
    weight?: number | null;
    length?: number | null;
    width?: number | null;
    height?: number | null;
    barCode?: string | null;
    display?: number | null;
    uom: number | null;
    price?: number | null;
    categoryId1?: number | null,
    categoryId2?: number | null,
    categoryId3?: number | null,
    categoryName1?: string | null;
    categoryName2?: string | null;
    ategoryName3?: string | null;
    placeOfOrigonId?: number | null;
    cin7Code?: string | null
  } 