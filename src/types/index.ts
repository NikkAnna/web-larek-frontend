//модель данных//

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
    //используем геттеры, чтобы получить эти данные// 
    getProduct(productId: string): Partial<IProduct>;
}

export interface ICartData {
    products: IProduct[];
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
    checkValidation(products: IProduct[]): boolean;
}

export type TPayment = 'online' | 'offline';

type TEmail = string;
type TPhone = string;

//api//

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}


export interface IWebLarekApi {
	baseApi: IApi;
	getProducts(): IProduct[];
	getProduct(): IProduct;
	sendOrder(): void;
}




//в бейз компонентс
interface IComponent<T>{
    render(data?: Partial<T>): HTMLElement;
}

export interface IPage {
    productsContainer: HTMLElement[];
    cart: HTMLElement;
    productsInCart: number;
}

//в коммон
export interface IModal<T> {
    modal: HTMLTemplateElement;
    events: IEvents;
    open(): void;
    close(): void;
}

//слой представления//

export interface IProductModal {
    product: {
        name: string;
        image: string;
        description: string;
        category: string;
        price: number;
    }
}

export interface IModalWithPaymentAndAdress {
    payment: string;
    validity: boolean;
	inputValues: Record<string, string>;
    inputError: Record<string, string>;
    showInputError(input: string, errorMessage: string): void;
    hideInputError(input: string): void;
    clearForm(): void;
}

export interface IModalFinal {
    price: number;
    
}

export interface IModalContacts {
    validity: boolean;
	inputValues: Record<string, string>;
    inputError: Record<string, string>;
    showInputError(input: string, errorMessage: string): void;
    hideInputError(input: string): void;
    clearForm(): void;
}


export interface ICart {
    productsContainer: HTMLElement[];
    totalPrice: number;
    validity: boolean;
}


//events

//productsInCartCount: add
//productsInCartCount: remove
//page: changed
//cart: open
//cart: close
//cart: clear
//cart: validation
//cart: productListChanded
//productDescription: open
//productDescription: close
//product: addToCart
//product: removeFromCart
//productModal: open
//productModal: close
//finalModal: open
//finalModal: close
//adressModal: open
//adressModal: close
//adressModal: validation
//contactsModal: open
//contactsModal: close
//contactsModal: validation
//inputName: input
//formName: submit




