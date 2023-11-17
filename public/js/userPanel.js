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
        console.log(currentProgressWrapper)
        
        let nextProgressWrapper = document.getElementById(`progress${progressTarget}`)  
        nextProgressWrapper.classList.add('show')
        console.log(nextProgressWrapper)

        // changing current progress icon style by adding active class
        let currentProgressIcon = document.getElementById(`progress-${progressTarget}`)
        currentProgressIcon.classList.remove('completed')
        currentProgressIcon.classList.add('active')

        let progressLine = document.getElementById(`progress-line-${progressTarget}`)
        progressLine.classList.remove('progress-completed')
        
        let progressIcon = document.getElementById(`progress-${currentProgress}`)
        progressIcon.classList.remove('active')
        console.log(progressIcon)
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

function getRoute(){
    let locationSearch =location.search

    if(!locationSearch){
        return false
    }

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
}


// events

increaseCountBtns.forEach(increaseCountBtn => {
    increaseCountBtn.addEventListener('click' , changeProductCount)
})

decreaseCountBtns.forEach(decreaseCountBtn => {
    decreaseCountBtn.addEventListener('click' , changeProductCount)
})


document.addEventListener('DOMContentLoaded' , getRoute)
backToProgressBtn1.addEventListener('click' , changePurchaseProgress)
backToProgressBtn.addEventListener('click' , changePurchaseProgress)
payNowBtn.addEventListener('click' , changePurchaseProgress)
checkoutBtn.addEventListener('click' , changePurchaseProgress)
menuBtn.addEventListener('click' , toggleMenu)
menu.addEventListener('click' , changeMenu)