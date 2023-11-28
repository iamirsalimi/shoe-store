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
let groupBtn = document.querySelector('#groupBtn')
let sortBtn = document.querySelector('#sortBtn')
let groupWrapper = document.querySelector('#groupWrapper')
let sortWrapper = document.querySelector('#sortWrapper')


async function getUserAndProductDetailsHandler(){
    await getUsersAndProductsHandler()
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
        toggleGroupWrapper()
    }
}

function filterSortHandler(e){
    let filterValue = e.target.tagName == 'A' ? e.target.innerHTML : e.target.firstElementChild.innerHTML
    if(e.target.tagName === 'A' || e.target.tagName === 'LI'){
        sortBtn.firstElementChild.innerHTML =  filterValue
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

document.addEventListener('DOMContentLoaded' , getUserAndProductDetailsHandler)
groupWrapper.addEventListener('click' , filterGroupHandler)
sortWrapper.addEventListener('click' , filterSortHandler)
groupBtn.addEventListener('click' , toggleGroupWrapper)
sortBtn.addEventListener('click' , toggleSortWrapper)
hamburger.addEventListener('click' , showMenu)
basketBtn.addEventListener('click' , showBasket)
closeModalBtn.addEventListener('click' , closeMenu)
closeBasketBtn.addEventListener('click', closeBasket)