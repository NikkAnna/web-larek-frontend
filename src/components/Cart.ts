import { Component } from './base/Components';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface ICart {
	cartProducts: HTMLElement[];
	totalPrice: number;
	allowOrder: boolean;
}

export class Cart extends Component<ICart> {
	protected _productsContainer: HTMLElement;
	protected _buttonCreateOrder: HTMLButtonElement;
	protected _totalPrice: HTMLSpanElement;
	protected _allowOrder: boolean;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this.events = events;
		this._productsContainer = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._buttonCreateOrder = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
		this._totalPrice = ensureElement<HTMLSpanElement>(
			'.basket__price',
			this.container
		);

		this._buttonCreateOrder.addEventListener('click', () => {
			this.events.emit('create order');
		});
	}

	set cartProducts(products: HTMLElement[]) {
		this._productsContainer.replaceChildren(...products);
	}

	set totalPrice(price: number) {
		this.setText(this._totalPrice, `${price} синапсов`);
	}

	set allowOrder(value: boolean) {
		this.setDisabled(this._buttonCreateOrder, !value);
	}
}