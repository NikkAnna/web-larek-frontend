import './scss/styles.scss';

import { Api } from './components/base/api'
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { ProductsData } from './components/ProductsData';
import { CartData } from './components/CartData';
import { Order } from './components/Order'
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { ProductCard } from './components/ProductCard';
import { Modal } from './components/Modal';
import { ModalForm } from './components/ModalForm';
import { ModalSuccess } from './components/ModalSuccessOrder';
import { Cart } from './components/Cart'
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import { IProduct } from './types';

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

const products = new ProductsData(events);
const cartData = new CartData(events);
const orderData = new Order(events);

const page = new Page(document.body, events);


const modal = new Modal(modalElement, events);


larekApi.getProducts()
    .then((data) => {
        products.items = data
        events.emit('initialData:loaded');
    })
    .catch((err) => {
        console.error(err);
    });


events.on('initialData:loaded', () => {
    const productsArray = products.items.map((product) => {
        const cardCatalog = new ProductCard(cloneTemplate(cardCatalogTemplate), events);
        return cardCatalog.render(product);
    });

    page.render({ products: productsArray, numberOfProductsInCart: cartData.getNumberOfProducts()});
});

events.on('product:selected', (data: { product: ProductCard}) => {
    products.setPreview(data.product.id);
});

events.on('preview:changed', (data: {product: IProduct}) => {
    const productPreview = new ProductCard(cloneTemplate(cardPreviewTemplate), events);

    modal.render({ content: productPreview.render({
            category: data.product.category,
            title: data.product.title,
            description: data.product.description,
            image: data.product.image,
            price: data.product.price,
            id: data.product.id,
            isInCart: data.product.isInCart,
        })
    });

    modal.open();
});

events.on('productCartButton:changed', (data: { product: ProductCard }) => {
    const selectedProduct = products.getProduct(data.product.id)
    if (cartData.hasProduct(selectedProduct.id)) {
        cartData.removeProduct(selectedProduct.id)
        products.setIsInCart(selectedProduct.id, false);
    } else {
        cartData.addProduct(selectedProduct);
        products.setIsInCart(selectedProduct.id, true)
    }  
    events.emit('preview:changed', {product: selectedProduct});
});

events.on('deleteButton:selected', (data: { product: ProductCard }) => {
    const product = products.getProduct(data.product.id);
    cartData.removeProduct(product.id)
    products.setIsInCart(product.id, false);
 
    events.emit('cart:change');
});

events.on('cartProductsCounter:changed', () => {
    page.numberOfProductsInCart = cartData.getNumberOfProducts();
});

events.on('cart:change', () => {
    const cart = new Cart(cloneTemplate(basketTemplate), events);
    
    const cartProductsArray = cartData.cartProducts.map((product) => {
        const cartProductCatalog = new ProductCard(cloneTemplate(cardBasketTemplate), events);
        return cartProductCatalog.render({
            basketItemIndex: cartData.getItemBasketIndex(product.id),
            title: product.title,
            price: product.price,
            id: product.id
        });
    });

    modal.render({ content: cart.render({
            cartProducts: cartProductsArray,
            totalPrice: cartData.getTotalPrice(),
            allowOrder: cartData.validateTotalPrice(),
            })
        });

    modal.open();
});

const orderForm = new ModalForm(cloneTemplate(orderTemplate), events);
events.on('create order', () => {
    modal.render({ content: orderForm.render({
            address: '',
            error: '',
            valid: false,
            })
    
        });
    modal.open();
})

events.on('online:selected', () => {
    orderData.setPayment('online');
    orderData.validateOrder();
})

events.on('offline:selected', () => {
    orderData.setPayment('offline');
    orderData.validateOrder();
})

events.on('address:input', (data: { field: string, value: string }) => {
    orderData.setAddress(data.value);
    orderData.validateOrder();
});

const contactsForm = new ModalForm(cloneTemplate(contactsTemplate), events);
events.on('order:submit', () => {
    modal.render({ content: contactsForm.render({
        email: '',
        phone: '',
        error: '',
        valid: false,
        })

    });
    modal.open();
})

events.on('phone:input', (data: { field: string, value: string }) => {
    orderData.setPhone(data.value);
    orderData.validateContacts();
});

events.on('email:input', (data: { field: string, value: string }) => {
    orderData.setEmail(data.value);
    orderData.validateContacts();
});

events.on('orderFormValidity:changed', () => {
    orderForm.valid = orderData.valid;
    orderForm.error = orderData.error;
});

events.on('contactsFormValidity:changed', () => {
    contactsForm.valid = orderData.valid;
    contactsForm.error = orderData.error;
    console.log(cartData.getProductsInCart())
});

events.on('contacts:submit', () => {
    
    const productsForOrder = cartData.getProductsInCart().filter((product) => { 
        if (product.price) {
            return product
        }
    })
    orderData.setProducts(productsForOrder);
    orderData.setTotalPrice(cartData.getTotalPrice());
    larekApi.createOrder({
        items: orderData.order.items,
        payment: orderData.order.payment,
        email: orderData.order.email,
        phone: orderData.order.phone,
        address: orderData.order.address,
        total: orderData.order.total,
    })
    .then((res) => {
        events.emit('order:success')
    })
    .catch((err) => {
        console.log(err);
    })
})

events.on('order:success', () => {
    const success = new ModalSuccess(cloneTemplate(successTemplate), events);
    modal.render({ content: success.render({
        price: orderData.order.total,
        })
    });
    modal.open();

    products.items.forEach((product) => {
        product.isInCart = false
    })
    cartData.clear();
    page.numberOfProductsInCart = 0;

})

events.on('success:close', () => {
    modal.close();
})

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
    orderData.clear();
    orderForm.resetPaymentButton();
});


