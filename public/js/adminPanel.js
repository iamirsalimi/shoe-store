let menu = document.getElementById('menu')
let menuBtn = document.getElementById('menu-btn')
let currentPage = document.getElementById('currentPage')
let content = document.getElementById('content')

let searchInputs = document.querySelectorAll('.searchInput')
let showOrderDetailsBtns = document.querySelectorAll('.showOrderDetailsBtn') 

let shortCutBtns = document.querySelectorAll('.shortcut-btn')

// purchases section elems
let changeSearchTargetCheckBox = document.getElementById('changeSearchTargetCheckBox')
let changeSearchTargetLabel = document.querySelector('#changeSearchTarget label')


let targetElem = null
let currentTab = 'Dashboard'
let searchTarget = 'Customer Id'
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

function showOrderDetail(e){
    window.scrollTo(0,0)
    content.scrollTo(0,0)



}


function changeSearchTargetHandler(e){
    let targetElem = e.target.tagName === 'SPAN' ? e.target.parentNode : e.target 

    let spanElem = targetElem.firstElementChild
    let spanClass = spanElem.className
    let searchInput = targetElem.parentNode.parentNode.querySelector('.searchInput')

    // we must change span style accord checkbox
    if(changeSearchTargetCheckBox.checked){
        spanClass = spanClass.replace('bg-sky-500','bg-red-500')
        spanClass = spanClass.replace('bg-sky-600','bg-red-600')
        spanClass = spanClass.replace('ml-auto' , 'ml-0')
        searchTarget = 'Order Id'
    } else {
        spanClass = spanClass.replace('bg-red-500','bg-sky-500')
        spanClass = spanClass.replace('bg-red-600','bg-sky-600')
        spanClass = spanClass.replace('ml-0' , 'ml-auto')
        searchTarget = 'Customer Id'
    }
    
    searchInput.placeholder = searchTarget
    searchInput.setAttribute('data-searchTarget' , searchTarget.replace(' ' , ''))
    spanElem.className = spanClass
    if(searchInput.value.trim()){
        searchTargetHadnler(searchInput.value , searchTarget.replace(' ' , ''))
    }
}

function searchHandler(e){
    let searchValue = e.target.value.trim()
    searchTargetHadnler(searchValue , e.target.dataset.searchtarget)
}


function searchTargetHadnler(searchValue , searchTarget){
    let targetTable = document.getElementById(`${currentTab}Table`)
    if(searchValue){
        let searchTargetElem = null

        if(searchTarget == 'OrderId'){
            searchValue = searchValue.startsWith('#') ? searchValue : '#' + searchValue
        }

        let trElems = targetTable.querySelectorAll('tr')
        trElems.forEach(trElem => {
            searchTargetElem = trElem.querySelector(`.${searchTarget}`)
            if(searchTargetElem.innerHTML.toLowerCase().startsWith(searchValue.toLowerCase())){
                trElem.style.display = 'table-row'
            } else {
                trElem.style.display = 'none'
            }
        })
    } else {
        let trElems = targetTable.querySelectorAll('tr')
        trElems.forEach(trElem => {
            trElem.style.display = 'table-row'
        })
    }
}

// events


shortCutBtns.forEach(shortCutBtn => {
    shortCutBtn.addEventListener('click' , changeContent)
})

showOrderDetailsBtns.forEach(showOrderDetailsBtn => {
    showOrderDetailsBtn.addEventListener('click' , showOrderDetail)
})

searchInputs.forEach(searchInput => {
    searchInput.addEventListener('keyup' , searchHandler)
})

changeSearchTargetLabel.addEventListener('click' , changeSearchTargetHandler)


menuBtn.addEventListener('click' , toggleMenu)
menu.addEventListener('click' , changeMenu)