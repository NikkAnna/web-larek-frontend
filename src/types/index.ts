import { Api } from '../components/base/api';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number | null;
	basketItemIndex: number;
	isInCart: boolean;
}

export type TCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface IProductsData {
	getProduct(productId: string): IProduct | undefined;
	getProducts(): IProduct[];
	setProducts(products: IProduct[]): void;
	setPreview(productId: string): void;
	getPreview(): string | null;
}

export interface ICartData {
	getProductsInCart(): IProduct[];
	getProductInCart(productId: string): IProduct;
	getBasketItemIndex(productId: string): number | undefined;
	addProduct(newProduct: IProduct): void;
	clear(): void;
	getNumberOfProducts(): number;
	getTotalPrice(): number;
	hasProduct(productId: string): boolean;
	removeProduct(productId: string): void;
	validateTotalPrice(): boolean;
}

export interface IOrder {
	items: string[];
	payment: TPayment;
	email: TEmail;
	phone: TPhone;
	address: string;
	total: number;
}

export interface IOrderData {
	getOrder(): IOrder;
	setProducts(data: IProduct[]): void;
	setPayment(payment: TPayment): void;
	setEmail(email: TEmail): void;
	setPhone(phone: TPhone): void;
	setAddress(address: string): void;
	setError(error: string): void;
	setValid(valid: boolean): void;
	setTotalPrice(price: number): void;
	validateContacts(): void;
	validateOrder(): void;
}

export type TPayment = 'online' | 'offline' | undefined;

export type TEmail = string;
export type TPhone = string;

export interface IWebLarekApi {
	baseApi: Api;
	getProducts(): Promise<IProduct[]>;
	getProduct(productId: string): Promise<IProduct>;
	createOrder(data: IOrder): Promise<IOrder>;
}
