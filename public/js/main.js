import apiData from './api.js'
import {getUsersAndProductsHandler , getCookies , isUserInUsers} from './api.js'

let hamburger = document.getElementById('hamburger-menu')
let menu = document.getElementById('menu')
let closeModalBtn = document.getElementById('closeModalBtn')
let basketBtn = document.getElementById('basketBtn')
let basket = document.getElementById('basket')
let closeBasketBtn = document.getElementById('closeBasketBtn')
let navElems = document.querySelectorAll('nav ul')
let goToUpBtn = document.getElementById('gotoupBtn')
let headersProductsWrapper = document.getElementById('mostDiscountProductsWrapper') 
let productsWrapper = document.getElementById('productsWrapper')
let sliderWrapper = document.getElementById('sliderWrapper')
let darkModeBtns = document.querySelectorAll('.darkmodeBtn')
let loader = document.querySelector('.loader-wrapper')


let userObj = null
let allProducts = null
let userBasket = null
let newBasketObj = {basket : []}
let newWishListObj = {wishlist : []}
let wishList = []
let darkModeFlag = false


async function addNewProductToBasketHandler(newBasketObj){
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
            getUserAndProductDetailsHandler()
            userBasket = newBasketObj.basket
            Swal.fire({
                icon: "success",
                title: `product was removed from your basket`,
                showConfirmButton: false,
                timer: 2000
            })
            showBasket()
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
    newBasketObj.basket = userBasket.filter(product => product.id !== productId)
    addNewProductToBasketHandler(newBasketObj)
}

function showUserBasket(userBasket){
    let basketProductWrapper = document.querySelector('#basket-wrapper #basketProductsWrapper')
    let totalPriceElem = document.querySelector('#totalPrice')
    let basketFragment = document.createDocumentFragment()

    basketProductWrapper.innerHTML = ''
    userBasket.forEach(product => {
        let liElem = document.createElement('li')
        liElem.className = 'flex items-center justify-between gap-2 py-2 border-b border-gray-200 max-h-[9rem]'

        let imageWrapper = document.createElement('div')
        imageWrapper.className = 'w-1/5 rounded-lg overflow-hidden max-h-[8rem]'

        let imgElem = document.createElement('img')
        imgElem.className = 'object-cover'
        imgElem.src = `./images/${product.productImagePath}`
        imgElem.alt = 'Product Image'        
        
        let detailsWrapper = document.createElement('div')
        detailsWrapper.className = 'w-2/5 flex flex-col items-start gap-2'

        let productNameElem = document.createElement('h4')
        productNameElem.className = 'font-bold dark:text-white'
        productNameElem.innerHTML = product.productName
        
        let productDetailsElem = document.createElement('div')
        productDetailsElem.className = 'flex flex-col items-start gap-1 md:flex-row md:items-center'
        
        let sizeDetail = document.createElement('span')
        sizeDetail.className = 'text-gray-700 dark:text-white dark:text-white font-semibold text-sm'
        sizeDetail.innerHTML = `Size : ${product.size}`

        let colorDetail = document.createElement('span')
        colorDetail.className = 'text-gray-700 dark:text-white font-semibold text-sm'
        colorDetail.innerHTML = `Color : <span class="inline-block w-2 h-2 rounded-full bg-${product.color}-500"></span>`

        let productPriceWrapper = document.createElement('div')
        productPriceWrapper.className = 'w-1/5 flex flex-col justify-between gap-2 ml-auto'
        
        let priceElem = document.createElement('span')
        priceElem.className = 'text-gray-900 dark:text-white font-bold text-center'
        priceElem.innerHTML = `$${product.finalPrice}`

        let quantityDetail = document.createElement('span')
        quantityDetail.className = 'text-gray-700 dark:text-white font-semibold text-sm text-center'
        quantityDetail.innerHTML = `Quantity : ${product.quantity}`
        
        let productRemoveBtn = document.createElement('button')
        productRemoveBtn.className = 'bg-red-500 hover:bg-red-600 transition py-px px-[2px] rounded-md text-white font-semibold'
        productRemoveBtn.innerHTML = 'Remove'
        
        productRemoveBtn.addEventListener('click' , e => {
            removeProductFromBasket(product.id)
        })

        imageWrapper.append(imgElem)
        productDetailsElem.append(sizeDetail , colorDetail)
        detailsWrapper.append(productNameElem , productDetailsElem)
        productPriceWrapper.append(quantityDetail , priceElem , productRemoveBtn)
        liElem.append(imageWrapper , detailsWrapper , productPriceWrapper)
        basketFragment.append(liElem)
    })
    basketProductWrapper.append(basketFragment)
    totalPriceElem.innerHTML = `$${userBasket.reduce((sum , current) => sum + (current.quantity * current.finalPrice) , 0)}`
}


function isProductExistInWishList(productObj){
    let productIndex = newWishListObj.wishlist.findIndex(product => JSON.stringify(product) == JSON.stringify(productObj))
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
            getProductsHandler()
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
    
    await addProductToWishListHandler(newWishListObj)
}

function isProductInUserWishList(productId){
    let isProductInWishList = wishList?.some(product => product.id === productId)
    return isProductInWishList
}

function createHeaderProducts(products){
    headersProductsWrapper.innerHTML = ''
    let averageRating = null
    products.forEach(product => {
        averageRating = product.reviews?.length ? Math.round(product.reviews.reduce((sum , current) => sum + current.starNumbers , 0) / product.reviews?.length) : 0
        headersProductsWrapper.insertAdjacentHTML('beforeend' , `<div class="relative w-full xl:w-1/2 h-28 max-h-[8rem] p-1 flex items-center gap-4 bg-gray-100 dark:bg-slate-700 rounded-lg shadow group hover:-translate-y-2 transition-transform duration-300 overflow-hidden">
        <div class="w-2/5 h-full rounded-md overflow-hidden object-contain">
            <img src="./images/${product.imagePath}" alt="Product image" class="object-cover object-center group-hover:scale-125 group-hover:rotate-12 duration-300">
        </div>
        <div class="w-full h-full flex flex-col justify-between gap-1 p-1">
            <div class="flex flex-col">
                <h4 class="font-bold text-gray-700 dark:text-white text-left">${product.productName}</h4>
                <div class="flex items-center space-x-[2px]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0" stroke="currentColor" class="w-6 h-6 fill-yellow-400 stroke-yellow-400 dark:fill-yellow-500 dark:stroke-yellow-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="${averageRating >= 2 ? '0' : '1'}" stroke="currentColor" class="w-6 h-6 ${averageRating >= 2 ? 'fill-yellow-400 dark:fill-yellow-500' : ''} stroke-yellow-400 dark:stroke-yellow-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="${averageRating >= 3 ? '0' : '1'}" stroke="currentColor" class="w-6 h-6 ${averageRating >= 3 ? 'fill-yellow-400 dark:fill-yellow-500' : ''} stroke-yellow-400 dark:stroke-yellow-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="${averageRating >= 4 ? '0' : '1'}" stroke="currentColor" class="w-6 h-6 ${averageRating >= 4 ? 'fill-yellow-400 dark:fill-yellow-500' : ''} stroke-yellow-400 dark:stroke-yellow-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="${averageRating == 5 ? '0' : '1'}" stroke="currentColor" class="w-6 h-6 ${averageRating == 5 ? 'fill-yellow-400 dark:fill-yellow-500' : ''} stroke-yellow-400 dark:stroke-yellow-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                </div>
            </div>
            <div class="w-full  flex items-center justify-between pb-1">
                <span class="font-bold text-gray-700 dark:text-white"><span class="line-through decoration-gray-400 text-gray-400">$${product.price}</span> $${product.finalPrice}</span>
                <a href="./product.html?p=${product.id}" class="inline-block bg-secondary hover:scale-110 transition-transform p-[2px] rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 stroke-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                </a>
            </div>
        </div>
        <div class="absolute right-0 top-0 bg-sky-700 text-white dar:text-slate-800 font-bold rounded-bl-lg text-sm py-0.5 px-1.5">-%${product.discount} Off</div>
    </div>`)
    })

}

function createSliderProducts(products){
    sliderWrapper.innerHTML = ''
    products.forEach(product => {
        sliderWrapper.insertAdjacentHTML('beforeend' , `<div class="swiper-slide relative p-1 hover:-translate-y-5 transition-transform ease-in-out duration-200 rounded-lg bg-gray-200 dark:bg-slate-700 flex flex-col gap-7 select-none overflow-hidden group">
        <span class="z-20 py-1 px-2 absolute top-0 left-0 rounded-br-md bg-primary text-xs font-semibold hidden">-<span></span>Off</span>
        <div class="relative w-full !h-72 overflow-hidden rounded-md">
            <img src="./images/${product.imagePath}" class="object-cover group-hover:scale-150 group-hover:rotate-12 transition-transform duration-200" alt="Product Image">

            <button data-targetId="${product.id}" class="p-1 absolute top-1 right-1 bg-white dark:bg-slate-800 rounded-full hover:scale-110 transition-transform group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-6 hover:scale-110 ${isProductInUserWishList(product.id) ? 'stroke-white dark:stroke-red-500 fill-red-600 dark:fill-red-500 group-hover:fill-white group-hover:stroke-red-600  dark:group-hover:stroke-white' : 'fill-white stroke-red-600 dark:stroke-white group-hover:stroke-white group-hover:fill-red-600 dark:group-hover:stroke-red-500'}  transition-all">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>                              
            </button>
        </div>

        <div class="space-y-2 py-1 px-2">
            <div class="space-y-[2px]">
                <h3 class="font-bold text-gray-800 dark:text-white">${product.productName}</h3>
                <p class="text-gray-400">${product.productSummary}</p>
            </div>

            <div class="w-full flex justify-between items-center">
                <div class="font-bold text-gray-800 dark:text-white"><span class="line-through decoration-gray-400 text-gray-400 ${product.discount ? '' : 'hidden'}">$${product.price}</span> $${product.finalPrice}</div>
                <a  href="./product.html?p=${product.id}" class="inline-block py-2 px-4 text-white dark:text-slate-800 font-semibold bg-sky-500 hover:bg-sky-600 transition-colors rounded-md">Buy Now</a>
            </div>
        </div>

        <div class="absolute ${product.discount ? '' : 'hidden'} left-0 top-0 bg-sky-500 text-white dark:text-slate-800 font-bold rounded-br-lg text-sm py-0.5 px-1.5">-%${product.discount} Off</div>
    </div>`)
    })

    let productBtns = sliderWrapper.querySelectorAll('button')

    productBtns.forEach(productBtn => productBtn.addEventListener('click' , e => {
        let targetElem = e.target.tagName == 'path' ? e.target.parentNode.parentNode : e.target.tagName == 'svg' ? e.target.parentNode : e.target 
        let productId = targetElem.dataset?.targetid
        let targetProductObj =  products.find(product => product.id == productId)
        
        if(productId && targetProductObj){
            addProductToWishList(targetProductObj)
        }
    }))

    let swiperSlider = new Swiper('.swiper' , {
        loop : true,
        slidePerView : 3,
        fade : true ,
        spaceBetween : 10,
        autoplay: {
            delay: 2500,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
         },
        breakpoints : {
            0 : {
                slidesPerView : 1,  
            },
            480 : {
                slidesPerView : 2 ,
            },
            768 : {
                slidesPerView : 3 ,
            } 
        }
    })
}

function createProducts(products){
    productsWrapper.innerHTML = ''
    products.forEach(product => {
        productsWrapper.insertAdjacentHTML('beforeend' , `<div class="relative p-1 hover:-translate-y-5 transition-transform ease-in-out duration-200 rounded-lg bg-gray-200 dark:bg-slate-700 flex flex-col gap-7 select-none overflow-hidden group">
        <div class="relative w-full !h-72 overflow-hidden rounded-md">
            <img src="./images/${product.imagePath}" class="object-cover group-hover:scale-150 group-hover:rotate-12 transition-transform duration-200" alt="Product Image">

            <button data-targetId="${product.id}" class="p-1 absolute top-1 right-1 bg-white dark:bg-slate-800 rounded-full hover:scale-110 transition-transform group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-6 hover:scale-110 ${isProductInUserWishList(product.id) ? 'stroke-white dark:stroke-red-500 fill-red-600 dark:fill-red-500 group-hover:fill-white group-hover:stroke-red-600  dark:group-hover:stroke-white' : 'fill-white stroke-red-600 dark:stroke-white group-hover:stroke-white group-hover:fill-red-600 dark:group-hover:stroke-red-500'}  transition-all">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>                             
            </button>
        </div>

        <div class="space-y-2 py-1 px-2">
            <div class="space-y-[2px]">
                <h3 class="font-bold text-gray-800 dark:text-white">${product.productName}</h3>
                <p class="text-gray-400">${product.productSummary}</p>
            </div>

            <div class="w-full flex justify-between items-center">
                <div class="font-bold text-gray-800 dark:text-white"><span class="line-through decoration-gray-400 text-gray-400 ${product.discount ? '' : 'hidden'}">$${product.price}</span> $${product.finalPrice}</div>
                <a  href="./product.html?p=${product.id}" class="inline-block py-2 px-4 text-white dark:text-slate-800 font-semibold bg-sky-500 hover:bg-sky-600 transition-colors rounded-md">Buy Now</a>
            </div>
        </div>

        <div class="absolute ${product.discount ? '' : 'hidden'} left-0 top-0 bg-sky-500 text-white dark:text-slate-800 font-bold rounded-br-lg text-sm py-0.5 px-1.5">-%${product.discount} Off</div>
    </div>`)
    })

    let productBtns = productsWrapper.querySelectorAll('button')

    productBtns.forEach(productBtn => productBtn.addEventListener('click' , e => {
        let targetElem = e.target.tagName == 'path' ? e.target.parentNode.parentNode : e.target.tagName == 'svg' ? e.target.parentNode : e.target 
        let productId = targetElem.dataset?.targetid
        let targetProductObj =  products.find(product => product.id == productId)
        
        if(productId && targetProductObj){
            addProductToWishList(targetProductObj)
        }
    }))
}

function createProductsHandler(products){
    let filteredByDiscountProducts = products.filter(product => product.discount > 0).sort((a , b) => b.discount - a.discount)
    let filteredByOrderNumbers = products.slice().sort((a , b) => b.orderNumbers - a.orderNumbers)
    // We need two of our most discounted products to be displayed in the header, which are provided by two EL indexes
    createHeaderProducts(filteredByDiscountProducts.slice(0,2))
    createSliderProducts([...products.reverse().slice(0, 7)])
    createProducts(filteredByOrderNumbers.slice(0,6))
}

async function getProductsHandler(){
    fetch(apiData.getProductsUrl , {
        headers : {
            'apikey' : apiData.getProductsApiKey ,
            'authorization' : apiData.authorization
        }
    })
    .then(res => res.json())
    .then(products => {
        products.sort((a , b) => a.id - b.id)

        allProducts = products

        createProductsHandler(allProducts)
    })
    .catch(err => {
        console.log(err)
        Swal.fire({
            icon: "error",
            title: `Error`,
            text: "Something went wrong! please try again later",
            timer: 3000
        });    
    })
}

async function getUserAndProductDetailsHandler(){
    darkModeFlag = localStorage.getItem('theme') == 'dark' ? true : false
    
    if(darkModeFlag){
        document.documentElement.classList.add('dark')

        darkModeBtns.forEach(darkModeBtn => {
            darkModeBtn.firstElementChild.classList.add('hidden')
            darkModeBtn.lastElementChild.classList.remove('hidden')
        })
    }
    
    userObj = await getUsersAndProductsHandler()
    await getProductsHandler()
    
    userBasket = userObj?.basket || []
    wishList = userObj?.wishlist || []

    showUserBasket(userBasket)

    loader.classList.add('fadeOut')
    setTimeout(() => {
        loader.classList.remove('flex')
        loader.classList.add('hidden')
    },1000)
}

const showMenu = () => {
    let menuClass = menu.className
    menu.parentNode.className = menu.parentNode.className.replace('invisible' , 'visible')
    menu.parentNode.className = menu.parentNode.className.replace('z-0' , 'z-20')
    menu.className = menuClass.replace('-translate-x-full' , 'translate-x-0')
    menu.parentNode.className = menu.parentNode.className.replace('bg-black/0' , 'bg-black/50') 
}

const closeMenu =  () => {
    let menuClass = menu.className
    menu.className = menuClass.replace('translate-x-0' , '-translate-x-full')
    menu.parentNode.className = menu.parentNode.className.replace('bg-black/50' , 'bg-black/0') 
    setTimeout(() => {
        menu.parentNode.className = menu.parentNode.className.replace('visible' , 'invisible')
        menu.parentNode.className = menu.parentNode.className.replace('z-20' , 'z-0')
    } , 500)
}

const showBasket = () => {
    let basketClass = basket.className
    basket.parentNode.className = basket.parentNode.className.replace('invisible' , 'visible')
    basket.parentNode.className = basket.parentNode.className.replace('-z-10' , 'z-20')
    basket.className = basketClass.replace('-translate-x-full' , 'translate-x-0')
    basket.parentNode.className = basket.parentNode.className.replace('bg-black/0' , 'bg-black/50') 
}

const closeBasket =  () => {
    let basketClass = basket.className
    basket.className = basketClass.replace('translate-x-0' , '-translate-x-full')
    basket.parentNode.className = basket.parentNode.className.replace('bg-black/50' , 'bg-black/0') 
    setTimeout(() => {
        if(!basket.parentNode.className.includes('invisible')){
            basket.parentNode.className = basket.parentNode.className.replace('visible' , 'invisible')
        }
        basket.parentNode.className = basket.parentNode.className.replace('z-20' , '-z-10')
    } , 500)
}


function changeThemeHandler(e){
    document.documentElement.classList.toggle('dark')

    darkModeFlag = document.documentElement.className.includes('dark') ? true : false


    if(darkModeFlag){
        e.target.firstElementChild.classList.add('hidden')
        e.target.lastElementChild.classList.remove('hidden')
    } else {
        e.target.lastElementChild.classList.add('hidden')
        e.target.firstElementChild.classList.remove('hidden')
    }

    localStorage.setItem('theme' , darkModeFlag ? 'dark' : 'light')
}

// changing root and active class to Element
const changeRoot = e => {
    if(e.target.tagName == "A"){
        let prevLink = e.target.parentNode.parentNode.querySelector('.active')
        prevLink.classList.remove('active')
        e.target.parentNode.classList.add('active')
    }
}

// when user click on darkness that placed in right of the menu menu must closed
document.addEventListener('click' , e => {
    if(e.target.id === 'menu-wrapper'){
        closeMenu()
    } else if(e.target.id === 'basket-wrapper'){
        closeBasket()
    }
})

goToUpBtn.addEventListener('click' , () => {
    window.scrollTo(0,0)
})


navElems.forEach(nav => {
    nav.addEventListener('click' , changeRoot)
})

darkModeBtns.forEach(darkModeBtn => {
    darkModeBtn.addEventListener('click' , changeThemeHandler)
})

document.addEventListener('DOMContentLoaded' , getUserAndProductDetailsHandler)
hamburger.addEventListener('click' , showMenu)
basketBtn.addEventListener('click' , showBasket)
closeModalBtn.addEventListener('click' , closeMenu)
closeBasketBtn.addEventListener('click', closeBasket)