import { ICartData, IProduct } from "../types";
import { IEvents } from "./base/events";


export class CartData implements ICartData {
    cartProducts: IProduct[];
    totalPrice: number;
    protected basketItemIndex: number;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.basketItemIndex = 0;
        this.cartProducts = [];
        this.totalPrice = 0;
        this.events = events;
    }


    getItemBasketIndex(productId: string) {
        const product = this.cartProducts.find((product) => product.id === productId);
        this.basketItemIndex = this.cartProducts.indexOf(product) + 1;
        return this.basketItemIndex;
    }

    addProduct(newProduct: IProduct): void {
        this.cartProducts.push(newProduct);
        this.events.emit('cartProductsCounter:changed');
    }

    removeProduct(productId: string): void {
        this.cartProducts = this.cartProducts.filter((product) => product.id !== productId)
        this.events.emit('cartProductsCounter:changed');
    }

    getProductsInCart(): IProduct[] {
        return this.cartProducts
    }

    getProductInCart(productId: string): IProduct {
        const product = this.cartProducts.find((product) => product.id === productId);
        return product
    }

    getNumberOfProducts(): number {
        return this.cartProducts.length
    }

    hasProduct(productId: string): boolean {
        const product = this.cartProducts.filter((product) => product.id === productId)
        if (product.length === 0) {
            return false;
            
        } else {
            return true
        }
    }

    getTotalPrice(): number {
        this.totalPrice = this.cartProducts.reduce(function(price, currentSum) {
            return price + currentSum.price
        }, 0)  
        return this.totalPrice
    }

    validateTotalPrice(): boolean {
        const totalPrice = this.getTotalPrice();
        
        if (totalPrice) {
            return true
        } else {
            return false
        }
    }

    clear(): void {
        this.cartProducts = [];
    }
}