import {
	IOrder,
	IOrderData,
	IProduct,
	TEmail,
	TPayment,
	TPhone,
} from '../types';

import { IEvents } from './base/events';

export class Order implements IOrderData {
	protected order: IOrder = {
		items: [],
		payment: undefined,
		email: undefined,
		phone: undefined,
		address: '',
		total: 0,
	};
	protected error: string;
	protected valid: boolean;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	setProducts(data: IProduct[]) {
		const productsIdArray = data.map((product) => {
			return product.id;
		});
		this.order.items = productsIdArray;
	}

	getOrder(): IOrder {
		return this.order;
	}

	setAddress(address: string): void {
		this.order.address = address;
	}

	setEmail(email: TEmail): void {
		this.order.email = email;
	}

	setPhone(phone: TPhone): void {
		this.order.phone = phone;
	}

	setPayment(payment: TPayment): void {
		this.order.payment = payment;
	}

	setTotalPrice(price: number): void {
		this.order.total = price;
	}

	setError(error: string): void {
		this.error = error;
	}

	getError(): string {
		return this.error;
	}

	setValid(valid: boolean): void {
		this.valid = valid;
	}

	getValid(): boolean {
		return this.valid;
	}

	validateOrder(): void {
		this.setValid(!this.order.address || !this.order.payment ? false : true);
		this.setError(
			this.valid ? '' : 'Необходимо указать адрес и выбрать способ оплаты'
		);
		this.events.emit('orderFormValidity:changed');
	}

	validateContacts(): void {
		this.setValid(!this.order.email || !this.order.phone ? false : true);
		this.setError(
			this.valid ? '' : 'Проверьте корректность почтового адреса и телефона'
		);
		this.events.emit('contactsFormValidity:changed');
	}

	clear(): void {
		this.order = {
			items: [],
			payment: undefined,
			email: undefined,
			phone: undefined,
			address: '',
			total: 0,
		};
	}
}