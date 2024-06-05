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

let wk_basket = JSON.parse(localStorage.getItem("wk_basket")) || [];

close_btn.addEventListener("click", () => {
    header__menu.classList.toggle("is-active");
    menu_mask.classList.toggle("is-active");
});
open_btn.addEventListener("click", () => {
    header__menu.classList.toggle("is-active");
    menu_mask.classList.toggle("is-active");
});

basket_items.forEach((e) => {
    if (wk_basket.some(item => Number(e.dataset.id) === item.id)) {
        e.children[2].children[0].children[0].children[0].textContent = "Удалить";
    }
});

function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i][key] == valuetosearch) {
            return i;
        }
    }
    return null;
}

button_basket.forEach((e) => {
    e.addEventListener("click", () => {
        const idProduct = Number(e.parentNode.parentNode.parentNode.parentNode.dataset.id);
        e.parentNode.parentNode.parentNode.parentNode.children[2].children[0].children[0].children[0].textContent = "Удалить";

        if (wk_basket.some(item => idProduct === item.id)) {
            e.parentNode.parentNode.parentNode.parentNode.children[2].children[0].children[0].children[0].textContent = "В корзину";
            wk_basket.splice(functiontofindIndexByKeyValue(wk_basket, "id", idProduct), 1);
            localStorage.setItem("wk_basket", JSON.stringify(wk_basket));
            return;
        }
        const wk_basket_newObj = {
            id: idProduct,
            count: 1,
            title: e.parentNode.parentNode.parentNode.parentNode.children[1].children[0].textContent,
            price: e.parentNode.parentNode.parentNode.parentNode.children[2].children[1].textContent,
            img: e.parentNode.parentNode.parentNode.parentNode.children[0].children[0].src,
        };
        wk_basket.push(wk_basket_newObj);
        localStorage.setItem("wk_basket", JSON.stringify(wk_basket));
    });
});

function wk_basket_update() {
    if (localStorage.getItem("wk_basket")) {
        const wk_basket = JSON.parse(localStorage.getItem("wk_basket"));
        basket_item_box.innerHTML = ``;
        wk_basket.forEach((i) => {
            basket_item_box.innerHTML += `
        <div class="basket_modal__item">
            <div class="basket_modal__item_img"><img src="${i.img}" alt=""></div>
            <div class="basket_modal__item_content">
                <div class="basket_modal__item_title">${i.title}</div>
                <div class="basket_modal__item_btn">
                    <div class="basket_modal__item_count"><span>+</span><span>${i.count}</span><span>-</span></div>
                    <div class="basket_modal__item_price">${i.price}</div>
                    <div class="basket_modal__item_delete">×</div>
                </div>
            </div>
        </div>
        `;
        });
    } else {
        basket_item_box.innerHTML = `
    <div class="basket_modal__item">
      Вы еще не добавили товаров в корзину
    </div>
    `;
    }
}
header__menu_right_basket.addEventListener("click", () => {
    basket_modal.classList.add("is-active");
    wk_basket_update();
});
basket_modal__cards__close_btn.addEventListener("click", () => {
    basket_modal.classList.remove("is-active");
    wk_basket_update();
});
