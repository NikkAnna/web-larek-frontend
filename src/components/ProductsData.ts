import { IProduct, IProductsData } from '../types';

import { IEvents } from './base/events';

export class ProductsData implements IProductsData {
	protected items: IProduct[];
	protected preview: string | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this.preview = null;
	}

	setProducts(products: IProduct[]): void {
		this.items = products;
	}

	getProducts(): IProduct[] {
		return this.items;
	}

	getProduct(productId: string): IProduct | undefined {
		return this.items.find((product) => product.id === productId);
	}

	setPreview(productId: string): void {
		const selectedProduct = this.getProduct(productId);
		if (!selectedProduct) {
			this.preview = null;
			return;
		}

		this.preview = productId;
		this.events.emit('preview:changed', { product: selectedProduct });
	}

	getPreview(): string | null {
		return this.preview;
	}

	setIsInCart(productId: string, value: boolean): void {
		const selectedProduct = this.getProduct(productId);
		selectedProduct.isInCart = value;
	}
}