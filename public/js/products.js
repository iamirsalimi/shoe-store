import apiData from './api.js'
import {getUsersAndProductsHandler , getCookies , isUserInUsers} from './api.js'


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

let productsWrapper = document.querySelector('#products')
let btnsWrapper = document.querySelector('#paginationBtnsWrapper')
let prevPageBtn = document.querySelector('#prevPageBtn')
let nextPageBtn = document.querySelector('#nextPageBtn')

let allProducts = null

let rows = 5 , 
    startIndex = null , 
    endIndex = null , 
    currentPage = 1 ,
    btn = null ,
    prevBtn = null

function generateBtnsHandler(i){
    let btn = document.createElement('button')
    btn.className = '!px-2 py-1 text-gray-500 hover:text-white hover:bg-sky-400 transition-colors duration-200 cursor-pointer rounded'
    btn.innerHTML = i

    btn.addEventListener('click' , e => {
        prevBtn = btnsWrapper.querySelector('.active')
        prevBtn.classList.remove('active')
        e.target.classList.add('active')

        currentPage = parseInt(e.target.innerHTML)

        window.scrollTo(0,0)
        content.scrollTo(0,0)
        createProductsHandler(allProducts)
        setupPagination(allProducts , rows , btnsWrapper , currentPage)
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

    let filteredProducts = products.slice(startIndex , endIndex) 

    if(allProducts.length <= rows){
        btnsWrapper.parentNode.classList.add('hidden')
    }

    createProductsCardsHandler(filteredProducts)
    
}

function changePageHandler(e){
    if(e.target.id == 'prevPageBtn'){
        currentPage -=1
    } else {
        currentPage +=1
    }

    window.scrollTo(0,0)
    content.scrollTo(0,0)
    createProductsHandler(allProducts)
    setupPagination(allProducts , rows , btnsWrapper , currentPage)
}


function createProductsCardsHandler(products){
    productsWrapper.innerHTML = ''
    products.forEach(product => {
        productsWrapper.insertAdjacentHTML('beforeend' , `<div class="relative p-1 hover:-translate-y-2 transition-transform ease-in-out duration-200 rounded-lg bg-gray-200 flex flex-col gap-7 select-none group">
        <span class="${product.discount != 0 ? '' : 'hidden '}z-10 py-1 px-2 absolute top-0 left-0 rounded-br-md bg-sky-500 text-white text-xs font-bold">-<span>${product.discount}</span> Off</span>
        <div class="relative w-full !h-72 overflow-hidden rounded-md">
            <img src="./images/${product.imagePath}" class="object-cover group-hover:scale-150 group-hover:rotate-12 transition-transform duration-200" alt="Product Image">

            <button class="p-1 absolute top-1 right-1 bg-gray-100 fill-gray-100 stroke-gray-800 rounded-full hover:scale-110 transition-transform group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-6 group-hover:fill-red-500 group-hover:stroke-0 transition-colors">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>                              
            </button>
        </div>

        <div class="space-y-2 py-1 px-2">
            <div class="space-y-[2px]">
                <h3 class="productName font-bold text-gray-800">${product.productName}</h3>
                <p class="text-gray-500">${product.productSummary}</p>
            </div>

            <div class="w-full flex justify-between items-center">
                <div class="font-bold text-gray-800 flex items-center gap-2">
                    <span class="${product.discount != 0 ? 'line-through decoration-gray-400 text-gray-400' : 'hidden'}">$${product.price}</span>
                    <span>$${product.finalPrice}</span>
                </div>
                <a  href="./product.html?p=${product.id}" id="buyProductBtn" class="inline-block py-2 px-4 bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold rounded-md">Buy Now</a>
            </div>

        </div>
    </div>`)
    })
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
        createProductsHandler(allProducts)
        setupPagination(products , rows , btnsWrapper , currentPage)
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
    let locationElems = new URLSearchParams(location.search)
    let productType = !locationElems.size ? 'all' : 
                    ['all' , 'men' , 'women' , 'kids'].includes(locationElems.get('t').toLowerCase()) ? locationElems.get('t').toLowerCase() : null


    groupBtn.querySelector('span').innerHTML = productType || 'All'

    let menuElems = null
    if(productType && productType != 'all'){
        menuElems = document.querySelectorAll(`.${productType}LiElem`)
    } else {
        menuElems = document.querySelectorAll('.collectionsLiElem')
    }

    menuElems.forEach(menuElem => menuElem.classList.add('active'))

    await getUsersAndProductsHandler()
    await getProductsHandler(productType)
}

function filterProductsHandler(filterValue){
    let filteredProducts = [...allProducts]
    
    if(filterValue === 'Default'){
        filteredProducts.sort((a , b) => a.id - b.id)
    } else if(filterValue == 'Cheapest'){
        filteredProducts.sort((a , b) => a.finalPrice - b.finalPrice)
    } else {
        filteredProducts.sort((a , b) => b.finalPrice - a.finalPrice)
    }

    createProductsHandler(filteredProducts)
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
    basket.parentNode.className = basket.parentNode.className.replace('z-0' , 'z-20')
    basket.className = basketClass.replace('-translate-x-full' , 'translate-x-0')
    basket.parentNode.className = basket.parentNode.className.replace('bg-black/0' , 'bg-black/50') 
}

const closeBasket =  () => {
    let basketClass = basket.className
    basket.className = basketClass.replace('translate-x-0' , '-translate-x-full')
    basket.parentNode.className = basket.parentNode.className.replace('bg-black/50' , 'bg-black/0') 
    setTimeout(() => {
        basket.parentNode.className = basket.parentNode.className.replace('visible' , 'invisible')
        basket.parentNode.className = basket.parentNode.className.replace('z-20' , 'z-0')
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
    let filteredProducts = null

    if(searchInputValue){
        filteredProducts = allProducts.filter(product => product.productName.toLowerCase().startsWith(searchInputValue))
    } else {
        filteredProducts = allProducts
    }

    createProductsHandler(filteredProducts)
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


prevPageBtn.addEventListener('click' , changePageHandler)
nextPageBtn.addEventListener('click' , changePageHandler)
document.addEventListener('DOMContentLoaded' , getUserAndProductDetailsHandler)
searchInput.addEventListener('keyup' , searchProductHandler)
groupWrapper.addEventListener('click' , filterGroupHandler)
sortWrapper.addEventListener('click' , filterSortHandler)
groupBtn.addEventListener('click' , toggleGroupWrapper)
sortBtn.addEventListener('click' , toggleSortWrapper)
hamburger.addEventListener('click' , showMenu)
basketBtn.addEventListener('click' , showBasket)
closeModalBtn.addEventListener('click' , closeMenu)
closeBasketBtn.addEventListener('click', closeBasket)