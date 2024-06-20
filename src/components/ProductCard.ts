// import { ensureElement } from '../utils/utils';
import { Component } from './base/Components';
import { IEvents } from './base/events';
import {  IProduct, TCategory } from '../types/index'

export class ProductCard extends Component<IProduct> {
    protected _name: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category: HTMLSpanElement;
    protected _description?: HTMLParagraphElement;
    protected _price: HTMLSpanElement;
    protected _basketItemIndex?: HTMLSpanElement;
    protected productId: string;
    protected addToCartButton?: HTMLButtonElement;
    protected deleteButton?: HTMLButtonElement;
    protected galleryCardButton: HTMLButtonElement;
    protected events: IEvents;
    protected _isInCart: boolean;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this._name = this.container.querySelector('.card__title');
        this._image = this.container.querySelector('.card__image');
        this._category = this.container.querySelector('.card__category');
        this._description = this.container.querySelector('.card__text');
        this._price = this.container.querySelector('.card__price');
        this._basketItemIndex = this.container.querySelector('.basket__item-index');
        this.addToCartButton = this.container.querySelector('.add__button');
        this.deleteButton = this.container.querySelector('.basket__item-delete');
        
        if (this.container.classList.contains('gallery__item')) {
            this.container.addEventListener('click', () => {
                this.events.emit('product:selected', { product: this })
            })
        }

        if (this.addToCartButton) {
            this.addToCartButton.addEventListener('click', () => {
                this.events.emit('productCartButton:changed', { product: this })
            })
        }

        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', () => {
                this.events.emit('deleteButton:selected', { product: this })
            })
        }
    }

    set title(name: string) {
        this.setText(this._name, name);
    }

    set image(image: string) {
        this._image.src = image;
        this._image.alt = this._name.textContent || '';
    }

    set category(category: TCategory) {
        this.setText(this._category, category); 

        if (category === 'софт-скил') {
            this._category.classList.add('card__category_soft')
        }

        if (category === 'другое') {
            this._category.classList.add('card__category_other');
        }

        if (category === 'дополнительное') {
            this._category.classList.add('card__category_additional');
        }

        if (category === 'кнопка') {
            this._category.classList.add('card__category_button');
        }

        if (category === 'хард-скил') {
            this._category.classList.add('card__category_hard');
        }
    }

    set description(description: string) {
        this.setText(this._description, description);
    }

    set price(price: number | null) {
        this.setText(this._price, `${price} синапсов`);

        if (!price) {
            this.setText(this._price, 'Бесценно');
        }
    }

    set basketItemIndex(index: number) {
        this.setText(this._basketItemIndex, index);
    }

    set id(id: string) {
		this.productId = id;
	}

	get id() {
		return this.productId;
	}

    set isInCart(value: boolean) {
        this._isInCart = value;
        if (this._isInCart) {
            this.setText(this.addToCartButton,'Убрать из корзины');
        } else {
            this.setText(this.addToCartButton, 'В корзину');
        }
    }
}