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
let addToWishListBtn = document.getElementById('addToWishListBtn')
let loginBtn = document.getElementById('loginBtn')
let textareaElem = document.querySelector('textarea')
let loader = document.querySelector('.loader-wrapper')
let darkModeBtns = document.querySelectorAll('.darkmodeBtn')

let userObj = null
let userBasket = null
let newBasketObj = {basket : []}
let newCommentObj = {reviews : []}
let newWishListObj = {wishlist : []}
let wishList = []
let productObj = null
let productReviews = null
let starNumber = 5
let darkModeFlag = false

let starNums = 5

let numberInputRegex = /^\d+$/g

class Comment{
    constructor(userId , userName , starNumbers , commentText){
        this.id = makeRandomIdNum(productReviews)
        this.userId = userId
        this.userName = userName
        this.starNumbers = starNumbers
        this.commentText = commentText
        this.likes = []
    }
}

class BasketProduct{
    constructor(productId , productImagePath , productName , productPrice , productDiscount , finalPrice , quantity , size , color){
        this.id = makeRandomIdNum(userBasket)
        this.productId = productId
        this.productImagePath = productImagePath
        this.productName = productName
        this.productPrice = productPrice
        this.productDiscount = productDiscount
        this.finalPrice = finalPrice
        this.quantity = quantity
        this.size = size
        this.color = color
        this.date = getDate()
    }
}

const getDate = () => {
    let now = new Date()
    return `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`
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

async function likeOrUnlikeReview(reviewObj){
    if(!reviewObj.likes.length){
        reviewObj.likes.push(userObj.id)
    } else {
        let userLikedId = reviewObj.likes.indexOf(userObj.id)
        
        if(userLikedId != -1){
            reviewObj.likes.splice(userLikedId , 1)
        } else {
            reviewObj.likes.push(userObj.id)
        }
    }

    console.log(reviewObj.likes);
}

function isUserLikedComment(likes){
    let isUserLikedComment = likes.includes(userObj.id)
    return isUserLikedComment
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
    
    // We must select the first seize as default
    let productSizes = document.querySelector('#productSizes')
    productSizes.innerHTML = productObj.sizes.split(' ').map(size => `<option value="${size}">${size}</option>`).join('')
    productSizes.value = productObj.sizes.split(' ')[0]

    let quantityInput = document.querySelector('#quantityInput')
    quantityInput.value = 1

    // We use the index to select the first color as default
    let index = 2
    let productColors = document.querySelector('#productColors')
    productColors.innerHTML = productObj.colors.split(' ').map(color => { 
        index = index <= 0 ? 0 : index - 1
        return `<div>
            <input type="radio" id="${color}" name="colors" class="hidden" ${index == 1 ? 'checked>' : '>'}
            <label for="${color}" class="inline-block w-3 h-3 rounded-full bg-${['black' , 'white'].includes(color) ? color : `${color}-500`} ring-0 ring-${['black' , 'white'].includes(color) ? color : `${color}-500`} ${color == 'white' ? ' border border-gray-400' : '' } ring-offset-2 ring-offset-gray-100 dark:ring-offset-slate-700 hover:scale-110 transition-all cursor-pointer border-none"></label>
        </div>`
    }).join('')

    productReviews = productObj?.reviews || []

    let reviewsWrapper = document.querySelector('#review').firstElementChild
    
    if(productReviews.length){
        productObj.reviews?.reverse()
        
        let likedFlag = false

        if(productObj?.reviews){
            reviewsWrapper.innerHTML = ''
        }

        productObj.reviews?.forEach(review => {
            likedFlag = userObj && isUserLikedComment(review.likes)
            
            reviewsWrapper.insertAdjacentHTML('beforeend' , `<div class="px-4 py-1 flex flex-col gap-2 md:flex-row">
            <div class="w-full flex flex-col items-center gap-2 md:w-1/4">
                <div class="bg-gray-400 dark:bg-slate-600 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 stroke-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>                              
                </div>
    
                <span class="text-xl text-gray-700 dark:text-gray-300 font-bold">${review.userName}</span>
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
                
                <p class="text-gray-500 dark:text-gray-400 md:text-justify">${review.commentText}</p>
    
                <button id="likeBtn" data-targetId="${review.id}" class="inline-flex items-center gap-2 ${likedFlag ? 'text-red-500 dark:text-red-600' : 'text-gray-500 dark:text-gray-300'} bg-white dark:bg-slate-800 font-semibold py-1 px-2 rounded-lg  hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0" stroke="currentColor" class="w-6 h-6 ${likedFlag ? 'fill-red-600' : 'fill-gray-400 dark:fill-gray-300'} pointer-events-none">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> Likes <span class="${likedFlag ? 'text-red-500 dark:text-red-600' : 'text-gray-400 dark:text-gray-300'} pointer-events-none">(${review.likes.length})</span>
                </button>
            </div>
        </div>`)
        })

        let likeBtns = reviewsWrapper.querySelectorAll('#likeBtn')

        likeBtns.forEach(likeBtn => likeBtn.addEventListener('click' , e => {
            if(userObj?.role == 'user'){
                let targetElem = e.target.tagName == 'path' ? e.target.parentNode.parentNode : e.target.tagName == 'svg' ? e.target.parentNode : e.target 
                let reviewId = targetElem.dataset?.targetid
                let targetReviewObj =  productObj.reviews.find(review => review.id == reviewId)
                
                if(reviewId && targetReviewObj){
                    likeOrUnlikeReview(targetReviewObj)
                    addNewCommentHandler({reviews : [...productObj.reviews]} , 'like')
                }
            } else {
                Swal.fire({
                    icon: "info",
                    title: `You Can't Add Comment ${!userObj ? ', Please Login First' : 'You Are Not a Customer'}`,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        }))
    } else {
        let reviewsEmptyMessage = reviewsWrapper.lastElementChild
        reviewsEmptyMessage.classList.remove('hidden')
    }


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
                title: `Your Wish List Was Updated You Can Get Access To Your WishList in Your Panel in Wishlist Tab`,
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

const makeRandomIdNum = (targetArray) => {
    let num = Math.floor(Math.random() * 999999)
    let isNumExist = targetArray?.some(review => review.id === num)
    if(isNumExist){
        makeRandomIdNum()
    } else {
        return num
    }
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

    let productId = new URLSearchParams(location.search).get('p')
    
    if(productId){
        productObj = await isProductInProducts(productId)
        if(productObj){
            showProductDetails(productObj)
            addToWishListBtn.addEventListener('click' , () => addProductToWishList(productObj))
        } else {
            location.href = 'http://127.0.0.1:5500/public/index.html'
        }
    } else {
        location.href = 'http://127.0.0.1:5500/public/index.html'
    }
    

    // If there is a user is users, it will return true and we don't need to disable the comments button
    if(userObj){
        addCommentBtn.removeAttribute('disabled')
        wishList = userObj?.wishlist || []
        userBasket = userObj?.basket || []
        showUserBasket(userBasket)
        if(userObj.role === 'admin'){
            addToBasketBtn.setAttribute('disabled' , 'disabled')
            addToWishListBtn.setAttribute('disabled' , 'disabled')
            addToWishListBtn.firstElementChild.href = '#'
        }
        
    } else {
        addCommentBtn.setAttribute('disabled' , 'disabled')
        
        addToWishListBtn.classList.add('hidden')
        addToBasketBtn.classList.add('hidden')
        // showing login btn to User that didn't login in site
        loginBtn.classList.remove('hidden')
        loginBtn.classList.add('inline-block')
    }

    loader.classList.add('fadeOut')
    setTimeout(() => {
        loader.classList.remove('flex')
        loader.classList.add('hidden')
    },1000)
}

async function addNewCommentHandler(commentObj , targetFlag){
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
                title: `${targetFlag == 'like' ? 'Comment Was Liked' : 'Comment Was Added'}`,
                showConfirmButton: false,
                timer: targetFlag == 'like' ? 1500 : 3000
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

            await addNewCommentHandler(newCommentObj , 'add')
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


// basket{}
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
                title: `your basket was updated`,
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

async function addProductToBasket(newBasketObj){
    if(userObj?.role !== 'admin'){
        let quantity = document.querySelector('#quantityInput').value

        if(quantity.match(numberInputRegex)){
            await addNewProductToBasketHandler(newBasketObj)
        } else {
            Swal.fire({
                icon: "info",
                title: `Please Enter A Valid Quantity Number`,
                showConfirmButton: false,
                timer: 3000
            })
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "You Can't Add Product To Your Basket",
            showConfirmButton: false,
            timer: 3000
        })
    }
} 

function isProductInBasket(basketProductObj){
    let basketProduct = {...basketProductObj}
    let basket = [...newBasketObj?.basket] || []

    console.log(newBasketObj.basket == basket)
    
    let isProductExist = basket?.some(basketObj => basketObj.productId === basketProduct.productId && basketObj.size === basketProduct.size && basketObj.color === basketProduct.color && basketObj.quantity === basketProduct.quantity)
    return isProductExist
}


async function addProductToBasketHandler(e){
    let productSize = parseInt(document.querySelector('#productSizes').value)
    let quantity = parseInt(document.querySelector('#quantityInput').value)
    let productColor = document.querySelector('input[type="radio"]:checked').id

    let basketProductObj = new BasketProduct(productObj.id , productObj.imagePath , productObj.productName , productObj.price , productObj.discount , productObj.finalPrice , quantity , productSize , productColor) 
            
    // If the user's shopping cart is empty, we will add the product to it, but if the user's cart is full, we will add that product to the previous products.
    newBasketObj.basket = userBasket || basketProductObj

    let isProductExist = isProductInBasket(basketProductObj)

    if(isProductExist){
        Swal.fire({
            icon: "info",
            title: "This product is already in your shopping cart",
            showConfirmButton: false,
            timer: 3000
        })
        return false
    } else {
        userBasket && newBasketObj.basket.push(basketProductObj)
    }

    console.log(newBasketObj , e.target)
    await addProductToBasket(newBasketObj)
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

darkModeBtns.forEach(darkModeBtn => {
    darkModeBtn.addEventListener('click' , changeThemeHandler)
})

document.addEventListener('DOMContentLoaded' , getUserAndProductDetailsHandler)
addToBasketBtn.addEventListener('click' , addProductToBasketHandler)
addCommentBtn.addEventListener('click' , addCommentHandler)
starSelect.addEventListener('click' , starHandler)
commentAndReviewTab.addEventListener('click' , changeTabHandler)
hamburger.addEventListener('click' , showMenu)
basketBtn.addEventListener('click' , showBasket)
closeModalBtn.addEventListener('click' , closeMenu)
closeBasketBtn.addEventListener('click', closeBasket)