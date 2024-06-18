
import { Api, ApiPostMethods } from "../components/base/api";
import { IEvents } from "../components/base/events";

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

export type TCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' |'хард-скил';

export interface IProductsData {
    items: IProduct[];
    preview: string | null;
    getProduct(productId: string): IProduct | undefined;
    getProducts(): IProduct[];
    setProducts(products: IProduct[]): void;
    setPreview(productId: string): void;
    getPreview(): string | null;
}

export interface ICartData {
    cartProducts: IProduct[];
    totalPrice: number;
    getItemBasketIndex(productId: string): number | undefined;
    addProduct(newProduct: IProduct): void;
    clear(): void;
    getNumberOfProducts(): number;
    getTotalPrice(): number;
    hasProduct(productId: string): boolean;
    removeProduct(productId: string): void;
    getProductsInCart(): IProduct[];
    validateTotalPrice(): boolean;
}

export interface IOrder {
    products: IProduct[];
    payment: TPayment | undefined;
    email: TEmail;
    phone: TPhone;
    address: string;
    totalPrice: number;
    error: string;
    // setProducts(products: IProduct[]): IProduct[];
    setPayment(payment: TPayment): void;
    setEmail(email: TEmail): void;
    setPhone(phone: TPhone): void;
    setAddress(address: string): void;
    setError(error: string): void;
    setTotalPrice(price: number): void;
    validateContacts(): boolean;
    validateAddress(): boolean;
}

export type TPayment = 'online' | 'offline';

export type TEmail = string;
export type TPhone = string;


export interface IWebLarekApi {
	baseApi: Api;
	getProducts(): Promise<IProduct[]>;
	getProduct(productId: string): Promise<IProduct>;
	createOrder(data: IOrder): Promise<IOrder>;
}




