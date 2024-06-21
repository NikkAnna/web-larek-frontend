import { Component } from './base/Components';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IModalSuccess {
	price: number;
}

export class ModalSuccess extends Component<IModalSuccess> {
	protected _price: HTMLParagraphElement;
	protected events: IEvents;
	protected buttonCloseSuccessModal: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._price = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);
		this.buttonCloseSuccessModal = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this.buttonCloseSuccessModal.addEventListener('click', () => {
			this.events.emit('modalSuccess:close');
		});
	}

	set price(price: number) {
		this.setText(this._price, `Списано ${price} синапсов`);
	}
}