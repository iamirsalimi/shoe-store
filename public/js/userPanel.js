let menu = document.getElementById('menu')
let menuBtn = document.getElementById('menu-btn')
let currentPage = document.getElementById('currentPage')

let targetElem = null
let currentTab = null


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

    currentTab = targetElem.dataset.target
    changeCurrentPageHandler()
}

// change page title and current location link
function changeCurrentPageHandler(){
    currentPage.innerHTML = `/ ${currentTab}`
    document.title = `Shoe Store | ${currentTab}`
}

document.addEventListener('DOMContentLoaded' , () => {
    currentTab = menu.querySelector('.active').dataset.target
})
menuBtn.addEventListener('click' , toggleMenu)
menu.addEventListener('click' , changeMenu)