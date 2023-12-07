import apiData from './api.js'
import {isUserInUsers , getCookies} from './api.js'

let menu = document.getElementById('menu')
let menuBtn = document.getElementById('menu-btn')
let currentPage = document.getElementById('currentPage')
let content = document.getElementById('content')

let increaseCountBtns = document.querySelectorAll('#increase-count')
let decreaseCountBtns = document.querySelectorAll('#decrease-count')

// basket section
let progresses = document.querySelectorAll('#progress div')
let checkoutBtn = document.getElementById('checkoutBtn')
let payNowBtn = document.getElementById('payNowBtn')

let backToProgressBtn = document.getElementById('backToProgress1')
let backToProgressBtn1 = document.getElementById('backToProgress2')

let wishListWrapper = document.querySelector('#WishListProducts')
let userBasketWrapper = document.querySelector('.userBasketWrapper')


let shortCutBtns = document.querySelectorAll('.shortcut-btn')

let userObj = null
let productsObj = null
let targetElem = null
let currentTab = null
let currentProgress = 1


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
function changePurchaseProgress(e){
    let progressTarget = parseInt(e.target.dataset.target)

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

// progress 1 shopping cart

function changeProductCount(e){
    let targetElem = e.target.tagName === 'path' ? e.target.parentNode.parentNode: e.target.tagName === 'svg' ? e.target.parentNode : e.target

    let productCountElem = null

    if(targetElem.id === 'increase-count'){
        productCountElem = targetElem.previousElementSibling
        increaseProductCount(productCountElem)
    } else {
        productCountElem = targetElem.nextElementSibling
        decreaseProductCount(productCountElem)
    }
}

function increaseProductCount(countElem){
    let productCount = parseInt(countElem.innerHTML)
    
    countElem.innerHTML = productCount + 1
}

function decreaseProductCount(countElem){
    let productCount = parseInt(countElem.innerHTML)
    if(productCount == 1){
        return false
    }

    countElem.innerHTML -= 1
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

    if(!userObj.basket){
        basketShortCutTable.lastElementChild.classList.remove('hidden')
        basketShortCutTable.lastElementChild.classList.add('flex')
    } else {
        basketShortCutTable.lastElementChild.classList.remove('flex')
        basketShortCutTable.lastElementChild.classList.add('hidden')

        let userBasket = userObj.basket
        
        if(userBasket.length > 3){
            userBasket = userBasket.slice(0,3)
        }

        let targetProduct = null
        userBasket.forEach(product => {
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

function showWishListProducts(wishList){
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
                        <a  href="./product.html?p=1" class="inline-block py-2 px-4 text-white font-semibold bg-sky-500 hover:bg-sky-600 transition-colors rounded-md">Buy Now</a>
                    </div>
                </div>
            
                <div class="absolute ${product.discount ? '' : 'hidden'} left-0 top-0 bg-sky-500 text-white font-bold rounded-br-lg text-sm py-0.5 px-1.5">-%${product.discount} Off</div>
            </div>`)
        })
    }
}

function showUserBasket(basket){
    userBasketWrapper.innerHTML = ''
    let basketFragment = document.createDocumentFragment()
    let product = null
    let index = 1
    basket.forEach(targetProduct => {
        product = getProductObject(targetProduct.productId)

        let divElem = document.createElement('div')
        divElem.className = 'py-5 first:py-0 last:pb-0 flex gap-2 items-center rounded'

        
        let imageWrapper =document.createElement('div')
        imageWrapper.className = 'w-[20%] h-20 rounded overflow-hidden'

        let productImg = document.createElement('img')
        productImg.className = 'object-cover object-center'
        productImg.alt = 'Product Image'
        productImg.src = `./images/${product.imagePath}`

        let productDetailsWrapper =document.createElement('div')
        productDetailsWrapper.className = 'w-[60%] h-full flex flex-col items-start justify-between font-semibold'

        let productName = document.createElement('h3')
        productName.className = 'text-gray-800 font-bold'
        productName.innerHTML = product.productName

        let btnsWrapper = document.createElement('div')
        btnsWrapper.className = 'flex flex-col items-start justify-center gap-[2px] sm:flex-row md:flex-col lg:flex-row'

        let addProductToWishListBtn = document.createElement('button')
        addProductToWishListBtn.className = 'group text-gray-700 text-sm flex items-center gap-1  hover:text-white hover:bg-gray-700 transition-colors px-2 py-[2px] rounded-md'
        addProductToWishListBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5 group-hover:fill-red-500 group-hover:stroke-0 group-hover:scale-110 transition-all">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>                                              
        Add To WishList`

        let removeProductBtn = document.createElement('button')
        removeProductBtn.className = 'text-gray-700 text-sm flex items-center gap-1 hover:text-white hover:bg-gray-700 transition-colors px-2 py-[2px] rounded-md'
        removeProductBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        Remove`

        let priceWrapper =document.createElement('div')
        priceWrapper.className = 'ml-auto flex flex-col items-end justify-center gap-1 h-full'

        let priceElem = document.createElement('h3')
        priceElem.className = 'text-gray-800 font-semibold text-xl tracking-wider'
        priceElem.innerHTML = `$${product.finalPrice}`

        let colorsWrapper = document.createElement('div')
        colorsWrapper.className = 'flex items-center gap-[10px]'
        colorsWrapper.id = 'basketProductColors'

        
        product.colors.split(' ').forEach(color => {
            colorsWrapper.insertAdjacentHTML('beforeend' , `<div>
            <input type="radio" id="${color}${index}" name="colors${index}" class="hidden" ${targetProduct.color == color ? 'checked>' : '>'}
            <label for="${color}${index}" class="inline-block w-3 h-3 rounded-full bg-${['black' , 'white'].includes(color) ? color : `${color}-500`} ring-0 ring-${['black' , 'white'].includes(color) ? color : `${color}-500`} ring-offset-2 ring-offset-${color == 'white' ? 'gray-500' : 'gray-200' } hover:scale-110 transition-all cursor-pointer"></label>
        </div>`)
        })
        index++

        let numberWrapper = document.createElement('div')
        numberWrapper.className = 'flex items-center gap-2'

        let minusBtn = document.createElement('button')
        minusBtn.id = 'decrease-count'
        minusBtn.className = 'group p-1 rounded border border-gray-400 hover:border-gray-200 hover:bg-gray-700 transition-all'
        minusBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 group-hover:text-white group-hover:stroke-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
        </svg>`
        minusBtn.addEventListener('click' , changeProductCount)
        
        let quantityElem = document.createElement('span')
        quantityElem.className = 'text-gray-700 font-semibold'
        quantityElem.innerHTML = targetProduct.quantity
        
        let plusBtn = document.createElement('button')
        plusBtn.id = 'increase-count'
        plusBtn.className = 'group p-1 rounded border border-gray-400 hover:border-gray-200 hover:bg-gray-700 transition-all'
        plusBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 group-hover:text-white group-hover:stroke-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>`
        plusBtn.addEventListener('click' , changeProductCount)

        imageWrapper.append(productImg)
        btnsWrapper.append(addProductToWishListBtn , removeProductBtn)
        productDetailsWrapper.append(productName , btnsWrapper)
        numberWrapper.append(minusBtn , quantityElem , plusBtn)
        priceWrapper.append(priceElem , colorsWrapper , numberWrapper)
        divElem.append(imageWrapper , productDetailsWrapper , priceWrapper)
        basketFragment.append(divElem)
    })
    userBasketWrapper.append(basketFragment)
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
            // let purchasesTable = document.querySelector('#PurchasesTable') 
            showUserInfos(userObj)
            showUserBasket(userObj.basket)
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

increaseCountBtns.forEach(increaseCountBtn => {
    increaseCountBtn.addEventListener('click' , changeProductCount)
})

decreaseCountBtns.forEach(decreaseCountBtn => {
    decreaseCountBtn.addEventListener('click' , changeProductCount)
})

shortCutBtns.forEach(shortCutBtn => {
    shortCutBtn.addEventListener('click' , changeContent)
})

document.addEventListener('DOMContentLoaded' , getUsersAndProductsDetailsHandler)
backToProgressBtn1.addEventListener('click' , changePurchaseProgress)
backToProgressBtn.addEventListener('click' , changePurchaseProgress)
payNowBtn.addEventListener('click' , changePurchaseProgress)
checkoutBtn.addEventListener('click' , changePurchaseProgress)
menuBtn.addEventListener('click' , toggleMenu)
menu.addEventListener('click' , changeMenu)