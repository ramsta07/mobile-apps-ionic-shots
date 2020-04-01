export interface Product {
    id?: string;
    productName: string;
    productImageURL: string;
    productPrice: number;
    productCategory: string;
    productDescription: string;
    productBarCode: string;
    productCostPrice: number;
    productSellUnit: string;
    modifiedBy: string;
    modifiedAt: Date
}