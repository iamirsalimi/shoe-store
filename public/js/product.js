import apiData from './api.js'
import {getUsersAndProductsHandler} from './api.js'


let hamburger = document.getElementById('hamburger-menu')
let menu = document.getElementById('menu')
let closeModalBtn = document.getElementById('closeModalBtn')
let basketBtn = document.getElementById('basketBtn')
let basket = document.getElementById('basket')
let closeBasketBtn = document.getElementById('closeBasketBtn')
let navElems = document.querySelectorAll('nav ul')
let goToUpBtn = document.getElementById('gotoupBtn')
let colors = document.querySelectorAll('#colors input')
let backBtn = document.getElementById('backBtn')
let commentAndReviewTab = document.getElementById('commentAndReviewTab')
let starSelect = document.getElementById('starSelect')
let addCommentBtn = document.getElementById('addCommentBtn')
let addToBasketBtn = document.getElementById('addToBasketBtn')
let purchaseBtn = document.getElementById('purchaseBtn')
let loginBtn = document.getElementById('loginBtn')
let textareaElem = document.querySelector('textarea')

let newCommentObj = {reviews : []}
let userObj = null
let productObj = null
let productReviews = null
let starNumber = 5

let starNums = 5


class Comment{
    constructor(userId , userName , starNumbers , commentText){
        this.userId = userId
        this.userName = userName
        this.starNumbers = starNumbers
        this.commentText = commentText
        this.likes = 0
    }
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

colors.forEach(color => {
    color.addEventListener('input' , e => {
        let prevColor = e.target.parentNode.parentNode.querySelector('.active')
        prevColor.classList.remove('active')
        e.target.previousElementSibling.classList.add('active')
    })
})

// changing comment and reviews tab
function changeTabHandler(e){
    if(e.target.tagName === "LI"){
        let tabTarget = e.target.dataset.target 
        let tabTargetWrapper = document.getElementById(tabTarget)
        
        let prevActiveTab = e.target.parentNode.querySelector('.active')
        prevActiveTab.classList.remove('active')
        e.target.classList.add('active')
        
        // access to current tab wrapper to give hide it
        let prevTabWrapper = tabTarget == 'comment' ? document.getElementById('review') : document.getElementById('comment')

        prevTabWrapper.className = prevTabWrapper.className.replace('flex' , 'hidden')
        tabTargetWrapper.className = tabTargetWrapper.className.replace('hidden' , 'flex')
    }
}

function clearStars(){
    let allStars = starSelect.querySelectorAll('.active') || null

    if(allStars){
        allStars.forEach(star => star.classList.remove('active'))
    }
}

function starHandler(e){
    if(e.target.tagName == 'svg' || e.target.tagName == 'path'){
        clearStars()
        let targetElem = e.target.tagName == 'path' ? e.target.parentNode : e.target
        let prevStarElmsNum = parseInt(targetElem.dataset.elemnum)
        starNumber = parseInt(targetElem.dataset.starnumber)
        targetElem.classList.add('active')
        
        // console.log(prevStarElmsNum);
        if(!prevStarElmsNum){
            return false
        }

        for(let i = prevStarElmsNum ; i > 0 ; i--){
            targetElem = targetElem.previousElementSibling
            targetElem.classList.add('active')
        }

        starNums = prevStarElmsNum + 1
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

// get product infos
async function isProductInProducts(productId){
    let targetProductObject = null

    await fetch(apiData.getProductsUrl , {
        headers : {
            'apikey' : apiData.getProductsApiKey,
            'authorization' : apiData.authorization
        }
    })
    .then(res => res.json())
    .then(products => {
        targetProductObject = products.find(product => product.id == productId) 
    })
    .catch(err => console.log(err))
    
    return targetProductObject
}

function showProductDetails(productObj){
    let productImageElem = document.querySelector('#productImg')
    productImageElem.src = `./images/${productObj.imagePath}`

    let productName = document.querySelector('#productName')
    productName.innerHTML = productObj.productName

    let productDesc = document.querySelector('#productDesc')
    productDesc.innerHTML = productObj.productDesc
    
    let productPrice = document.querySelector('#productPrice')
    productPrice.innerHTML = productObj.finalPrice
    
    let productSizes = document.querySelector('#productSizes')
    productSizes.innerHTML = productObj.sizes.split(' ').map(size => `<option value="${size}">${size}</option>`).join('')
    
    let productColors = document.querySelector('#productColors')
    productColors.innerHTML = productObj.colors.split(' ').map(color => `<div>
        <input type="radio" id="${color}" name="colors" class="hidden">
        <label for="${color}" class="active inline-block w-3 h-3 rounded-full bg-${color}-500 ring-0 ring-${color}-500 ring-offset-2 ring-offset-gray-100 hover:scale-110 transition-all cursor-pointer border-none"></label>
    </div>`).join('')

    productReviews = productObj?.reviews || []

    let reviewsWrapper = document.querySelector('#review').firstElementChild

    productObj.reviews?.reverse()

    productObj.reviews?.forEach(review => {
        reviewsWrapper.insertAdjacentHTML('beforeend' , `<div class="px-4 py-1 flex flex-col gap-2 md:flex-row">
        <div class="w-full flex flex-col items-center gap-2 md:w-1/4">
            <div class="bg-gray-400 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 stroke-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>                              
            </div>

            <span class="text-xl text-gray-700 font-bold">${review.userName}</span>
        </div>

        <div class="w-full space-y-3 text-center md:w-3/4 md:text-left">
            <div class="flex items-center justify-center gap-1 md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0" stroke="currentColor" class="w-6 h-6 fill-yellow-400 stroke-yellow-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="${review.starNumbers >= 2 ? '0' : '1'}" stroke="currentColor" class="w-6 h-6 ${review.starNumbers >= 2 ? 'fill-yellow-400' : ''} stroke-yellow-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="${review.starNumbers >= 3 ? '0' : '1'}" stroke="currentColor" class="w-6 h-6 ${review.starNumbers >= 3 ? 'fill-yellow-400' : ''} stroke-yellow-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="${review.starNumbers >= 4 ? '0' : '1'}" stroke="currentColor" class="w-6 h-6 ${review.starNumbers >= 4 ? 'fill-yellow-400' : ''} stroke-yellow-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="${review.starNumbers == 5 ? '0' : '1'}" stroke="currentColor" class="w-6 h-6 ${review.starNumbers == 5 ? 'fill-yellow-400' : ''} stroke-yellow-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                  
            </div>

            <p class="text-gray-500 md:text-justify">${review.commentText}</p>

            <button id="likeBtn" class="inline-flex items-center gap-2 text-white font-bold py-1 px-2 rounded-md bg-blue-500 hover:bg-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 stroke-red-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> Like <span class="text-white/70">(${review.likes})</span>
            </button>
        </div>
    </div>`)
    })

    let ratingWrapper = document.querySelector('#review').lastElementChild

    let averageRatingElem = ratingWrapper.querySelector('#averageRating')
    let averageRatingStars = document.querySelectorAll('#averageRatingStars svg')
    let commentsNumber = ratingWrapper.lastElementChild
    
    commentsNumber.innerHTML = `(${productReviews.length} reviews)`

    let averageRating = productReviews.length ? Math.round(productReviews.reduce((sum , current) => sum + current.starNumbers , 0) / productReviews.length) : 0
    averageRatingElem.innerHTML = `${averageRating}/5`

    for(let i = 0 ; i < averageRating ; i++){
        averageRatingStars[i].classList.add(`fill-yellow-400`)
    }

    
}


async function getUserAndProductDetailsHandler(){
    let productId = new URLSearchParams(location.search).get('p')
    
    if(productId){
        productObj = await isProductInProducts(productId)
        if(productObj){
            showProductDetails(productObj)
        } else {
            location.href = 'http://127.0.0.1:5500/public/index.html'
        }
    } else {
        location.href = 'http://127.0.0.1:5500/public/index.html'
    }
    
    userObj = await getUsersAndProductsHandler()

    // If there is a user is users, it will return true and we don't need to disable the comments button
    if(userObj){
        addCommentBtn.removeAttribute('disabled')
        
        if(userObj.role === 'admin'){
            addToBasketBtn.setAttribute('disabled' , 'disabled')
            purchaseBtn.setAttribute('disabled' , 'disabled')
            purchaseBtn.firstElementChild.href = '#'
        }

    } else {
        addCommentBtn.setAttribute('disabled' , 'disabled')
        
        purchaseBtn.classList.add('hidden')
        addToBasketBtn.classList.add('hidden')

        // showing login btn to User that didn't login in site
        loginBtn.classList.remove('hidden')
        loginBtn.classList.add('inline-block')
    }
}

async function addNewCommentHandler(commentObj){
    await fetch(`${apiData.updateProductsUrl}${productObj.id}` , {
        method : 'PATCH' ,

        headers : {
            'Content-Type': 'application/json',
            'apikey' : apiData.updateProductsApiKey,
            'authorization' : apiData.authorization
        } ,

        body : JSON.stringify(commentObj)
    })
    .then(res => {
        console.log(res)
        if([205 , 204 , 203 , 202 , 201 ,200].includes(res.status)){
            getUserAndProductDetailsHandler()
            Swal.fire({
                icon: "success",
                title: `Your Comment Was Added`,
                showConfirmButton: false,
                timer: 3000
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

async function addCommentHandler(){    
    if(userObj?.role !== 'admin'){
        let commentText = textareaElem.value.trim()
        if(commentText){
            let commentObj = new Comment(userObj.id , `${userObj.firstName} ${userObj.lastName}` , starNumber , commentText) 
            
            newCommentObj.reviews = productReviews || commentObj

            productReviews && newCommentObj.reviews.push(commentObj)

            await addNewCommentHandler(newCommentObj)
        } else {
            Swal.fire({
                icon: "info",
                title: `Please Enter Your Review`,
                showConfirmButton: false,
                timer: 3000
            })
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "You Can't Add Comment",
            showConfirmButton: false,
            timer: 3000
        })
    }

    textareaElem.value = ''
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

backBtn.addEventListener('click' , () => {
    history.back()
})

goToUpBtn.addEventListener('click' , () => {
    window.scrollTo(0,0)
})

navElems.forEach(nav => {
    nav.addEventListener('click' , changeRoot)
})

addCommentBtn.addEventListener('click' , addCommentHandler)
starSelect.addEventListener('click' , starHandler)
commentAndReviewTab.addEventListener('click' , changeTabHandler)
document.addEventListener('DOMContentLoaded' , getUserAndProductDetailsHandler)
hamburger.addEventListener('click' , showMenu)
basketBtn.addEventListener('click' , showBasket)
closeModalBtn.addEventListener('click' , closeMenu)
closeBasketBtn.addEventListener('click', closeBasket)