import apiData from './api.js'
import {isUserInUsers , getCookies} from './api.js'

let menu = document.getElementById('menu')
let menuBtn = document.getElementById('menu-btn')
let currentPage = document.getElementById('currentPage')
let content = document.getElementById('content')

// basket section
let progresses = document.querySelectorAll('#progress div')
let checkoutBtn = document.getElementById('checkoutBtn')
let payNowBtn = document.getElementById('payNowBtn')
let payOrderBtn = document.getElementById('payOrderBtn')
 
let backToProgressBtn = document.getElementById('backToProgress1')
let backToProgressBtn1 = document.getElementById('backToProgress2')

let wishListWrapper = document.querySelector('#WishListProducts')
let userBasketWrapper = document.querySelector('.userBasketWrapper')

let countrySelectBox = document.querySelector('#countrySelectBox')
let citySelectBox = document.querySelector('#citySelectBox')
let deliveryRadioBtns = document.querySelectorAll('#progress2 input[type="radio"]')

let shortCutBtns = document.querySelectorAll('.shortcut-btn')

let countryObj = {
    Iran : ['Tehran' , 'Isfahan' , 'Ahwaz' , 'Shiraz'],
    USA : ['NewYork' , 'Chicago' , 'LosAngeles' , 'Texas'],
    Germany : ['Berlin' , 'Munich' , 'Frankfort'],
    Britain : ['London' , 'Manchester'],
}

let progressTarget = 1
let userObj = null
let productsObj = null
let targetElem = null
let currentTab = null
let subtotalPrice = null
let tax = null
let totalPrice = null
let delivery = 7
let currentProgress = 1
let userBasket = null
let newOrder = {orders : []}
let newOrderObj = null
let orders = []
let newWishListObj = {wishlist : []}
let wishList = null

class Order {
    constructor(products  , country, fullName , city , postalCode  , address , phoneNumber , description , delivery , subtotal , tax , finalPrice){
        this.orderId = makeRandomIdNum()
        this.products = products
        this.country = country
        this.fullName = fullName
        this.city = city
        this.postalCode = postalCode
        this.address = address
        this.phoneNumber = phoneNumber
        this.description = description
        this.delivery = delivery
        this.subtotal = subtotal
        this.tax = tax
        this.finalPrice = finalPrice
    }
}

async function getOrdersHandler(){
    let ordersArray = []
    fetch(apiData.getPurchasesUrl , {
        headers : {
            'apikey' : apiData.getPurchasesApiKey,
            'authorization' : apiData.authorization
        }
    })
    .then(res => res.json())
    .then(orders => ordersArray = orders)
    .catch(err => console.log(err))

    return ordersArray
}

const makeRandomIdNum = () => {
    let num = null
    let targetArray = getOrdersHandler()

    if(targetArray.length){
        num = Math.floor(Math.random() * 9999)
        let isNumExist = targetArray?.some(order => order.id === num)
        
        if(isNumExist){
            makeRandomIdNum()
        } else {
            return num
        }
    } else {
        num = Math.floor(Math.random() * 9999)
        return num
    }
}

function toggleMenu(){
    menu.classList.toggle('unshow')
}

function changeMenu(e){
    // Checking the current active tab with the value that has been clicked so that the page is not refreshed if the current tab is clicked
    targetElem = e.target
    if(e.target.tagName !== 'LI' || targetElem.dataset.target === currentTab){
        return false
    }

    let prevActiveTab = menu.querySelector('.active')
    prevActiveTab.classList.remove('active')
    targetElem.classList.add('active')

    let prevActiveContent = document.getElementById(currentTab)
    prevActiveContent.classList.add('notActive')

    let targetElemWrapper = document.getElementById(e.target.dataset.target)
    targetElemWrapper.classList.remove('notActive')

    currentTab = targetElem.dataset.target
    changeCurrentPageHandler(targetElem.dataset.target)
}

// change page title and current location link
function changeCurrentPageHandler(){
    currentPage.innerHTML = `/ ${currentTab}`
    document.title = `Shoe Store | ${currentTab}`
}

document.addEventListener('DOMContentLoaded' , () => {
    currentTab = menu.querySelector('.active').dataset.target
})

// basket section
function getProgressTwoDetails(){
    let productsWrapper = document.querySelector('#progressTwoBasketWrapper')
    let basketItemsElem = document.querySelector('#basket-items')
    
    basketItemsElem.innerHTML = userBasket.length
    productsWrapper.innerHTML = ''

    let targetProduct = null
    userBasket.forEach(product => {
        targetProduct = getProductObject(product.productId)
        productsWrapper.insertAdjacentHTML('beforeend' , `<div class="flex items-start justify-between gap-2">
        <div class="flex gap-2 w-2/3">
            <div class="w-[30%] h-28 overflow-hidden rounded md:w-[25%]">
                <img src="./images/${targetProduct.imagePath}" class="object-cover object-center" alt="Product Image">
            </div>
            <div class="flex flex-col gap-1">
                <h3 class="text-gray-800 font-bold">${product.productName}</h3>
                <p class="text-gray-500 font-semibold line-clamp-1">${targetProduct.productSummary}</p>
                
                <div class="flex items-center gap-1 text-gray-500 font-semibold">Color :
                    <span>
                        <span class="inline-block w-3 h-3 rounded-full bg-${product.color}-500"></span>
                    </span>
                </div>
            </div>
        </div>
        
        <div class="flex flex-col items-end gap-1">
            <h3 class="text-gray-800 font-semibold text-lg tracking-wider">$${product.finalPrice}</h3>
            <div id="sizes" class="flex items-center gap-2 text-gray-500 font-semibold sm:text-base">
                <h3>Size : </h3>
                <span>${product.size}</span>
            </div>
            <span class="flex items-center gap-1 text-gray-500 font-semibold">Quantity : 
                <span>${product.quantity}</span>
            </span>
        </div>
        
    </div>`)
    })

    calcTotalPrice(true) 
}

function showReceiptDetails(orders){
    let productsWrapper = document.querySelector('#productsWrapper3')
    
    productsWrapper.innerHTML = ''
    let targetProduct = null
    userBasket.forEach(product => {
        targetProduct = getProductObject(product.productId)
        productsWrapper.insertAdjacentHTML('beforeend' , `<div class="flex items-start justify-between gap-2">
        <div class="flex gap-2 w-2/3">
            <div class="w-[30%] h-28 overflow-hidden rounded md:w-[25%]">
                <img src="./images/${targetProduct.imagePath}" class="object-cover object-center" alt="Product Image">
            </div>
            <div class="flex flex-col gap-1">
                <h3 class="text-gray-800 font-bold">${product.productName}</h3>
                <p class="text-gray-500 font-semibold line-clamp-1">${targetProduct.productSummary}</p>
                
                <div class="flex items-center gap-1 text-gray-500 font-semibold">Color :
                    <span>
                        <span class="inline-block w-3 h-3 rounded-full bg-${product.color}-500"></span>
                    </span>
                </div>
            </div>
        </div>
        
        <div class="flex flex-col items-end gap-1">
            <h3 class="text-gray-800 font-semibold text-lg tracking-wider">$${product.finalPrice}</h3>
            <div id="sizes" class="flex items-center gap-2 text-gray-500 font-semibold sm:text-base">
                <h3>Size : </h3>
                <span>${product.size}</span>
            </div>
            <span class="flex items-center gap-1 text-gray-500 font-semibold">Quantity : 
                <span>${product.quantity}</span>
            </span>
        </div>
        
    </div>`)
    })

    let progressWrapper = document.querySelector('#progress3')

    let fullNameElem = progressWrapper.querySelector('#fullName-receipt')
    let phoneNumberElem = progressWrapper.querySelector('#phoneNumber-receipt')
    let countryElem = progressWrapper.querySelector('#country-receipt')
    let cityElem = progressWrapper.querySelector('#city-receipt')
    let postalCodeElem = progressWrapper.querySelector('#postalCode-receipt')
    let addressElem = progressWrapper.querySelector('#address-receipt')
    let descElem = progressWrapper.querySelector('#desc-receipt')

    fullNameElem.innerHTML = orders.fullName
    phoneNumberElem.innerHTML = orders.phoneNumber
    countryElem.innerHTML = orders.country
    cityElem.innerHTML = orders.city
    postalCodeElem.innerHTML = orders.postalCode
    addressElem.innerHTML = orders.address
    descElem.innerHTML = orders.description
    calcTotalPrice(true)
}

function getPurchaseReceiptDetails(){
    let progressWrapper = document.querySelector('#progress2')

    let firstNameInput = progressWrapper.querySelector('#firstNameInput')
    let lastNameInput = progressWrapper.querySelector('#lastNameInput')
    let postalCodeInput = progressWrapper.querySelector('#postalCodeInput')
    let AddressInput = progressWrapper.querySelector('#addressInput')
    let phoneNumberInput = progressWrapper.querySelector('#phoneNumberInput')
    let description = progressWrapper.querySelector('textarea')

    newOrderObj = new Order(userBasket , countrySelectBox.value , `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}` , citySelectBox.value ,postalCodeInput.value.trim()
    , AddressInput.value.trim() , phoneNumberInput.value.trim() , description.value.trim() , delivery , subtotalPrice , tax , totalPrice)
    newOrder.orders = orders || {...newOrderObj}

    orders && newOrder.orders.push({...newOrderObj})

    showReceiptDetails(newOrderObj)
}

async function updateUserBasket(newBasketObj , target){
    await fetch(`${apiData.updateUsersUrl}${userObj.id}` , {
        method : 'PATCH',

        headers : {
            'Content-Type': 'application/json',
            'apikey' : apiData.updateUsersApiKey,
            'authorization' : apiData.authorization
        },

        body : JSON.stringify(newBasketObj)
    })
    .then(res => {
        console.log(res)
        if([205 , 204 , 203 , 202 , 201 ,200].includes(res.status)){
            if(target == 'add'){
                getProgressTwoDetails()
            } else {
                showUserBasket()
                showUserInfos(userObj)
            }
            Swal.fire({
                icon: "success",
                title: `Your Basket Was Updated`,
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            Swal.fire({
                icon: "error",
                title: `${res.status} Error`,
                text: "Something went wrong! please try again later",
                timer: 3000
            })
        }
    })
    .catch(err => {
        console.log(err)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! please try again later",
            timer: 3000
        });
    })
}

function removeProductFromBasket(productId){
    userBasket = userBasket.filter(product => product.productId != productId)
    console.log(userBasket , productId)
    let newUserBasket = {basket : [...userBasket]}
    updateUserBasket(newUserBasket , 'delete')
}

function changePurchaseProgress(e){
    progressTarget = parseInt(e.target.dataset.target)

    if(progressTarget == 2){
        if(currentProgress == 1){
          let newBasketElem = {basket : [...userBasket]} 
          updateUserBasket(newBasketElem , 'add')
        } else if(currentProgress == 3){
          getProgressTwoDetails()
        }
    } else if(progressTarget == 3){
        getPurchaseReceiptDetails()
    }

    if(progressTarget > currentProgress){
        // hide prev progress section and visible next progress section by adding and removing show class
        let currentProgressWrapper = document.getElementById(`progress${currentProgress}`)
        currentProgressWrapper.classList.remove('show')
        
        let nextProgressWrapper = document.getElementById(`progress${progressTarget}`)  
        nextProgressWrapper.classList.add('show')
        
        // changing current progress icon style by adding active class
        let currentProgressIcon = document.getElementById(`progress-${progressTarget}`)
        currentProgressIcon.classList.add('active')
    
        let progressLine = null
        let progressIcon = null
        for(let i = 1 ; i < progressTarget ; i++){
            // changing progress icon's by adding completed class and removing active class
            progressIcon = document.getElementById(`progress-${i}`)
            if(progressIcon.className.includes('active')){
                progressIcon.classList.remove('active')
            }
            progressIcon.classList.add('completed')
            // changing progress lines styles by adding progress-completed class
            progressLine = document.getElementById(`progress-line-${i}`)
            progressLine.classList.add('progress-completed')
        }

    } else {
        // hide prev progress section and visible next progress section by adding and removing show class
        let currentProgressWrapper = document.getElementById(`progress${currentProgress}`)
        currentProgressWrapper.classList.remove('show')
        
        let nextProgressWrapper = document.getElementById(`progress${progressTarget}`)  
        nextProgressWrapper.classList.add('show')

        // changing current progress icon style by adding active class
        let currentProgressIcon = document.getElementById(`progress-${progressTarget}`)
        currentProgressIcon.classList.remove('completed')
        currentProgressIcon.classList.add('active')

        let progressLine = document.getElementById(`progress-line-${progressTarget}`)
        progressLine.classList.remove('progress-completed')
        
        let progressIcon = document.getElementById(`progress-${currentProgress}`)
        progressIcon.classList.remove('active')
    }

    // now we must update currentProgress 
    currentProgress = progressTarget
}

async function addOrderToUserOrders(orders){
    await fetch(`${apiData.updateUsersUrl}${userObj.id}` , {
        method : 'PATCH',

        headers : {
            'Content-Type': 'application/json',
            'apikey' : apiData.updateUsersApiKey,
            'authorization' : apiData.authorization
        },

        body : JSON.stringify(orders)
    })
    .then(res => {
        console.log(res)
        if([205 , 204 , 203 , 202 , 201 ,200].includes(res.status)){
            userBasket = []
            let newUserBasket = {basket : [...userBasket]}
            updateUserBasket(newUserBasket)
            showUserBasket()
            showUserInfos(userObj)
            
            Swal.fire({
                icon: "success",
                title: `Your Basket Was Updated`,
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            Swal.fire({
                icon: "error",
                title: `${res.status} Error`,
                text: "Something went wrong! please try again later",
                timer: 3000
            })
        }
    })
    .catch(err => {
        console.log(err)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! please try again later",
            timer: 3000
        });
    })
}

async function addOrderToPurchases(newOrder){
    await fetch(apiData.postPurchasesUrl , {
        method : 'POST',

        headers : {
            'Content-Type': 'application/json',
            'apikey' : apiData.postPurchasesApiKey,
            'authorization' : apiData.authorization
        },

        body : JSON.stringify(newOrder)
    })
    .then(res => {
        console.log(res)
        if([205 , 204 , 203 , 202 , 201 ,200].includes(res.status)){
            Swal.fire({
                icon: "success",
                title: `Order Was Added`,
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            Swal.fire({
                icon: "error",
                title: `${res.status} Error`,
                text: "Something went wrong! please try again later",
                timer: 3000
            })
        }
    })
    .catch(err => {
        console.log(err)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! please try again later",
            timer: 3000
        });
    })
}

function payOrderHandler(){
    addOrderToUserOrders(newOrder)
    let newOrderObject = {...newOrderObj}
    newOrderObject.customerId = userObj.id
    newOrderObject.customerUsername  = userObj.userName
    addOrderToPurchases(newOrderObject)
}

// progress 1 shopping cart
function calcProductTax(price){
    let tax = (price * 9) / 100
    return tax
}

function calcTotalPrice(deliveryId){
    let subtotalElem = document.querySelector(`#subtotal${progressTarget}`)
    let taxElem = document.querySelector(`#tax${progressTarget}`)
    let totalPriceElem = document.querySelector(`#totalPrice${progressTarget}`)

    subtotalPrice = userBasket.reduce((sum , product) => sum + (product.quantity * product.finalPrice) , 0)
    tax = calcProductTax(subtotalPrice)
    totalPrice = subtotalPrice + tax
    
    if(deliveryId){
        let deliveryElem = document.querySelector(`#delivery${progressTarget}`)
        deliveryElem.innerHTML = delivery.toFixed(2)
        totalPrice += delivery
    }
    
    subtotalElem.innerHTML = `$${subtotalPrice.toFixed(1)}`
    taxElem.innerHTML = `$${tax.toFixed(1)}`
    totalPriceElem.innerHTML = `$${totalPrice.toFixed(1)}`
}

function changeProductCount(e , targetId){
    let targetElem = e.target.tagName === 'path' ? e.target.parentNode.parentNode: e.target.tagName === 'svg' ? e.target.parentNode : e.target

    let productCountElem = null
    let productCount = null

    if(targetElem.id === 'increase-count'){
        productCountElem = targetElem.previousElementSibling
        increaseProductCount(productCountElem , targetId)
        productCount = productCountElem.innerHTML
    } else {
        productCountElem = targetElem.nextElementSibling
        decreaseProductCount(productCountElem , targetId)
        productCount = productCountElem.innerHTML
    }

    updateProductQuantity(targetId , productCount)
    calcTotalPrice()
}

function increaseProductCount(countElem , targetId){
    let productCount = parseInt(countElem.innerHTML)
    
    userBasket.forEach(product => {
        if(product.id == targetId){
            product.quantity = productCount + 1
        }
    })  
    
    countElem.innerHTML = productCount + 1
}

function decreaseProductCount(countElem , targetId){
    let productCount = parseInt(countElem.innerHTML)
    if(productCount == 1){
        return false
    }

    userBasket.forEach(product => {
        if(product.id == targetId){
            product.quantity = productCount - 1
        }
    })  
    
    countElem.innerHTML = productCount - 1
}

function changeCityInputValue(e){
    let country = e.target.value
    let targetCities = countryObj[country]

    let citiesElem = `<option value="City">City</option>`
    
    if(targetCities){
        citiesElem += targetCities.map(city => `<option value="${city}">${city}</option>`).join('')
    }
    
    citySelectBox.innerHTML = citiesElem 
}

function changeProductDelivery(e){
    if(e.target.id == 'Standard'){
        delivery = 7
    } else {
        delivery = 11
    }

    calcTotalPrice(true)
}

function showUserInfos(userObj){
    let userInfo = document.getElementById('user-info')
    let purchasesShortCutTable = document.querySelector('.purchases-shortcut-table')
    let basketShortCutTable = document.querySelector('.basketShortcutTable')

    let userFirstNameDetail = userInfo.querySelector('.userFirstNameDetail')
    userFirstNameDetail.innerHTML = userObj.firstName
    
    let userLastNameDetail = userInfo.querySelector('.userLastNameDetail')
    userLastNameDetail.innerHTML = userObj.lastName
    
    let userEmailDetail = userInfo.querySelector('.userEmailDetail')
    userEmailDetail.innerHTML = userObj.email
    
    let usernameDetail = userInfo.querySelector('.usernameDetail')
    usernameDetail.innerHTML = userObj.userName

    if(!userObj.orders){
        purchasesShortCutTable.nextElementSibling.classList.remove('hidden')
        purchasesShortCutTable.nextElementSibling.classList.add('flex')
    } else {
        purchasesShortCutTable.nextElementSibling.classList.remove('flex')
        purchasesShortCutTable.nextElementSibling.classList.add('hidden')
    }

    if(!userBasket.length){
        basketShortCutTable.lastElementChild.classList.remove('hidden')
        basketShortCutTable.lastElementChild.classList.add('flex')
    } else {
        basketShortCutTable.lastElementChild.classList.remove('flex')
        basketShortCutTable.lastElementChild.classList.add('hidden')

        let userShortCutBasket = [...userBasket]

        if(userBasket.length > 3){
            userShortCutBasket = userBasket.slice(0,3)
        }

        let targetProduct = null
        userShortCutBasket.forEach(product => {
            targetProduct = getProductObject(product.productId)
            basketShortCutTable.insertAdjacentHTML('beforeend' , `<div class="bg-gray-100 flex items-center gap-2 p-[2px] rounded-md max-h-12 overflow-hidden">
            <div class="w-[15%] rounded-md overflow-hidden xs:w-[10%]">
                <img src="./images/${targetProduct.imagePath}" alt="Purchased product image" class="object-cover object-center">
            </div>
            <div class="w-[65%] flex flex-col justify-center gap-[2px] xs:w-[70%]">
                <h3 class="font-bold text-gray-800 text-sm line-clamp-1 xs:text-base">${targetProduct.productName}</h3>
                <h3 class="font-bold text-gray-500 text-sm line-clamp-1 xs:text-base">${targetProduct.productSummary}</h3>
            </div>
            <div class="font-bold text-gray-800">$${targetProduct.finalPrice}</div>
        </div>`)
        })
    }
}

function getProductObject(productId){
    let targetProductObj = productsObj.find(product => product.id == productId)
    return {...targetProductObj}
}

async function getProductsHandler(){
    let allProducts = null
    await fetch(apiData.getProductsUrl , {
        headers : {
            'apikey' : apiData.getProductsApiKey , 
            'authorization' : apiData.authorization
        }
    })
    .then(res => res.json())
    .then(products => {
        allProducts = products
    })
    .catch(err => console.log(err))

    return allProducts
}

function showWishListProducts(){
    if(!wishList){
        wishListWrapper.nextElementSibling.classList.remove('hidden')
        wishListWrapper.nextElementSibling.classList.add('flex')
    } else {
        wishListWrapper.innerHTML = ''
        wishList.forEach(product => {
            wishListWrapper.insertAdjacentHTML('beforeend' , `<div class="relative p-1 hover:-translate-y-5 transition-transform ease-in-out duration-200 rounded-lg bg-white flex flex-col gap-1 select-none overflow-hidden group">
                <div class="relative w-full !h-72 overflow-hidden rounded-md">
                    <img src="./images/${product.imagePath}" class="object-cover group-hover:scale-150 group-hover:rotate-12 transition-transform duration-200" alt="Product Image">
            
                    <button data-targetId="${product.id}" class="p-1 absolute top-1 right-1 bg-white rounded-full hover:scale-110 transition-transform group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-6 hover:scale-110 stroke-white fill-red-600 group-hover:fill-white group-hover:stroke-red-600 transition-all">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>                              
                    </button>
                </div>
            
                <div class="space-y-2 py-1 px-2">
                    <div class="space-y-[2px]">
                        <h3 class="font-bold text-gray-800">${product.productName}</h3>
                        <p class="text-gray-400">${product.productSummary}</p>
                    </div>
            
                    <div class="w-full flex justify-between items-center">
                        <div class="font-bold text-gray-800"><span class="line-through decoration-gray-400 text-gray-400 ${product.discount ? '' : 'hidden'}">$${product.price}</span> $${product.finalPrice}</div>
                        <a  href="./product.html?p=${product.id}" class="inline-block py-2 px-4 text-white font-semibold bg-sky-500 hover:bg-sky-600 transition-colors rounded-md">Buy Now</a>
                    </div>
                </div>
            
                <div class="absolute ${product.discount ? '' : 'hidden'} left-0 top-0 bg-sky-500 text-white font-bold rounded-br-lg text-sm py-0.5 px-1.5">-%${product.discount} Off</div>
            </div>`)
        })

        let wishlistBtns = wishListWrapper.querySelectorAll('button')

        wishlistBtns.forEach(wishlistBtn => wishlistBtn.addEventListener('click' , e => {
            let targetElem = e.target.tagName == 'path' ? e.target.parentNode.parentNode : e.target.tagName == 'svg' ? e.target.parentNode : e.target 
            let productId = targetElem.dataset?.targetid
            let targetProductObj =  getProductObject(productId)
            
            if(productId && targetProductObj){
                addProductToWishList(targetProductObj)
            }
        }))
    }
}

function updateProductQuantity(targetId , productNewQuantity){
    userBasket.forEach(product => {
        if(product.id == targetId){
            product.quantity = productNewQuantity
        }
    })
}

function changeProductColor(e , targetId){
    userBasket.forEach(product => {
        if(product.id == targetId){
            product.color = e.target.dataset.color
        }
    })
}

function changeProductSize(e , targetId){
    userBasket.forEach(product => {
        if(product.id == targetId){
            product.size = e.target.value
        }
    })
}

// wishList
function isProductExistInWishList(productObj){
    let productIndex = wishList.findIndex(product => JSON.stringify(product) == JSON.stringify(productObj))
    return productIndex  
} 

async function addProductToWishListHandler(productObj){
    console.log(productObj);
    await fetch(`${apiData.updateUsersUrl}${userObj.id}` , {
        method : 'PATCH',

        headers : {
            'Content-Type': 'application/json',
            'apikey' : apiData.updateUsersApiKey,
            'authorization' : apiData.authorization
        },

        body : JSON.stringify(productObj)
    })
    .then(res => {
        console.log(res)
        if([205 , 204 , 203 , 202 , 201 ,200].includes(res.status)){
            wishList = productObj.wishlist
            showUserBasket()
            showWishListProducts()
            Swal.fire({
                icon: "success",
                title: `Your Wish List Was Updated`,
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            Swal.fire({
                icon: "error",
                title: `${res.status} Error`,
                text: "Something went wrong! please try again later",
                timer: 3000
            })
        }
    })
    .catch(err => {
        console.log(err)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! please try again later",
            timer: 3000
        });
    })
}

async function addProductToWishList(productObj){
    newWishListObj.wishlist = wishList || {...productObj}

    let productIndex = isProductExistInWishList(productObj)

    if(productIndex != -1){
        newWishListObj.wishlist.splice(productIndex, 1)
    } else {
        wishList && newWishListObj.wishlist.push({...productObj})
    }
    console.log(newWishListObj , productObj)
    
    await addProductToWishListHandler(newWishListObj)
}

function isProductInUserWishList(productId){
    let isProductInWishList = wishList?.some(product => product.id === productId)
    return isProductInWishList
}

function showUserBasket(){
    userBasketWrapper.innerHTML = ''
    let basketFragment = document.createDocumentFragment()
    let product = null
    let index = 1
    // We need a presentation to update the products when they change, and finally, after clicking on payment, we will merge the amount with the user's shopping cart.

    if(!userBasket.length){
        let basketEmptyMessage = document.getElementById('basketEmptyMessage')
        basketEmptyMessage.previousElementSibling.classList.add('hidden')
        basketEmptyMessage.classList.remove('hidden')
        basketEmptyMessage.classList.add('flex')
    } else {
        userBasket.forEach(targetProduct => {
            product = getProductObject(targetProduct.productId)

            let divElem = document.createElement('div')
            divElem.className = 'py-5 first:py-0 last:pb-0 flex gap-2 items-center rounded'
    
            let imageWrapper =document.createElement('div')
            imageWrapper.className = 'w-[30%] h-32 rounded overflow-hidden'
    
            let productImg = document.createElement('img')
            productImg.className = 'object-cover object-center'
            productImg.alt = 'Product Image'
            productImg.src = `./images/${product.imagePath}`
    
            let productDetailsWrapper =document.createElement('div')
            productDetailsWrapper.className = 'w-[50%] h-full flex flex-col items-start justify-start gap-2 font-semibold'
    
            let productName = document.createElement('h3')
            productName.className = 'text-gray-800 font-bold'
            productName.innerHTML = product.productName
    
            let btnsWrapper = document.createElement('div')
            btnsWrapper.className = 'flex flex-col items-start justify-center gap-[2px] sm:flex-row md:flex-col lg:flex-row'
    
            let addProductToWishListBtn = document.createElement('button')
            addProductToWishListBtn.className = 'group text-gray-700 text-sm flex items-center gap-1 hover:text-white hover:bg-gray-700 transition-colors duration-200 px-2 py-1 rounded'
            
            addProductToWishListBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-6 hover:scale-110 ${isProductInUserWishList(targetProduct.productId) ? 'stroke-white fill-red-600 group-hover:fill-white' : 'fill-white stroke-red-600  group-hover:fill-red-600'} group-hover:stroke-gray-700 transition-all duration-200 pointer-events-none">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg> ${isProductInUserWishList(targetProduct.productId) ? 'Remove From WishList' : 'Add To WishList'}`
    
            addProductToWishListBtn.addEventListener('click' , () => {
                addProductToWishList(getProductObject(targetProduct.productId))
            })

            let removeProductBtn = document.createElement('button')
            removeProductBtn.className = 'text-gray-700 text-sm flex items-center gap-1 hover:text-white hover:bg-red-700 transition-colors duration-200 px-2 py-1 rounded group'
            removeProductBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5 stroke-gray-700 group-hover:stroke-white transition-colors duration-200 pointer-events-none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Remove`

            removeProductBtn.addEventListener('click' , () => {
                removeProductFromBasket(getProductObject(targetProduct.productId).id)
            })
    
            let colorsWrapper = document.createElement('div')
            colorsWrapper.className = 'px-1 flex items-center gap-[10px]'
            colorsWrapper.id = 'basketProductColors'
    
            product.colors.split(' ').forEach(color => {
                colorsWrapper.insertAdjacentHTML('beforeend' , `<div>
                <input type="radio" id="${color}${index}" data-color="${color}" name="colors${index}" class="hidden" ${targetProduct.color == color ? 'checked>' : '>'}
                <label for="${color}${index}" class="inline-block w-3 h-3 rounded-full bg-${['black' , 'white'].includes(color) ? color : `${color}-500`} ring-0 ring-${['black' , 'white'].includes(color) ? color : `${color}-500`} ring-offset-2 ring-offset-${color == 'white' ? 'gray-500' : 'gray-200' } hover:scale-110 transition-all cursor-pointer"></label>
            </div>`)
            })
            index++
    
            colorsWrapper.querySelectorAll('input').forEach(input => {
                input.addEventListener('click' , e => {
                    changeProductColor(e , targetProduct.id)
                })
            })
    
            let priceWrapper =document.createElement('div')
            priceWrapper.className = 'ml-auto flex flex-col items-end justify-center gap-1 h-full'
            
            let productSizes = document.createElement('select')
            productSizes.className = 'w-20 py-1 px-2 bg-gray-200 rounded-md border border-gray-800 text-gray-800 cursor-pointer' 
            productSizes.innerHTML = product.sizes.split(' ').map(size => `<option value="${size}">${size}</option>`).join('')
            productSizes.value = targetProduct.size
            productSizes.addEventListener('input' , e => {
                changeProductSize(e , targetProduct.id)
            })
    
            let priceElem = document.createElement('h3')
            priceElem.className = 'text-gray-800 font-semibold text-xl tracking-wider'
            priceElem.innerHTML = `$${product.finalPrice}`
    
            let numberWrapper = document.createElement('div')
            numberWrapper.className = 'flex items-center gap-2'
    
            let minusBtn = document.createElement('button')
            minusBtn.id = 'decrease-count'
            minusBtn.className = 'group p-1 rounded border border-gray-400 hover:border-gray-200 hover:bg-gray-700 transition-all'
            minusBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 group-hover:text-white group-hover:stroke-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
            </svg>`
            minusBtn.addEventListener('click' , e => {
                changeProductCount(e , targetProduct.id)
            })
            
            let quantityElem = document.createElement('span')
            quantityElem.className = 'text-gray-700 font-semibold'
            quantityElem.innerHTML = targetProduct.quantity
            
            let plusBtn = document.createElement('button')
            plusBtn.id = 'increase-count'
            plusBtn.className = 'group p-1 rounded border border-gray-400 hover:border-gray-200 hover:bg-gray-700 transition-all'
            plusBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 group-hover:text-white group-hover:stroke-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>`
            plusBtn.addEventListener('click' , e => {
                changeProductCount(e , targetProduct.id)
            })
    
            imageWrapper.append(productImg)
            btnsWrapper.append(addProductToWishListBtn , removeProductBtn)
            productDetailsWrapper.append(productName ,  colorsWrapper , btnsWrapper)
            numberWrapper.append(minusBtn , quantityElem , plusBtn)
            priceWrapper.append(productSizes , priceElem , numberWrapper)
            divElem.append(imageWrapper , productDetailsWrapper , priceWrapper)
            basketFragment.append(divElem)
        })
        calcTotalPrice()
        userBasketWrapper.append(basketFragment)
    }
}

async function getUsersAndProductsDetailsHandler(){
    let locationSearch =location.search

    if(locationSearch){
        let tab = new URLSearchParams(locationSearch).get('t')
        
        if(tab != 'Basket'){
            return false
        }
        
        let activeTab = document.getElementById('Basket')
        activeTab.classList.remove('notActive')
        activeTab.previousElementSibling.classList.add('notActive')
        
        let activeMenu = document.getElementById('BasketMenu')
        activeMenu.classList.add('active')
        activeMenu.previousElementSibling.classList.remove('active')
        currentTab = 'Basket'
    }

    let userToken = getCookies()
    userObj = await isUserInUsers(userToken) 
    productsObj = await getProductsHandler()

    if(userObj){
        if(userObj?.role === 'user'){
            userBasket = userObj?.basket || []
            orders = userObj?.orders || []
            wishList = userObj?.wishlist || []
            // let purchasesTable = document.querySelector('#PurchasesTable') 
            showUserInfos(userObj)
            showUserBasket()
            showWishListProducts(userObj.wishlist)
        } else {
            location.href = 'http://127.0.0.1:5500/public/adminPanel.html'
        }
    } else {
        location.href = 'http://127.0.0.1:5500/public/index.html'
    }
}


function changeContent(e){
    let targetElem = e.target.tagName === 'path' ? e.target.parentNode.parentNode: e.target.tagName === 'svg' ? e.target.parentNode : e.target

    let prevActiveMenu = menu.querySelector(`.active`)
    prevActiveMenu.classList.remove('active')
    let targetMenu = menu.querySelector(`#${targetElem.dataset.target}Menu`)
    targetMenu.classList.add('active')

    content.firstElementChild.classList.add('notActive')
    let targetContent = content.querySelector(`#${targetElem.dataset.target}`) 
    targetContent.classList.remove('notActive')
    
    currentTab = targetElem.dataset.target
}

// events

deliveryRadioBtns.forEach(deliveryRadioBtn => {
    deliveryRadioBtn.addEventListener('click' , changeProductDelivery)
})

shortCutBtns.forEach(shortCutBtn => {
    shortCutBtn.addEventListener('click' , changeContent)
})


document.addEventListener('DOMContentLoaded' , getUsersAndProductsDetailsHandler)
countrySelectBox.addEventListener('input' , changeCityInputValue)
backToProgressBtn1.addEventListener('click' , changePurchaseProgress)
backToProgressBtn.addEventListener('click' , changePurchaseProgress)
payNowBtn.addEventListener('click' , changePurchaseProgress)
checkoutBtn.addEventListener('click' , changePurchaseProgress)
payOrderBtn.addEventListener('click' , payOrderHandler)
menuBtn.addEventListener('click' , toggleMenu)
menu.addEventListener('click' , changeMenu)