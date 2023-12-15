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
let loader = document.querySelector('.loader-wrapper')
 
let backToProgressBtn = document.getElementById('backToProgress1')
let backToProgressBtn1 = document.getElementById('backToProgress2')

let wishListWrapper = document.querySelector('#WishListProducts')
let userBasketWrapper = document.querySelector('.userBasketWrapper')

let countrySelectBox = document.querySelector('#countrySelectBox')
let citySelectBox = document.querySelector('#citySelectBox')
let deliveryRadioBtns = document.querySelectorAll('#progress2 input[type="radio"]')

let searchInputs = document.querySelectorAll('.searchInput')
let shortCutBtns = document.querySelectorAll('.shortcut-btn')

let logoutModal = document.getElementById('logoutModal')
let logoutBtn = document.querySelector('#logoutModal #logoutBtn')
let showLogoutModalBtn = document.querySelector('#logout-btn')

let countryObj = {
    Iran : ['Tehran' , 'Isfahan' , 'Ahwaz' , 'Shiraz'],
    USA : ['NewYork' , 'Chicago' , 'LosAngeles' , 'Texas'],
    Germany : ['Berlin' , 'Munich' , 'Frankfort'],
    Britain : ['London' , 'Manchester'],
}

let month = ['Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec']

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
let filteredWishList = null

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
        this.date = getDate()
        this.subtotal = subtotal
        this.tax = tax
        this.finalPrice = finalPrice
    }
}

function getDate(){
    let now  = new Date()
    return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
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

    if(targetElem.id == 'logout-btn'){
        showLogoutModalHandler()
    } else {
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

function showOrderDetailsHandler(orderObj){
    window.scrollTo(0,0)
    content.scrollTo(0,0)

    let orderDetailWrapper = document.querySelector('#ordersDetailWrapper')
    
    orderDetailWrapper.nextElementSibling.classList.add('hidden')
    orderDetailWrapper.classList.remove('hidden')
    orderDetailWrapper.classList.add('flex')

    let orderProductsWrapper = orderDetailWrapper.querySelector('.orderProductsWrapper')
    let orderIdDetail = orderDetailWrapper.querySelector('.orderIdDetail')
    let orderCustomerFullNameDetail = orderDetailWrapper.querySelector('.orderCustomerFullNameDetail')
    let numberOfProductsDetail = orderDetailWrapper.querySelector('.numberOfProductsDetail')
    let orderDateDetail = orderDetailWrapper.querySelector('.orderDateDetail')
    let orderPhoneNumberDetail = orderDetailWrapper.querySelector('.orderPhoneNumberDetail')
    let orderCountryAndCityDetail = orderDetailWrapper.querySelector('.orderCountryAndCityDetail')
    let orderPostalCodeDetail = orderDetailWrapper.querySelector('.orderPostalCodeDetail')
    let orderDeliveryDetail = orderDetailWrapper.querySelector('.orderDeliveryDetail')
    let orderAddressDetail = orderDetailWrapper.querySelector('.orderAddressDetail')
    let orderDescDetail = orderDetailWrapper.querySelector('.orderDescDetail')
    let orderSubtotalPriceDetail = orderDetailWrapper.querySelector('.orderSubtotalPriceDetail')
    let orderTaxDetail = orderDetailWrapper.querySelector('.orderTaxDetail')
    let totalPriceOrderDetail = orderDetailWrapper.querySelector('.totalPriceOrderDetail')

    let orderedProducts = orderObj.products
    
    orderProductsWrapper.innerHTML = ''
    orderedProducts.forEach(product => {
        orderProductsWrapper.insertAdjacentHTML('beforeend' , `<div class="flex items-start justify-between gap-1">
        <div class="flex gap-2 w-2/3">
            <div class="relative w-[30%] h-20 overflow-hidden rounded-md md:w-[25%] md:h-28">
                <img src="./images/${product.productImagePath}" class="object-cover object-center" alt="Product Image">
                <span class="${product.productDiscount? '' : 'hidden'} absolute top-0 left-0 bg-blue-500 text-white font-bold rounded-br-md py-0.5 px-1 text-xs sm:text-sm">-%<span>${product.productDiscount}</span> Off</span>
            </div>
            <div class="flex flex-col gap-1">
                <h3 class="text-gray-800 font-bold text-sm md:text-base">${product.productName}</h3>
                <div class="flex items-center gap-1 text-gray-500 font-semibold text-sm md:text-base">
                    <h3>Size : </h3>
                    <span>${product.size}</span>
                </div>
                
                <div class="flex items-center gap-1 text-gray-500 font-semibold text-sm md:text-base">Color :
                    <span class="inline-block w-2 h-2 rounded-full bg-${['black' , 'white'].includes(product.color) ? product.color : `${product.color}-500`} ${product.color == 'white' ? 'border border-gray-400' : ''}"></span>
                </div>
            </div>
        </div>
        
        <div class="flex flex-col items-end gap-1">
            <h3 class="text-gray-800 font-semibold tracking-wider text-base md:text-lg"><span class="${product.productDiscount ? '' : 'hidden'} line-through decoration-gray-400 text-gray-400">$${product.productPrice}</span> $${product.finalPrice}</h3>
            <span class="flex items-center gap-1 text-gray-500 font-semibold">Quantity : 
                <span id="quantity">${product.quantity}</span>
            </span>
        </div>
        
    </div>`)
    })

    orderIdDetail.firstElementChild.innerHTML = `${orderObj.orderId}`
    numberOfProductsDetail.innerHTML = `${orderObj.products.length}`
    orderCustomerFullNameDetail.innerHTML = orderObj.fullName
    orderDateDetail.innerHTML = `${orderObj.date}`
    orderPhoneNumberDetail.innerHTML = `${orderObj.phoneNumber}`
    orderCountryAndCityDetail.firstElementChild.innerHTML = `${orderObj.country}`
    orderCountryAndCityDetail.lastElementChild.innerHTML = `${orderObj.city}`
    orderPostalCodeDetail.innerHTML = `${orderObj.postalCode}`
    orderDeliveryDetail.innerHTML = `${orderObj.delivery == 7 ? 'Standard - ' : 'Fast - '}${orderObj.delivery.toFixed(2)}`
    orderAddressDetail.innerHTML = `${orderObj.address}`
    orderDescDetail.innerHTML = `${orderObj.description}`
    orderSubtotalPriceDetail.innerHTML = `$${orderObj.subtotal.toFixed(1)}`
    orderTaxDetail.innerHTML = `$${orderObj.tax.toFixed(1)}`
    totalPriceOrderDetail.innerHTML = `$${orderObj.finalPrice.toFixed(1)}`
}


function showUserOrdersHandler(orders){
    let ordersTable = document.querySelector('#ordersTable')
    let userTableMessage = ordersTable.parentNode.nextElementSibling 
    if(!orders.length){
        userTableMessage.classList.remove('hidden')
        userTableMessage.classList.add('inline-block')
    } else {
        userTableMessage.classList.remove('inline-block')
        userTableMessage.classList.add('hidden')
        
        ordersTable.innerHTML = ''
        orders.forEach(order => {
            ordersTable.insertAdjacentHTML('beforeend' , `<tr class="even:bg-white odd:bg-gray-100 hover:bg-gray-200 transition-colors">
                <td class="orderId px-[2px] text-center text-gray-500">#${order.orderId}</td>
                <td class="text-center text-gray-800">${order.products.length}</td>
                <td class="px-[2px] text-center text-gray-800">${order.fullName}</td>
                <td class="CustomerId px-[2px] text-center text-gray-800">$${order.finalPrice}</td>
                <td class="px-[2px] text-center text-gray-800">${order.date}</td>
                <td class="text-center">
                    <button data-target="${order.orderId}" class="showOrderDetailsBtn w-full py-1 px-2 rounded-md  text-sky-500 hover:bg-sky-500 hover:text-white transition-colors font-bold text-center cursor-pointer">View</button>
                </td>
            </tr>`)
        })

        let viewOrderBtns = document.querySelectorAll('.showOrderDetailsBtn')
        viewOrderBtns.forEach(viewOrderBtn => {
            viewOrderBtn.addEventListener('click', e => {
                let targetOrderId = e.target.dataset?.target
                let orderObj = orders.find(order => order.orderId == targetOrderId)
                if(orderObj){
                    showOrderDetailsHandler(orderObj)
                }
            })
        })

    }
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
                title: `Order Was Added To Orders`,
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
    showUserOrdersHandler(newOrder)
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

function getShortDate(date){
    let orderMonth = parseInt(date.split('/')[1])
    return `${date.split('/')[0]} ${month[orderMonth - 1]}`
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

        orders.forEach(order => {
            purchasesShortCutTable.insertAdjacentHTML('beforeend' , `<div class="flex items-center justify-between  bg-gray-100 even:bg-white px-1  rounded lg:py-2 lg:px-4">
            <span class="text-gray-800 rounded font-semibold lg:text-lg">${order.orderId}</span>
            <span class="text-gray-800 rounded font-semibold lg:text-lg">${order.products.length}</span>
            <span class="text-gray-800 rounded font-semibold lg:text-lg">$${order.finalPrice}</span>
            <span class="text-gray-800 rounded font-semibold lg:text-lg">${getShortDate(order.date)}</span>
        </div>`)
        })
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
    if(!filteredWishList){
        wishListWrapper.nextElementSibling.classList.remove('hidden')
        wishListWrapper.nextElementSibling.classList.add('flex')
    } else {
        wishListWrapper.innerHTML = ''
        filteredWishList.forEach(product => {
            wishListWrapper.insertAdjacentHTML('beforeend' , `<div class="product relative p-1 hover:-translate-y-5 transition-transform ease-in-out duration-200 rounded-lg bg-white flex flex-col gap-1 select-none overflow-hidden group">
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
                        <h3 class="productName font-bold text-gray-800">${product.productName}</h3>
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
    let productIndex = filteredWishList.findIndex(product => JSON.stringify(product) == JSON.stringify(productObj))
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
            searchProductHandler(searchInputs[1].value.trim())
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
            filteredWishList = [...wishList]
            // let purchasesTable = document.querySelector('#PurchasesTable') 
            showUserInfos(userObj)
            showUserBasket()
            showUserOrdersHandler(orders)
            showWishListProducts(userObj.wishlist)
        } else {
            location.href = 'http://127.0.0.1:5500/public/adminPanel.html'
        }
    } else {
        location.href = 'http://127.0.0.1:5500/public/index.html'
    }

    loader.classList.add('fadeOut')
    setTimeout(() => {
        loader.classList.remove('flex')
        loader.classList.add('hidden')
    },1000)
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

function searchHandler(e){
    let searchValue = e.target.value.trim()
    let searchTarget = e.target.dataset.searchtarget
    if(searchTarget == 'orderId'){
        searchOrderHandler(searchValue)
    } else {
        searchProductHandler(searchValue)
    }
}

function searchOrderHandler(searchValue){
    let targetTable = document.getElementById(`ordersTable`)
    if(searchValue){
        let searchTargetElem = null
        targetTable.classList.add('searched')

        searchValue = searchValue.startsWith('#') ? searchValue : '#' + searchValue

        let trElems = targetTable.querySelectorAll('tr')
        trElems.forEach(trElem => {
            searchTargetElem = trElem.querySelector('.orderId')
            if(searchTargetElem.innerHTML.toLowerCase().startsWith(searchValue.toLowerCase())){
                trElem.style.display = 'table-row'
            } else {
                trElem.style.display = 'none'
            }
        })
    } else {
        targetTable.classList.remove('searched')

        let trElems = targetTable.querySelectorAll('tr')
        trElems.forEach(trElem => {
            trElem.style.display = 'table-row'
        })
    }
}

function searchProductHandler(searchValue){
    if(searchValue){
        filteredWishList = wishList.filter(product => product.productName.toLowerCase().startsWith(searchValue.toLowerCase()))
    } else {
        filteredWishList = [...wishList]
    }

    showWishListProducts()
}

function closeLogoutModalHandler(){
    let modalWrapperClass = logoutModal.className
    let modalClass = logoutModal.firstElementChild.className
    
    modalWrapperClass = modalWrapperClass.replace('z-30' , '-z-10')
    modalWrapperClass = modalWrapperClass.replace('bg-black/50' , 'bg-black/0')
    
    modalClass = modalClass.replace('opacity-100' , 'opacity-0')
    
    logoutModal.className = modalWrapperClass
    logoutModal.firstElementChild.className = modalClass 
}

function showLogoutModalHandler(){
    let modalWrapperClass = logoutModal.className
    let modalClass = logoutModal.firstElementChild.className

    modalWrapperClass = modalWrapperClass.replace('-z-10' , 'z-30')
    modalWrapperClass = modalWrapperClass.replace('bg-black/0' , 'bg-black/50')
    
    modalClass = modalClass.replace('opacity-0' , 'opacity-100')
    
    logoutModal.className = modalWrapperClass
    logoutModal.firstElementChild.className = modalClass
}

function logoutUserHandler(){
    let cookieValue = `${userObj.id}-${userObj.userName}`
    let now = new Date()

    now.setTime(now.getTime() - (2 * 24 * 60 * 60 * 1000))

    console.log(cookieValue , now)
    document.cookie = `userToken=${cookieValue};path=/;Expires='${now}`
    location.reload() 
}

// events

deliveryRadioBtns.forEach(deliveryRadioBtn => {
    deliveryRadioBtn.addEventListener('click' , changeProductDelivery)
})

shortCutBtns.forEach(shortCutBtn => {
    shortCutBtn.addEventListener('click' , changeContent)
})

searchInputs.forEach(searchInput => {
    searchInput.addEventListener('keyup' , searchHandler)
})

logoutModal.addEventListener('click' , e => {
    if(e.target.id === 'logoutModal' || e.target.id === 'closeLogoutModalBtn'){
        closeLogoutModalHandler()
    }
})

document.addEventListener('DOMContentLoaded' , getUsersAndProductsDetailsHandler)
logoutBtn.addEventListener('click' , logoutUserHandler)
countrySelectBox.addEventListener('input' , changeCityInputValue)
backToProgressBtn1.addEventListener('click' , changePurchaseProgress)
backToProgressBtn.addEventListener('click' , changePurchaseProgress)
payNowBtn.addEventListener('click' , changePurchaseProgress)
checkoutBtn.addEventListener('click' , changePurchaseProgress)
payOrderBtn.addEventListener('click' , payOrderHandler)
menuBtn.addEventListener('click' , toggleMenu)
menu.addEventListener('click' , changeMenu)