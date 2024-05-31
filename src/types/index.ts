
import { ApiPostMethods } from "../components/base/api";
import { IEvents } from "../components/base/events";

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IProductsData {
    items: IProduct[];
    preview: string | null;
    events: IEvents;
    getProduct(productId: string): IProduct;
}

export interface ICartData {
    products: IProduct[];
    events: IEvents;
    addProduct(product: IProduct): void;
    clear(): void;
    getNumberOfProducts(): number;
    getTotalPrice(): number;
    hasProduct(productId: string): boolean;
    removeProduct(productId: string): void;
}

export interface IOrder {
    products: IProduct[];
    payment: TPayment;
    email: TEmail;
    phone: TPhone;
    address: string;
    totalPrice: number;
    events: IEvents;
    error: string;
    checkPriceValidation(products: IProduct[]): boolean;
    checkAdress(data: Record<string, string>): boolean;
    checkPhone(data: Record<string, string>): boolean;
    checkMail(data: Record<string, string>): boolean;
}

export type TPayment = 'online' | 'offline';

type TEmail = string;
type TPhone = string;

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IWebLarekApi {
	baseApi: IApi;
	getProducts(): IProduct[];
	getProduct(productId: string): IProduct;
	createOrder(): void;
}

interface IComponent<T>{
    render(data?: Partial<T>): HTMLElement;
}




