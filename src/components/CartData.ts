import { ICartData, IProduct } from '../types';

import { IEvents } from './base/events';

export class CartData implements ICartData {
	protected cartProducts: IProduct[];
	protected totalPrice: number;
	protected basketItemIndex: number;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.basketItemIndex = 0;
		this.cartProducts = [];
		this.totalPrice = 0;
		this.events = events;
	}

	getBasketItemIndex(productId: string): number {
		return (this.basketItemIndex =
			this.cartProducts.findIndex((product) => product.id === productId) + 1);
	}

	addProduct(newProduct: IProduct): void {
		this.cartProducts.push(newProduct);
		this.events.emit('cartProductsCounter:changed');
	}

	removeProduct(productId: string): void {
		this.cartProducts = this.cartProducts.filter(
			(product) => product.id !== productId
		);
		this.events.emit('cartProductsCounter:changed');
	}

	getProductsInCart(): IProduct[] {
		return this.cartProducts
	}
	
	getProductInCart(productId: string): IProduct {
		const product = this.cartProducts.find(
			(product) => product.id === productId
		);
		return product;
	}

	getNumberOfProducts(): number {
		return this.cartProducts.length;
	}

	hasProduct(productId: string): boolean {
		const product = this.cartProducts.filter(
			(product) => product.id === productId
		);
		return product.length !== 0;
	}

	getTotalPrice(): number {
		this.totalPrice = this.cartProducts.reduce(function (price, currentSum) {
			return price + currentSum.price;
		}, 0);
		return this.totalPrice;
	}

	validateTotalPrice(): boolean {
		const totalPrice = this.getTotalPrice();
		return Boolean(totalPrice);
	}

	clear(): void {
		this.cartProducts.length = 0;
	}
}