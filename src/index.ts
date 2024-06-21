import './scss/styles.scss';

import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Api } from './components/base/api';
import { Cart } from './components/Cart';
import { CartData } from './components/CartData';
import { EventEmitter } from './components/base/events';
import { IProduct } from './types';
import { Modal } from './components/Modal';
import { ModalForm } from './components/ModalForm';
import { ModalSuccess } from './components/ModalSuccessOrder';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { ProductCard } from './components/ProductCard';
import { ProductsData } from './components/ProductsData';
import { WebLarekApi } from './components/WebLarekApi';

const modalElement = ensureElement<HTMLElement>('#modal-container');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const api = new Api(API_URL, settings);
const larekApi = new WebLarekApi(api, CDN_URL);
const events = new EventEmitter();

const productsData = new ProductsData(events);
const cartData = new CartData(events);
const orderData = new Order(events);

const page = new Page(document.body, events);
const modal = new Modal(modalElement, events);

const orderForm = new ModalForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ModalForm(cloneTemplate(contactsTemplate), events);

larekApi
    .getProducts()
    .then((data) => {
        productsData.setProducts(data);
        events.emit('initialData:loaded');
    })
    .catch((err) => {
        console.error(err);
    });

events.on('initialData:loaded', () => {
    const products = productsData.getProducts().map((product) => {
        const cardCatalog = new ProductCard(
            cloneTemplate(cardCatalogTemplate),
            events
        );
        return cardCatalog.render(product);
    });

    page.render({
        products: products,
        numberOfProductsInCart: cartData.getNumberOfProducts(),
    });
});

events.on('product:selected', (data: { product: ProductCard }) => {
    productsData.setPreview(data.product.id);
});

events.on('preview:changed', (data: { product: IProduct }) => {
    const productPreview = new ProductCard(
        cloneTemplate(cardPreviewTemplate),
        events
    );

    modal.render({
        content: productPreview.render({
            category: data.product.category,
            title: data.product.title,
            description: data.product.description,
            image: data.product.image,
            price: data.product.price,
            id: data.product.id,
            isInCart: data.product.isInCart,
        }),
    });
});

events.on('productCartButton:changed', (data: { product: ProductCard }) => {
    const selectedProduct = productsData.getProduct(data.product.id);
    if (cartData.hasProduct(selectedProduct.id)) {
        cartData.removeProduct(selectedProduct.id);
        productsData.setIsInCart(selectedProduct.id, false);
    } else {
        cartData.addProduct(selectedProduct);
        productsData.setIsInCart(selectedProduct.id, true);
    }
    events.emit('preview:changed', { product: selectedProduct });
});

events.on('deleteButton:selected', (data: { product: ProductCard }) => {
    const product = productsData.getProduct(data.product.id);
    cartData.removeProduct(product.id);
    productsData.setIsInCart(product.id, false);

    events.emit('cart:change');
});

events.on('cartProductsCounter:changed', () => {
    page.numberOfProductsInCart = cartData.getNumberOfProducts();
});

events.on('cart:change', () => {
    const cart = new Cart(cloneTemplate(basketTemplate), events);

    const cartProductsCatalog = cartData.getProductsInCart().map((product) => {
        const cartProduct = new ProductCard(
            cloneTemplate(cardBasketTemplate),
            events
        );
        return cartProduct.render({
            basketItemIndex: cartData.getBasketItemIndex(product.id),
            title: product.title,
            price: product.price,
            id: product.id,
        });
    });

    modal.render({
        content: cart.render({
            cartProducts: cartProductsCatalog,
            totalPrice: cartData.getTotalPrice(),
            allowOrder: cartData.validateTotalPrice(),
        }),
    });
});

events.on('create order', () => {
    modal.render({
        content: orderForm.render({
            address: '',
            error: '',
            valid: false,
        }),
    });
});

events.on('online:selected', () => {
    orderData.setPayment('online');
    orderData.validateOrder();
});

events.on('offline:selected', () => {
    orderData.setPayment('offline');
    orderData.validateOrder();
});

events.on('address:input', (data: { field: string; value: string }) => {
    orderData.setAddress(data.value);
    orderData.validateOrder();
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            error: '',
            valid: false,
        }),
    });
});

events.on('phone:input', (data: { field: string; value: string }) => {
    orderData.setPhone(data.value);
    orderData.validateContacts();
});

events.on('email:input', (data: { field: string; value: string }) => {
    orderData.setEmail(data.value);
    orderData.validateContacts();
});

events.on('orderFormValidity:changed', () => {
    orderForm.valid = orderData.getValid();
    orderForm.error = orderData.getError();
});

events.on('contactsFormValidity:changed', () => {
    contactsForm.valid = orderData.getValid();
    contactsForm.error = orderData.getError();
});

events.on('contacts:submit', () => {
    const productsForOrder = cartData.getProductsInCart().filter((product) => {
        if (product.price) {
            return product;
        }
    });
    orderData.setProducts(productsForOrder);
    orderData.setTotalPrice(cartData.getTotalPrice());
    const order = orderData.getOrder();
    larekApi
        .createOrder({
            items: order.items,
            payment: order.payment,
            email: order.email,
            phone: order.phone,
            address: order.address,
            total: order.total,
        })
        .then(() => {
            events.emit('order:success');
        })
        .catch((err) => {
            console.error(err);
        });
});

events.on('order:success', () => {
    const modalSuccess = new ModalSuccess(cloneTemplate(successTemplate), events);
    modal.render({
        content: modalSuccess.render({
            price: orderData.getOrder().total,
        }),
    });

    productsData.getProducts().forEach((product) => {
        product.isInCart = false;
    });
    cartData.clear();
    page.numberOfProductsInCart = 0;
});

events.on('modalSuccess:close', () => {
    modal.close();
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
    orderData.clear();
    orderForm.resetPaymentButton();
});