# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

Код приложения разделен на три слоя, основываясь на парадигме MVP: 
- слой данных, отвечает за все манипуляции с данными (хранение, изменение, преобразование)
- слой отображения, отвечает все за отображение всех элементов, которые видит пользователь на странице 
- брокер событий - является связующим звеном между слоем модели данных и слоем отображения.

### Базовый код

#### Класс Api
Содержит базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос, методу также необходимо передать эндпоинт запроса. Метод возвращает промис с объектом, переданным от сервера
- `post` - принимает объект с данными переданными в формате JSON в теле запроса, методу также необходимо передать эндпоинт запроса для отправки на сервер. По умолчанию выполняется `POST` запрос, метод запроса также можно переопределить - передать необходимый метод запроса в параметры.

#### Класс EventEmitter
Брокер событий связывает слой модели данных и слой отображения, позволяет самостоятельно генерировать события и подписываться на них. Класс реализуется в презентере для обработки событий.  
Основные методы:
- `on` - установка обработчика на события
- `emit` - инициализация события с данными
- `trigger` - создает функцию коллбек, которая генерирует событие при вызове

#### Класс Component
Абстрактный базовый класс для всех элементов слоя представления. Имеет метод render, который генерирует или обновляет необходимый компонент разметки, методы для присвоения текстового содержимого, изображения элементу, смены состояния элемента.

```
interface IComponent<T>{
    render(data?: Partial<T>): HTMLElement;
    setText(element: HTMLElement, value: unknown): void;
    setImage(element: HTMLImageElement, src: string, alt?: string): void;
    setDisabled(element: HTMLElement, state: boolean): void;
}
```

### Модель данных

#### Класс ProductsData
Класс отвечает за хранение и работу с данными карточки товара.   
В полях класса хранится массив объектов товаров, id товара, выбранного для просмотра в модальном окне (preview) и экземпляр класса `EventEmitter` для инициации событий при изменении данных.  
Класс имеет методы: получение карточки товара по ее id, получение массива товаров, установка превью для карточки по ее id, определение массива товаров

```
export interface IProductsData {
    items: IProduct[];
    preview: string | null;
    getProduct(productId: string): IProduct;
    getProducts(): IProduct[] | undefined;
    setProducts(products: IProduct[]): void;
    setPreview(productId: string): void;
    getPreview(): string | null;
}
```

#### Класс CartData
Класс отвечает за хранение данных в корзине и логику работы с этими данными.   
В полях класса - массив объектов товаров, экземпляр класса `EventEmitter`. Класс имеет методы работы с данными: добавление продукта в корзину, зачистка корзины, получение количества товаров в корзине, подсчет стоимости товаров в корзине, проверка наличия товара в корзине, удаление товара из корзины, получение массива товаров, находящихся в корзине. Класс имеет метод проверки валидации корзины - если в корзине находится только бесценный товар (стоимость заказа равна нулю), то дальнейшее оформление заказа невозможно.

```
export interface ICartData {
    cartProducts: IProduct[];
    totalPrice: number;
    getItemBasketIndex(productId: string): number | undefined;
    addProduct(product: IProduct): void;
    removeProduct(productId: string): void;
    getProductsInCart(): IProduct[];
    getNumberOfProducts(): number;
    hasProduct(productId: string): boolean;
    getTotalPrice(): number;
    clear(): void;
    validateTotalPrice(): boolean;
}
```

#### Класс Order
Класс отвечает за хранение и работу с данными товаров в корзине и данными пользователя, которые необходимо для отправки заказа на сервер.
Также класс может валидировать корректность введенных данных покупателя.

```
export interface IOrder {
    products: [];
    payment: TPayment;
    email: TEmail;
    phone: TPhone;
    address: string;
    totalPrice: number;
    error: string;
    setProducts(products: IProduct[]): void;
    setPayment(data: TPayment): void;
    setEmail(data: TEmail): void;
    setPhone(data: TPhone): void;
    setAddress(data: string): void;
    setError(data: string): void;
    setTotalPrice(data: number): void;
    validateContacts(): boolean;
    validateAddress(): boolean;
}
```

#### Используемые типы данных

```
export type TPayment = 'online' | 'offline';

type TEmail = string;
type TPhone = string;
```


### Слой отображения

#### Класс Page
Класс  отвечает за отображение главной страницы сервиса. В конструктор класса передается DOM элемент контейнера главной страницы.  
В полях класса находятся все элементы главной страницы. Также класс имеет метод render, унаследованный от класса Component.  
  
Поля класса: 
- products: HTMLElement;
- numberOfProductsInCart: HTMLElement;
- events: IEvents;
- cartButton: HTMLElement;


#### Класс Modal
Класс модального окна, реализует отображение всех модальных окон в проекте, отображает модальные окна с разным содержимым. Содержит методы открытия и закрытия модального окна. В конструктор принимает DOM элемент модального окна и экземпляр класса `EventEmitter`.
Класс также имеет метод render, наследованный от класса Component.  
  
Поля класса:
- modal: HTMLElement;
- events: IEvents;
- closeModalButton: HTMLButtonElement;
  
Методы класса:
- open(): void;
- close(): void - в этом методе также происходит очистка содержимого, которое показывалось в контейнере Modal


#### Класс ProductCard
Класс отвечает за отображение карточки. В конструктор класса передается DOM элемент темплейта карточки, что позволяет формировать карточки разных вариантов верстки (на главной странице, в модальном окне, в корзине). В конструкторе класса определяются все DOM элементы, необходимые для отрисовки карточек товаров, устанавливаются слушатели на все интерактивные элементы, при взаимодействии с этими слушателями будут генерироваться соответствующие события.
Класс также имеет метод render, наследованный от класса Component.

Поля класса:
- name: HTMLElement
- image: HTMLImageElement
- category: HTMLSpanElement
- description: HTMLParagraphElement
- price: HTMLSpanElement
- id: string
- basketItemIndex: HTMLSpanElement
- addToCartButton: HTMLButtonElement
- deleteButton: HTMLButtonElement
- galleryCardButton: HTMLButtonElement
- events: IEvents


#### Класс Cart
Класс предназначен для отображения контента модального окна с корзиной. В конструктор принимает DOM элемент темплейта модального окна и экземпляр класса `EventEmitter`. В конструкторе класса определяются DOM элементы, необходимые для отрисовки корзины, устанавливаются слушатель на кнопку оформления заказа, но только после проверки общей стоимости товаров. Если стоимость товаров равна нулю, кнопка оформления заказа неактивна.
Класс также имеет метод render, наследованный от класса Component.

Поля класса:
- productsContainer: HTMLElement[]
- buttonCreateOrder: HTMLButtonElement
- totalPrice: number
<!-- - allowOrder: boolean -->
- events: IEvents


#### Класс ModalForm
Класс предназначен для отображения контента модальных окон с формами (адрес, контакты покуапателя). В конструктор принимает DOM элемент темплейта модального окна, что дает возможность отрисовывать различные варианты модальных окон с формами, и экземпляр класса `EventEmitter`.  
В конструкторе класса определяются DOM элементы, необходимые для отрисовки модального окна, также класс имеет методы: установки валидации формы для корректного отображения кнопки оформления заказа, показа ошибок валидации, изменения состояния кнопок способа оплаты (нал/ безнал).
Класс также имеет метод render, наследованный от класса Component.

Поля класса:
- onlinePaymentButton: HTMLButtonElement
- offlinePaymentButton: HTMLButtonElement
- form: HTMLFormElement
- submitButton: HTMLButtonElement
- formError: HTMLSpanElement
- events: IEvents;
  
Методы класса:
- setValidity(): void
- showError(errorMessage: string): void
- hideError(): void


#### Класс ModalSuccess
Класс предназначен для отображения модального окна с надписью успешного оформления заказа и стоимостью заказа. Данный класс расширяет класс Modal. В конструктор принимает DOM элемент темплейта модального окна и экземпляр класса `EventEmitter`.  
В конструкторе класса определяется DOM элемент, необходимый для отображения итоговой стоимости заказа.  
Класс также имеет метод render, наследованный от класса Component.

Поля класса:
- price: number;
- events: IEvents;
- buttonCloseSuccessModal: HTMLButtonElement;


### Слой коммуникации

#### Класс WebLarekApi
Принимает в конструктор экземпляр класса Api (интерфейс IApi) и предоставляет методы, которые реализуют взаимодействие с сервером.

```

export interface IWebLarekApi {
	baseApi: Api;
	getProducts(): Promise<IProduct[]>;
	getProduct(productId: string): Promise<IProduct>;
	createOrder(data: IOrder): Promise<IOrder>;
}

```

## Взаимодействие компонентов

*Список всех событий, которые могут генерироваться в системе:*  

- `initialData: loaded` - получаем данные с сервера при загрузке главной страницы, отрисовываем их с помощью класса отображения Page
- `product: selected` - при клике на карточку передает в модель данных объект карточки, на которую кликнули
- `preview: changed` - передает данные товара из модели в отображение для отрисовки превью переданной карточки
- `cart: addProduct` - при клике на кнопку "добавить в корзину" передает в модель данных объект карточки, на которую кликнули
- `cart: removeProduct` - при клике на кнопку "удалить из корзины" передает в модель данных объект карточки, на которую кликнули
- `product: inСart` - модель данных передает в отображение карточку, которая добавлена в корзину, в превью этой карточки меняется отображение кнопки добавления в корзину
- `cart: changed` - перерендеривается список товаров в корзине, на главное странице увеличивается/ уменьшается счетчик товаров в корзине
- `cart: selected` - при нажатии на кнопку корзины получаем из модели данных список товаров в корзине и отображаем модалку с корзиной
- `create order` - при клике на кнопку "оформить заказ" в модель передаются данные продуктов из корзины и их цена
- `productsInOrder: completed` - после передачи товаров в корзине в модель, вызываем этот обработчик для отрисовки модалки с формой адреса и способа оплаты заказа
- `orderForm: changed` - обработчик реагирует на изменение данных в форме и передает информацию в модель
- `orderForm: validated` - после валидации данных в модели, передаем информацию в отображение, разблокируем кнопку перехода "далее"
- `goToContacts` - при клике на кнопку "далее" в форме с вводом адреса и способа оплаты, передаем данные из формы в модель
- `orderForm: completed` - после передачи данных пользователя в модель, вызываем этот обработчик для отрисовки модалки с контактной информацией покупателя
- `contactsForm: changed` - обработчик реагирует на изменение данных в форме с контактами и передает информацию в модель
- `contactsForm: validated` - после валидации данных в модели, передаем информацию в отображение, разблокируем кнопку покупки товаров
- `contactsForm: completed` - при клике на кнопку "оплатить" передаем данные пользователя в модель данных, отправляем заказ на сервер
- `order: success` - при успешной отправке заказа на сервер, передаем в отображение отрисовку модального окна успешного заказа с итоговой стоимостью заказа
- `modal:open`
- `modal:close`
- `online:selected`
- `offline:selected`