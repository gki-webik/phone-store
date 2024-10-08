const close_btn = document.querySelector(".close_btn");
const open_btn = document.querySelector(".open_btn");
const header__menu = document.querySelector(".header__menu");
const menu_mask = document.querySelector(".menu_mask");
const header__menu_right_basket = document.querySelectorAll(".header__menu_right_basket");
const basket_modal = document.querySelector(".basket_modal");
const basket_modal__cards__close_btn = document.querySelectorAll(".basket_modal__cards__close_btn");
const basket_item_box = document.querySelector(".basket_item_box");
const basket_plusCount = document.querySelectorAll(".basket_plusCount");
const block_3__main_cards = document.querySelector(".block_3__main_cards");
const checkbox_filter = document.querySelectorAll('.checkbox_filter');
const checkbox_filter_model = document.querySelectorAll('.checkbox_filter_model');
const label_filter_checkbox = document.querySelectorAll('.label_filter_checkbox');
const filter_checkbox = document.querySelectorAll('.filter_checkbox');

let wk_basket = JSON.parse(localStorage.getItem("wk_basket")) || [];

/* Закрытие/Открытие меню */
close_btn.addEventListener("click", () => {
    header__menu.classList.toggle("is-active");
    menu_mask.classList.toggle("is-active");
});
open_btn.addEventListener("click", () => {
    header__menu.classList.toggle("is-active");
    menu_mask.classList.toggle("is-active");
});

/* Всем кнопкам на товары, что в корзине, кнопка Удалить из корзины */
document.addEventListener("DOMContentLoaded", () => {
    const basket_items = document.querySelectorAll(".block_3__main_cards_item");
    basket_items.forEach((e) => {
        if (wk_basket.some(item => Number(e.dataset.id) === item.id)) {
            e.querySelector(".button_basket").textContent = "Удалить";
        }
    });
});

/* Поиск индекса элемента */
function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i][key] == valuetosearch) {
            return i;
        }
    }
    return null;
}

/* Обновление счета товаров у корзины (иконки в меню) */
let newStyle = document.createElement("style");
function updCountBasket(props) {
    if (props == "minus") {
        wk_basketLength -= 1;
    } else if (props == "plus") {
        wk_basketLength += 1
    } else {
        wk_basketLength = wk_basket.length
    }
    newStyle.innerHTML = `.header__menu_right_basket::after {content: "${wk_basketLength}" !important;}`;
    document.head.appendChild(newStyle);
}
updCountBasket();

/* Добавить/Удалить товар  */
document.addEventListener("DOMContentLoaded", () => {
    const button_basket = document.querySelectorAll(".button_basket");
    button_basket.forEach((e) => {
        e.addEventListener("click", () => {
            const bsItemParentNode = e.parentNode.parentNode.parentNode.parentNode;
            const idProduct = Number(bsItemParentNode.dataset.id);
            bsItemParentNode.querySelector(".button_basket").textContent = "Удалить";

            if (wk_basket.some(item => idProduct === item.id)) {
                updCountBasket("minus");
                bsItemParentNode.querySelector(".button_basket").textContent = "В корзину";
                wk_basket.splice(functiontofindIndexByKeyValue(wk_basket, "id", idProduct), 1);
                localStorage.setItem("wk_basket", JSON.stringify(wk_basket));
                return;
            }
            const wk_basket_newObj = {
                id: idProduct,
                count: 1,
                title: bsItemParentNode.querySelector(".block_3__main_cards_item__center_title").textContent,
                price: bsItemParentNode.querySelector(".block_3__main_cards_item__bottom_2__price").textContent,
                img: bsItemParentNode.querySelector(".block_3__main_cards_item__img > img").src,
            };
            wk_basket.push(wk_basket_newObj);
            localStorage.setItem("wk_basket", JSON.stringify(wk_basket));
            updCountBasket();
        });
    });
});

/* Отображение товаров в корзине */
function wk_basket_update() {
    if (localStorage.getItem("wk_basket")) {
        if (wk_basket.length != 0) {
            basket_item_box.innerHTML = ``;
            let resultPrice = 0;
            let resultCount = 0;
            let resultCountAll = 0;
            wk_basket.forEach((i) => {
                resultCountAll += i.count;
                resultPrice += Number(i.price.replaceAll("$", "")) * i.count;
                basket_item_box.innerHTML += `<div class="basket_modal__item" data-id="${i.id}"><div class="basket_modal__item_img"><img src="${i.img}" alt=""></div><div class="basket_modal__item_content"><div class="basket_modal__item_title">${i.title}</div><div class="basket_modal__item_btn"><div class="basket_modal__item_count"><span onclick="basketCount(${i.id}, 'minus')">-</span><span>${i.count}</span><span onclick="basketCount(${i.id}, 'plus')">+</span></div><div class="basket_modal__item_price">${Number(i.price.replaceAll("$", "")) * i.count}$</div><div class="basket_modal__item_delete" onclick="basketCount(${i.id}, 'delete')">×</div></div></div></div>`;
            });
            resultCount += wk_basket.length
            basket_item_box.innerHTML += `<div class="basket_modal__item result"><div><b>Товаров</b>: ${resultCount}</div><div><b>Товаров (вкл. шт.)</b>: ${resultCountAll}</div><div><b>Итоговая цена</b>: ${resultPrice}$</div><button>Оформить</button></div>`;
            return;
        }
    }
    basket_item_box.innerHTML = `
    <div class="basket_modal__item">
      Вы еще не добавили товаров в корзину
    </div>
    `;
}

/* Модалка корзины */
header__menu_right_basket.forEach((e) => {
    e.addEventListener("click", () => {
        basket_modal.classList.add("is-active");
        wk_basket_update();
    });
});
basket_modal__cards__close_btn.forEach((e) => {
    e.addEventListener("click", () => {
        basket_modal.classList.remove("is-active");
        wk_basket_update();
    });
})

/* +, - и удаление в Корзине */
function basketCount(propsId, propsAction) {
    const indexCount = functiontofindIndexByKeyValue(wk_basket, "id", propsId);
    if (indexCount != null) {
        if (propsAction == "plus") {
            wk_basket[indexCount].count += 1
        } else if (propsAction == "minus") {
            wk_basket[indexCount].count != 1 ? wk_basket[indexCount].count -= 1 : null;
        } else if (propsAction == "delete") {
            wk_basket.splice(indexCount, 1);
        }
        localStorage.setItem("wk_basket", JSON.stringify(wk_basket));
        wk_basket_update();
        updCountBasket();
    } else {
        console.error("В корзине не найден товар с таким ID");
    }
}

/* Товары */
let arrProduct = [
    {
        id: 1,
        title: 'Apple IPhone 11',
        img: './assets/images/phone4.png',
        price: 169,
        model: 'apple',
        color: 'white'
    },
    {
        id: 2,
        title: 'Samsung IPhone 11',
        img: './assets/images/phone4.png',
        price: 230,
        model: 'samsung',
        color: 'black'
    },
    {
        id: 3,
        title: 'Xiomi IPhone 11',
        img: './assets/images/phone4.png',
        price: 395,
        model: 'xiomi',
        color: 'violet'
    }
];
function outputProducts(props) {
    block_3__main_cards.innerHTML = "";
    props.forEach((item) => {
        block_3__main_cards.innerHTML += `<div class="block_3__main_cards_item" data-id="${item.id}" data-test="ffef" data-model="${item.model}" data-color="${item.color}"><div class="block_3__main_cards_item__img"><img src="${item.img}" alt=""></div><div class="block_3__main_cards_item__center"><div class="block_3__main_cards_item__center_title">${item.title}</div><div class="block_3__main_cards_item__center_color"><span class="block_3__main_cards_item__center_color_1"></span><span class="block_3__main_cards_item__center_color_2"></span><span class="block_3__main_cards_item__center_color_3"></span></div></div><div class="block_3__main_cards_item__bottom"><div class="block_3__main_cards_item__bottom_1"><div class="block_3__main_cards_item__bottom_1__button"><button class="button_basket">В корзину</button></div><div class="block_3__main_cards_item__bottom_1__other">Подробнее</div></div><div class="block_3__main_cards_item__bottom_2__price">${item.price}$</div></div></div>`;
    });

}
outputProducts(arrProduct);

/* Фильтры *//* 
document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.checkbox_filter[data-type="model"]');
    const products = document.querySelectorAll('.block_3__main_cards_item');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            filterProducts();
        });
    });

    function filterProducts() {
        const selectedBrands = [...checkboxes]
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        products.forEach(product => {
            const productBrand = product.getAttribute('data-model');
            if (selectedBrands.length === 0 || selectedBrands.includes(productBrand)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    filterProducts();
}); */

document.addEventListener('DOMContentLoaded', function () {
    const filterContainers = document.querySelectorAll('.block_3__main_filter_item');

    filterContainers.forEach(container => {
        const checkboxes = container.querySelectorAll('.checkbox_filter');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                filterProducts();
            });
        });
    });

    function filterProducts() {
        const products = document.querySelectorAll('.block_3__main_cards_item');
        const filters = {};

        filterContainers.forEach(container => {
            const type = container.getAttribute('data-type');
            const selectedValues = [...container.querySelectorAll('.checkbox_filter')]
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);

            if (selectedValues.length > 0) {
                filters[type] = selectedValues;
            }
        });

        products.forEach(product => {
            let shouldDisplay = true;

            for (const [type, values] of Object.entries(filters)) {
                const productValue = product.getAttribute(`data-${type}`);
                if (!values.includes(productValue)) {
                    shouldDisplay = false;
                    break;
                }
            }

            product.style.display = shouldDisplay ? 'flex' : 'none';
        });
    }

    filterProducts();
});

filter_checkbox.forEach(e => {
    e.addEventListener("click", function () {
        e.classList.toggle("is-checked");
    });
});

label_filter_checkbox.forEach(e => {
    e.addEventListener("click", function (i) {
        i.target.querySelector(".filter_checkbox").classList.toggle("is-checked");
    });
});