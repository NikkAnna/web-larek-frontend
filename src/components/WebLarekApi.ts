import { IOrder, IProduct, IWebLarekApi } from '../types';

import { Api } from './base/api';

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

	async getProduct(productId: string): Promise<IProduct> {
		const product = (await this.baseApi.get(
			`/product/${productId}`
		)) as IProduct;
		return product;
	}

	async getProducts(): Promise<IProduct[]> {
		const products = (await this.baseApi.get('/product/')) as IProductsResponse;
		return products.items.map((item) => {
			item.image = this.cdnUrl + item.image;
			return item;
		});
	}

	async createOrder(data: IOrder): Promise<IOrder> {
		const order = (await this.baseApi.post('/order', data)) as IOrder;
		return order;
	}
}
