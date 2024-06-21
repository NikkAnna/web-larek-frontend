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
	order: IOrder = {
		items: [],
		payment: undefined,
		email: undefined,
		phone: undefined,
		address: '',
		total: 0,
	};
	error: string;
	valid: boolean;
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

	validateOrder(): void {
		this.valid = !this.order.address || !this.order.payment ? false : true;
		this.setError(
			this.valid ? '' : 'Необходимо указать адрес и выбрать способ оплаты'
		);
		this.events.emit('orderFormValidity:changed');
	}

	validateContacts(): void {
		this.valid = !this.order.email || !this.order.phone ? false : true;
		this.setError(
			this.valid ? '' : 'Проверьте корректность почтового адреса и телефона'
		);
		this.events.emit('contactsFormValidity:changed');
	}

	clear() {
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