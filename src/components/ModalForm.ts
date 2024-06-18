import { IOrder, TEmail, TPayment, TPhone } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Components';
import { IEvents } from './base/events';

export class ModalForm extends Component<IOrder> {
    protected onlinePaymentButton: HTMLButtonElement;
    protected offlinePaymentButton: HTMLButtonElement;
    protected form: HTMLFormElement;
    protected inputs: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected formError: HTMLSpanElement;
    protected events: IEvents;

    constructor(container: HTMLTemplateElement, events: IEvents) {
        super(container);

        this.events = events;
        this.form = ensureElement<HTMLFormElement>('.form', this.container);
        this.onlinePaymentButton = ensureElement<HTMLButtonElement>('[name="card"]', this.form);
        this.offlinePaymentButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.form);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.form);
        this.formError = ensureElement<HTMLSpanElement>('.form__errors', this.form);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.form.name}:submit`);
        });

        this.onlinePaymentButton.addEventListener('click', () => {
            this.onlinePaymentButton.classList.add('button_alt-active');
            this.offlinePaymentButton.classList.remove('button_alt-active')
            this.events.emit('online:selected');
        })

        this.offlinePaymentButton.addEventListener('click', () => {
            this.onlinePaymentButton.classList.remove('button_alt-active');
            this.offlinePaymentButton.classList.add('button_alt-active')
            this.events.emit('offline:selected');
        })
    }

    set address(address: string) {
        (this.form.elements.namedItem('address') as HTMLInputElement).value = address;
    }

    set email(email: TEmail) {
        (this.form.elements.namedItem('email') as HTMLInputElement).value = email;
    }

    set phone(phone: TPhone) {
        (this.form.elements.namedItem('phone') as HTMLInputElement).value = phone;
    }

    set error(error: string) {
        this.setText(this.formError, error);
    }

    protected onInputChange(field: string, value: string) {
        this.events.emit(`${this.form.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.setDisabled(this.submitButton, !value);
    }

    hideError() {
        this.setText(this.formError, '');
    }
}