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
let starNums = 5

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

starSelect.addEventListener('click' , starHandler)
commentAndReviewTab.addEventListener('click' , changeTabHandler)
hamburger.addEventListener('click' , showMenu)
basketBtn.addEventListener('click' , showBasket)
closeModalBtn.addEventListener('click' , closeMenu)
closeBasketBtn.addEventListener('click', closeBasket)