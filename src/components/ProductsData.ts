import { IProduct, IProductsData } from "../types";
import { IEvents } from "./base/events";


export class ProductsData implements IProductsData {
    items: IProduct[];
    preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setProducts(products: IProduct[]): void {
        this.items = products;
    }

    getProducts(): IProduct[] {
        return this.items;
    }

    getProduct(productId: string): IProduct | undefined {
        return this.items.find((product) => product.id === productId)
    }

    setPreview(productId: string): void {
        if (!productId) {
            this.preview = null;
            return;
        }

        const selectedProduct = this.getProduct(productId);
        if (selectedProduct) {
            this.preview = productId;
            this.events.emit('preview:changed', { product: selectedProduct});
        }
    }

    getPreview(): string | null {
        return this.preview;
    }

    setIsInCart(productId: string, value: boolean) {
        const selectedProduct = this.getProduct(productId);
        selectedProduct.isInCart = value;
    }
}
