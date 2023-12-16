import apiData from './api.js'
import {getUsersAndProductsHandler} from './api.js'


let hamburger = document.getElementById('hamburger-menu')
let menu = document.getElementById('menu')
let content = document.getElementById('content')
let closeModalBtn = document.getElementById('closeModalBtn')
let basketBtn = document.getElementById('basketBtn')
let basket = document.getElementById('basket')
let closeBasketBtn = document.getElementById('closeBasketBtn')
let navElems = document.querySelectorAll('nav ul')
let goToUpBtn = document.getElementById('gotoupBtn')
let groupBtn = document.querySelector('#groupBtn')
let sortBtn = document.querySelector('#sortBtn')
let groupWrapper = document.querySelector('#groupWrapper')
let sortWrapper = document.querySelector('#sortWrapper')
let searchInput = document.querySelector('#searchInput input')
let darkModeBtns = document.querySelectorAll('.darkmodeBtn')
let loader = document.querySelector('.loader-wrapper')

let productsWrapper = document.querySelector('#products')
let btnsWrapper = document.querySelector('#paginationBtnsWrapper')
let prevPageBtn = document.querySelector('#prevPageBtn')
let nextPageBtn = document.querySelector('#nextPageBtn')

let allProducts = null
let filteredProducts = null
let userBasket = []
let newWishListObj = {wishlist : []}
let newBasketObj = {basket : []}
let userObj = null
let wishList = []
let darkModeFlag = false

let rows = 5 , 
    startIndex = null , 
    endIndex = null , 
    currentPage = 1 ,
    btn = null ,
    prevBtn = null

function generateBtnsHandler(i){
    let btn = document.createElement('button')
    btn.className = '!px-2 py-1 text-gray-500 hover:text-white hover:bg-sky-400 transition-colors duration-200 cursor-pointer rounded text-lg'
    btn.innerHTML = i

    btn.addEventListener('click' , e => {
        prevBtn = btnsWrapper.querySelector('.active')
        prevBtn.classList.remove('active')
        e.target.classList.add('active')

        currentPage = parseInt(e.target.innerHTML)

        window.scrollTo(0,0)
        content.scrollTo(0,0)
        createProductsHandler(filteredProducts)
        setupPagination(filteredProducts , rows , btnsWrapper , currentPage)
    })

    if(i == currentPage){
        btn.classList.add('active')
    }

    return btn
}

function setupPagination(products , rows , pagesContainer , currentPage){
    let pagesCount = Math.ceil(products.length / rows)
    
    pagesContainer.innerHTML = ''
    
    for(let i = 1 ; i <= pagesCount ; i++){
        btn = generateBtnsHandler(i) 
        pagesContainer.append(btn)
    }

    if(currentPage == pagesCount){
        nextPageBtn.classList.add('hidden')
        prevPageBtn.classList.remove('hidden')
    } else if(currentPage == 1){
        prevPageBtn.classList.add('hidden')
        nextPageBtn.classList.remove('hidden')
    } else{
        prevPageBtn.classList.remove('hidden')
        nextPageBtn.classList.remove('hidden')
    }
}


function createProductsHandler(products){
    endIndex = currentPage * rows 
    startIndex = endIndex - rows
    let filteredProductsArray = null

    if(products.length <= rows){
        btnsWrapper.parentNode.classList.add('hidden')
        filteredProductsArray = [...products] 
    } else {
        btnsWrapper.parentNode.classList.remove('hidden')
        filteredProductsArray = products.slice(startIndex , endIndex) 
    }

    createProductsCardsHandler(filteredProductsArray)
    setupPagination(filteredProductsArray , rows , btnsWrapper , currentPage)
}

function changePageHandler(e){
    if(e.target.id == 'prevPageBtn'){
        currentPage -= 1
    } else {
        currentPage += 1
    }

    window.scrollTo(0,0)
    content.scrollTo(0,0)
    createProductsHandler(filteredProducts)
    setupPagination(filteredProducts , rows , btnsWrapper , currentPage)
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
            createProductsHandler(filteredProducts)
            setupPagination(filteredProducts , rows , btnsWrapper , currentPage)
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


function isProductExistInWishList(productObj){
    let productIndex = newWishListObj.wishlist.findIndex(product => JSON.stringify(product) == JSON.stringify(productObj))
    return productIndex  
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

function createProductsCardsHandler(products){
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
        let targetProductObj =  filteredProducts.find(product => product.id == productId)
        
        if(productId && targetProductObj){
            addProductToWishList(targetProductObj)
        }
    }))
}

async function getProductsHandler(productType){
    fetch(apiData.getProductsUrl , {
        headers : {
            'apikey' : apiData.getProductsApiKey ,
            'authorization' : apiData.authorization
        }
    })
    .then(res => res.json())
    .then(products => {
        products.sort((a , b) => a.id - b.id)

        allProducts = productType == 'all' ? products : products.filter(product => product.productCategory.toLowerCase() == productType)
        filteredProducts = allProducts

        createProductsHandler(allProducts)
        setupPagination(allProducts , rows , btnsWrapper , currentPage)
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

    let locationElems = new URLSearchParams(location.search)
    let productType = !locationElems.size ? 'all' : 
                    ['all' , 'men' , 'women' , 'kids'].includes(locationElems.get('t').toLowerCase()) ? locationElems.get('t').toLowerCase() : null


    groupBtn.querySelector('span').innerHTML = productType || 'All'

    let menuElems = null
    if(productType && productType != 'all'){
        menuElems = document.querySelectorAll(`.${productType.toLowerCase()}LiElem`)
    } else {
        menuElems = document.querySelectorAll('.allLiElem')
    }

    menuElems.forEach(menuElem => menuElem.classList.add('active'))

    userObj = await getUsersAndProductsHandler()
    if(userObj){
        wishList = userObj?.wishlist || []
        userBasket = userObj?.basket || []
        showUserBasket(userBasket)

    }
    
    await getProductsHandler(productType)

    loader.classList.add('fadeOut')
    setTimeout(() => {
        loader.classList.remove('flex')
        loader.classList.add('hidden')
    },1000)
}

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

function filterProductsHandler(filterValue){
    let filteredProductsArray = [...filteredProducts]
    
    if(filterValue === 'Default'){
        filteredProductsArray.sort((a , b) => a.id - b.id)
    } else if(filterValue == 'Cheapest'){
        filteredProductsArray.sort((a , b) => a.finalPrice - b.finalPrice)
    } else {
        filteredProductsArray.sort((a , b) => b.finalPrice - a.finalPrice)
    }

    createProductsHandler(filteredProductsArray)
    setupPagination(filteredProductsArray , rows , btnsWrapper , currentPage)
}

function filterProductsCategory(filterValue){
    history.pushState({} , '' , `?t=${filterValue}`)
    location.reload()
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

function toggleGroupWrapper(){
    let groupWrapperClass =  groupWrapper.className
    if(groupWrapperClass.includes('invisible')){
        groupWrapper.className = groupWrapperClass.replace('invisible' , 'visible')
    } else {
        groupWrapper.className = groupWrapperClass.replace('visible' , 'invisible')
    }
}

function filterGroupHandler(e){
    let filterValue = e.target.tagName == 'A' ? e.target.innerHTML : e.target.firstElementChild.innerHTML
    if(e.target.tagName === 'A' || e.target.tagName === 'LI'){
        groupBtn.firstElementChild.innerHTML =  filterValue
        filterProductsCategory(filterValue)
        toggleGroupWrapper()
    }
}

function filterSortHandler(e){
    let filterValue = e.target.tagName == 'A' ? e.target.innerHTML : e.target.firstElementChild.innerHTML
    if(e.target.tagName === 'A' || e.target.tagName === 'LI'){
        sortBtn.firstElementChild.innerHTML =  filterValue
        filterProductsHandler(filterValue)
        toggleSortWrapper()
    }
}

function toggleSortWrapper(){
    let sortWrapperClass  = sortWrapper.className
    if(sortWrapperClass.includes('invisible')){
        sortWrapper.className = sortWrapperClass.replace('invisible' , 'visible')
    } else {
        sortWrapper.className = sortWrapperClass.replace('visible' , 'invisible')
    }
}

// dark mode 
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

function searchProductHandler(e){
    let searchInputValue = e.target.value.trim().toLowerCase()
    // let filteredProducts = null

    if(searchInputValue){
        filteredProducts = allProducts.filter(product => product.productName.toLowerCase().startsWith(searchInputValue))
    } else {
        filteredProducts = allProducts
    }

    createProductsHandler(filteredProducts)
    setupPagination(filteredProducts , rows , btnsWrapper , currentPage)
}

// events

// when user click on darkness that placed in right of the menu menu must closed
document.addEventListener('click' , e => {
    if(e.target.id === 'menu-wrapper'){
        closeMenu()
    } else if(e.target.id === 'basket-wrapper'){
        closeBasket()
    }
})

document.addEventListener('DOMContentLoaded' , () => {
    let locationSearch = new URLSearchParams(location.search).get('t')
    if(!['men' , 'women' , 'kids'].includes(locationSearch)){
        history.back()
        return false  
    }
    document.title = `Shoe Store | ${locationSearch} Shoes`
    let menuElems = document.querySelectorAll(`#${locationSearch}`)
    menuElems.forEach(menu => menu.classList.add('active'))
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
prevPageBtn.addEventListener('click' , changePageHandler)
nextPageBtn.addEventListener('click' , changePageHandler)
searchInput.addEventListener('keyup' , searchProductHandler)
groupWrapper.addEventListener('click' , filterGroupHandler)
sortWrapper.addEventListener('click' , filterSortHandler)
groupBtn.addEventListener('click' , toggleGroupWrapper)
sortBtn.addEventListener('click' , toggleSortWrapper)
hamburger.addEventListener('click' , showMenu)
basketBtn.addEventListener('click' , showBasket)
closeModalBtn.addEventListener('click' , closeMenu)
closeBasketBtn.addEventListener('click', closeBasket)