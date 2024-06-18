import { IOrder, IProduct, IWebLarekApi } from "../types";
import { Api } from "./base/api";

interface IProductsResponse {
    items: IProduct[];
    total: number;
}

export class WebLarekApi implements IWebLarekApi {
    baseApi: Api;
    cdnUrl?: string;

    constructor(baseApi: Api, cdnUrl: string) {
        this.baseApi = baseApi;
        this.cdnUrl = cdnUrl;
    }

    getProduct(productId: string): Promise<IProduct> {
        return this.baseApi.get(`/product/${productId}`)
                .then((product: IProduct) => product)
    }

    getProducts(): Promise<IProduct[]> {
        return this.baseApi.get('/product/')
                .then((products: IProductsResponse) => products.items.map((item) => {
                        item.image = this.cdnUrl + item.image;
                        return item
                    })
                )
    }

    createOrder(data: IOrder): Promise<IOrder> {
        return this.baseApi.post('/order', data)
                .then((res: IOrder) => res)
    }
}