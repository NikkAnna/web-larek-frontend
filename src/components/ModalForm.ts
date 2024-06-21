import { TEmail, TPhone } from '../types';

import { Component } from './base/Components';
import { IEvents } from './base/events';

interface IOrderForm {
	valid: boolean;
	error: string;
	address?: string;
	phone?: string;
	email?: string;
}

export class ModalForm extends Component<IOrderForm> {
	protected onlinePaymentButton?: HTMLButtonElement;
	protected offlinePaymentButton?: HTMLButtonElement;
	protected submitButton: HTMLButtonElement;
	protected formError: HTMLSpanElement;
	protected events: IEvents;
	protected formName: string;
	protected addressInput?: HTMLInputElement;
	protected phoneInput?: HTMLInputElement;
	protected emailInput?: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container);

		this.events = events;
		this.onlinePaymentButton = this.container.querySelector<HTMLButtonElement>('[name="card"]');
		this.offlinePaymentButton = this.container.querySelector<HTMLButtonElement>('[name="cash"]');
		this.submitButton = this.container.querySelector<HTMLButtonElement>('button[type=submit]');
		this.formError = this.container.querySelector<HTMLSpanElement>('.form__errors');
		this.formName = this.container.getAttribute('name');
		this.addressInput = this.container.querySelector<HTMLInputElement>('[name="address"]');
		this.phoneInput = this.container.querySelector<HTMLInputElement>('[name="phone"]');
		this.emailInput = this.container.querySelector<HTMLInputElement>('[name="email"]');

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${target.name}:input`, { field, value });
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.formName}:submit`);
		});

		if (this.onlinePaymentButton) {
			this.onlinePaymentButton.addEventListener('click', () => {
				this.onlinePaymentButton.classList.add('button_alt-active');
				this.offlinePaymentButton.classList.remove('button_alt-active');
				this.events.emit('online:selected');
			});
		}

		if (this.offlinePaymentButton) {
			this.offlinePaymentButton.addEventListener('click', () => {
				this.onlinePaymentButton.classList.remove('button_alt-active');
				this.offlinePaymentButton.classList.add('button_alt-active');
				this.events.emit('offline:selected');
			});
		}
	}

	set address(address: string) {
		this.addressInput.value = address;
	}

	set email(email: TEmail) {
		this.emailInput.value = email;
	}

	set phone(phone: TPhone) {
		this.phoneInput.value = phone;
	}

	set error(error: string) {
		this.setText(this.formError, error);
	}

	set valid(value: boolean) {
		this.setDisabled(this.submitButton, !value);
	}

	resetPaymentButton(): void {
		this.onlinePaymentButton.classList.remove('button_alt-active');
		this.onlinePaymentButton.classList.remove('button_alt-active');
	}

	render(state: Partial<IOrderForm>) {
		const { valid, error, ...inputs } = state;
		super.render({ valid, error });
		Object.assign(this, inputs);
		return this.container;
	}
}
