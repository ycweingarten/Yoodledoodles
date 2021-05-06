if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
}
else {
    ready()
}

function ready() {
    onLoadCartNumbers();
    displayCart();

    var addToCartButtons = document.getElementsByClassName('add-to-cart')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var addToCartButton = addToCartButtons[i];
        addToCartButton.addEventListener('click', (ev) => {
            ev.preventDefault();
            addProduct();
        });
    }

    /*

    var quantityInputs = document.getElementsByClassName('cart-item-quantity')
        for (var i = 0; i < quantityInputs.length; i++) {
            var input = quantityInputs[i]
            input.addEventListener('change', quantityChanged)
        }
        var removeCartItemButtons = document.getElementsByClassName('cart-item-remove')
        for (var i = 0; i < removeCartItemButtons.length; i++) {
            var button = removeCartItemButtons[i]
            button.addEventListener('click', removeCartItem)
        }
        
        */
}


// adds product to array in localstorage cartProducts[example {Name: 'Flowers', Type:'BC', Img:'url', Quantity:1, Price:100 PRSNL:[...]}
function addProduct() {

    if (localStorage.getItem('cartProducts') == null) {
        localStorage.setItem('cartProducts', '[]');
    }

    var oldProducts = JSON.parse(localStorage.getItem('cartProducts'));

    //this will hold all the input from the product form
    var prsnl = new Object();
    const formData = new FormData(document.querySelector('form'))

    //creating an array with keys and values
    for (var pair of formData.entries()) {
        if (pair[1] !== "") {

            var prsnlKey = pair[0];
            prsnl["" + prsnlKey + ""] = pair[1];

        }
    }

    //using tag to deteramine if product is already in cart
    var productTag = prsnl.tag;
    var productName = prsnl.name;
    var productType = prsnl.type;
    var productImg = prsnl.image;
    var productPrice = prsnl.price;

    delete prsnl.name
    delete prsnl.tag
    delete prsnl.type
    delete prsnl.image
    delete prsnl.price

    var productQuantity = document.getElementById('product-quantity').value;
    if (productQuantity == "") {
        productQuantity = 1;
    }
    else {
        delete prsnl['product-quantity']
    }
    cartNumbers(productQuantity);

    //does product exist already
    //productExists is the index of the product
    var productExists = oldProducts.findIndex(e => e.tag === productTag);

    if (productExists > -1) {

        console.log(productExists, "product exists", oldProducts[productExists].tag + "=="+ productTag);

        //if product exists check if its personalised
        if (oldProducts[productExists].prsnl
            && Object.keys(oldProducts[productExists].prsnl).length === 0
            && oldProducts[productExists].prsnl.constructor === Object) {
            //product exist and isn't personalised

            console.log("product exist and isn't personalised");

            if (
                typeof prsnl &&
                Object.keys(prsnl).length === 0
                && prsnl.constructor === Object

            ) {
                console.log("double of same product, update quantity", prsnl);
                //double of same product, update quantity
                oldProducts[productExists].quantity = parseInt(oldProducts[productExists].quantity) + parseInt(productQuantity);
            }
            else {
                console.log("product is personalised therefore create new");
                var newProduct = {

                    tag: productTag,
                    name: productName,
                    type: productType,
                    img: productImg,
                    quantity: productQuantity,
                    price: productPrice,
                    prsnl: prsnl,
                }


                oldProducts.push(newProduct);
            }
        }
        else {
            console.log("product exist and is personalised")



            var newProduct = {

                tag: productTag,
                name: productName,
                type: productType,
                img: productImg,
                quantity: productQuantity,
                price: productPrice,
                prsnl: prsnl,
            }


            oldProducts.push(newProduct);
            // localStorage.setItem('cartProducts', JSON.stringify(oldProducts));

        }

    }

    //if product doesnt exist


    /*    var productPrsnl = typeof oldProducts[productExists].prsnl;
 
 
       if (productPrsnl !== Object || oldProducts[productExists].prsnl !== '{}') {
           console.log("Prsnl :" + productPrsnl)
           oldProducts[productExists].quantity = parseInt(oldProducts[productExists].quantity) + parseInt(productQuantity);
       }
       else {
           console.log("doesnt exist " + productExists)
       }*/

    else {

        console.log("product doesnt exist -> add new product")


        var newProduct = {

            tag: productTag,
            name: productName,
            type: productType,
            img: productImg,
            quantity: productQuantity,
            price: productPrice,
            prsnl: prsnl,
        }


        oldProducts.push(newProduct);
        //localStorage.setItem('cartProducts', JSON.stringify(oldProducts));

    }



    /*
    var productTag = document.getElementById('product-tag').value;
    var productName = document.getElementById('product-name').value;
    var productType = document.getElementById('product-type').value;
    var productImg = document.getElementById('product-img').value;
    var productQuantity = document.getElementById('product-quantity').value;
    var productPrice =  document.getElementById('product-price').value;
    */

    localStorage.setItem('cartProducts', JSON.stringify(oldProducts));
    document.forms[0].reset();
}


function cartNumbers(productQuantity) {
    var productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    var quantity = parseInt(productQuantity);

    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + quantity);
        document.querySelector('.cart span').textContent = productNumbers + quantity;

    }
    else {
        localStorage.setItem('cartNumbers', quantity);
        document.querySelector('.cart span').textContent = quantity;
    }
}


function onLoadCartNumbers() {
    var productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}


function displayCart() {
    var cartItems = localStorage.getItem('cartProducts');
    cartItems = JSON.parse(cartItems);
    var cartItemsContainer = document.querySelector('.cart-items-list')

    if (cartItems && cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        Object.values(cartItems).map(item => {

            var itemIndex = cartItems.indexOf(item);
            var prsnl = "";
            if (item.prsnl) {
                prsnl = Object.values(item.prsnl);
            }
            cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}"
                    loading="lazy" alt="" class="cart-item-image">
                <div class="cart-item-details">
                    <h2 class="cart-item-name">${item.name}</h2>
                    <div>${item.type}</div>
                    <div class="cart-item-prsnl"> ${prsnl}</div>
                </div>
                <div class="div-block-40">
                    <div class="cart-item-price">${item.price} ₪ </div>
                    <!--<input type="number" class="cart-item-quantity w-input" maxlength="256" name="cart-item-quantity"
                        data-name="cart-item-quantity" id="cart-item-quantity" required="" value="${item.quantity}">
                    -->
                    <p class='cart-item-quantity' value='${item.quantity}' >Q: ${item.quantity}</p>
                    <div class="cart-item-total">${item.price * item.quantity} ₪ </div>
                    <a onclick="removeCartItem('${itemIndex}')" href="#" class="cart-item-remove w-inline-block">

                        <div class="cart-item-remove-text">Remove | הסר </div>
                    </a>
                </div>
            </div>
            `;
        });
        updateCartTotal();

    }

}


//not based on localstorage -still needs work earases last one not one that was choosen
function removeCartItem(index) {
    var cartItems = localStorage.getItem('cartProducts');
    cartItems = JSON.parse(cartItems);
    cartItems.splice(index, 1);
    localStorage.setItem('cartProducts', JSON.stringify(cartItems));

    displayCart();
    updateCartTotal();
}



//needs to effect localstorage 
/*
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    else{
        var cartItems = localStorage.getItem('cartProducts');
        cartItems = JSON.parse(cartItems);
        console.log(event.currentTarget.parentNode.parentNode);
    }
    updateCartTotal();
}
*/



function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items-list')[0];
    var cartItems = cartItemContainer.getElementsByClassName('cart-item');
    var totalQuantity = 0;
    var total = 0;
    for (var i = 0; i < cartItems.length; i++) {
        var cartItem = cartItems[i];
        var priceElement = cartItem.getElementsByClassName('cart-item-price')[0];
        var quantityElement = cartItem.getElementsByClassName('cart-item-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace('₪', ''));
        var quantity = parseFloat(quantityElement.innerText.replace('Q:', ''));
        total = total + (price * quantity);
        totalQuantity += quantity;
    }

    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = '₪' + total;
    
    localStorage.setItem('cartNumbers', totalQuantity);
    onLoadCartNumbers();

}
