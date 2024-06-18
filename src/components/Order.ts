import { IOrder, IProduct, TEmail, TPayment, TPhone } from "../types";
import { IEvents } from "./base/events";


export class Order implements IOrder {
    products: IProduct[];
    payment: TPayment;
    email: TEmail;
    phone: TPhone;
    address: string;
    totalPrice: number;
    error: string;
    valid: boolean;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    setEmail(email: string): void {
        this.email = email;
    }
    
    setPhone(phone: string): void {
        this.phone = phone;
    }

    setPayment(payment: TPayment): void {
        this.payment = payment;
    }

    setTotalPrice(price: number): void {
        this.totalPrice = price;
    }

    setError(error: string): void {
        this.error = error;
    }

    validateAddress(): boolean {
        if (!this.address) {
            this.setError('Необходимо указать адрес');
            return false
        } else {
            this.events.emit('orderForm:validated');
            return true
        }
    }

    validateContacts(): boolean {
        if (!this.email || !this.phone) {
            this.setError('Необходимо заполнить все данные');
            return false
        } else {
            this.events.emit('contactsForm:validated');
            return true
        }
    }
}