import { Component } from './base/Components';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
	products: HTMLElement[];
	numberOfProductsInCart: number;
	locked: boolean;
}

export class Page extends Component<IPage> implements IPage {
	protected productsContainer: HTMLElement;
	protected productsInCart: HTMLElement;
	protected cartButton: HTMLElement;
	protected wrapper: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.productsContainer = ensureElement<HTMLElement>(
			'.gallery',
			this.container
		);
		this.productsInCart = ensureElement<HTMLElement>(
			'.header__basket-counter',
			this.container
		);
		this.wrapper = ensureElement<HTMLElement>('.page__wrapper', this.container);
		this.cartButton = ensureElement<HTMLElement>(
			'.header__basket',
			this.container
		);
		this.events = events;

		this.cartButton.addEventListener('click', () => {
			this.events.emit('cart:change');
		});
	}

	set products(items: HTMLElement[]) {
		this.productsContainer.replaceChildren(...items);
	}

	set numberOfProductsInCart(value: number) {
		this.setText(this.productsInCart, value);
	}

	set locked(value: boolean) {
		if (value) {
			this.wrapper.classList.add('page__wrapper_locked');
		} else {
			this.wrapper.classList.remove('page__wrapper_locked');
		}
	}
}