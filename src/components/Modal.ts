import { Component } from "./base/Components";
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeModalButton: HTMLButtonElement;
    protected modal: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.closeModalButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modal = ensureElement<HTMLElement>('.modal__content', this.container);

        this.closeModalButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.modal.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this.modal.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: IModal): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}