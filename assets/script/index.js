const close_btn = document.querySelector(".close_btn");
const open_btn = document.querySelector(".open_btn");
const header__menu = document.querySelector(".header__menu");
const menu_mask = document.querySelector(".menu_mask");
const button_basket = document.querySelectorAll(".button_basket");
const header__menu_right_basket = document.querySelector(".header__menu_right_basket");
const basket_modal = document.querySelector(".basket_modal");
const basket_modal__cards__close_btn = document.querySelector(".basket_modal__cards__close_btn");
const basket_item_box = document.querySelector(".basket_item_box");
const basket_items = document.querySelectorAll(".block_3__main_cards_item");
const basket_plusCount = document.querySelectorAll(".basket_plusCount");

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
basket_items.forEach((e) => {
    if (wk_basket.some(item => Number(e.dataset.id) === item.id)) {
        e.children[2].children[0].children[0].children[0].textContent = "Удалить";
    }
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
newStyle.innerHTML = `.header__menu_right_basket::after {content: "${wk_basket.length}" !important;}`;

/* Добавить/Удалить товар  */
button_basket.forEach((e) => {
    e.addEventListener("click", () => {
        const bsItemParentNode = e.parentNode.parentNode.parentNode.parentNode;
        const idProduct = Number(bsItemParentNode.dataset.id);
        bsItemParentNode.querySelector(".button_basket").textContent = "Удалить";

        if (wk_basket.some(item => idProduct === item.id)) {
            newStyle.innerHTML = `.header__menu_right_basket::after {content: "${wk_basket.length - 1}" !important;}`;
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
        newStyle.innerHTML = `.header__menu_right_basket::after {content: "${wk_basket.length}" !important;}`;
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
                resultPrice += Number(i.price.replaceAll("$", ""));
                basket_item_box.innerHTML += `
            <div class="basket_modal__item" data-id="${i.id}">
                <div class="basket_modal__item_img"><img src="${i.img}" alt=""></div>
                <div class="basket_modal__item_content">
                    <div class="basket_modal__item_title">${i.title}</div>
                    <div class="basket_modal__item_btn">
                        <div class="basket_modal__item_count"><span onclick="basketMinusCount(${i.id})">-</span><span>${i.count}</span><span onclick="basketPlusCount(${i.id})">+</span></div>
                        <div class="basket_modal__item_price">${i.price}</div>
                        <div class="basket_modal__item_delete">×</div>
                    </div>
                </div>
            </div>
            `;
            });
            resultCount += wk_basket.length
            basket_item_box.innerHTML += `
            <div class="basket_modal__item result">
                <div>
                <b>Товаров</b>: ${resultCount}
                </div>
                <div>
                <b>Товаров (вкл. шт.)</b>: ${resultCountAll}
                </div>
                <div>
                <b>Итоговая цена</b>: ${resultPrice}$
                </div>
                <button>Оформить</button>
            </div>
            `;
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
header__menu_right_basket.addEventListener("click", () => {
    basket_modal.classList.add("is-active");
    wk_basket_update();
});
basket_modal__cards__close_btn.addEventListener("click", () => {
    basket_modal.classList.remove("is-active");
    wk_basket_update();
});

function basketPlusCount(props) {
    console.log(props);
}
function basketMinusCount(props) {
    console.log(props);
}

/* Добавление счета товаров в корзине иконке вверху */
document.head.appendChild(newStyle);