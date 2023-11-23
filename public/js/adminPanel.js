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
let viewUserOrdersBtn = document.getElementById('viewUserOrdersBtn')
let editProductBtns = document.querySelectorAll('.editProductBtn') 
let removeProductBtns = document.querySelectorAll('.deleteProductBtn') 

let addAndEditModal = document.getElementById('addAndEditModal') 
let removeProductModal = document.getElementById('removeProductModal')

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
    window.scrollTo(0,0)
    content.scrollTo(0,0)
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
        searchTargetHandler(searchInput.value , searchTarget.replace(' ' , ''))
    }
}

function searchHandler(e){
    let searchValue = e.target.value.trim()
    searchTargetHandler(searchValue , e.target.dataset.searchtarget.replace(' ' , ''))
}


function searchTargetHandler(searchValue , searchTarget){
    let targetTable = document.getElementById(`${currentTab}Table`)
    if(searchValue){
        let searchTargetElem = null
        targetTable.classList.add('searched')
 
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
        targetTable.classList.remove('searched')

        let trElems = targetTable.querySelectorAll('tr')
        trElems.forEach(trElem => {
            trElem.style.display = 'table-row'
        })
    }
}

function showUserOrdersHandler(e){
    // We get the customer ID information and the tab we want to display from the dataset
    let targetElem = e.target.dataset.target
    let customerId = e.target.dataset.customerid

    // We get the ID of the content that we want to display by clicking on the button through the dataset And by giving and taking the active class, we display the content we want

    let prevActiveTab = menu.querySelector('.active')
    prevActiveTab.classList.remove('active')
    let targetMenu = menu.querySelector(`#${targetElem}Menu`)
    targetMenu.classList.add('active')

    let prevActiveContent = document.getElementById(currentTab)
    prevActiveContent.classList.add('notActive')

    let targetElemWrapper = document.getElementById(targetElem)
    targetElemWrapper.classList.remove('notActive')

    currentTab = targetElem
    changeCurrentPageHandler()

    setTimeout(() => {
        window.scrollTo(0,window.scrollMaxY)
        content.scrollTo(0,content.scrollHeight)
    } , 10)

    let searchInput = targetElemWrapper.querySelector('input[type="text"]')
    searchInput.value = customerId

    let checkBoxElem = targetElemWrapper.querySelector('input[type="checkbox"]')
    checkBoxElem.checked = true

    let spanElem = changeSearchTargetLabel.firstElementChild 
    let spanClass = spanElem.className

    spanClass = spanClass.replace('bg-red-500','bg-sky-500')
    spanClass = spanClass.replace('bg-red-600','bg-sky-600')
    spanClass = spanClass.replace('ml-0' , 'ml-auto')
    searchTarget = 'Customer Id'

    spanElem.className = spanClass
    searchInput.placeholder = searchTarget
    searchInput.setAttribute('data-searchTarget' , searchTarget.replace(' ' , ''))

    searchTargetHandler(searchInput.value , searchTarget.replace(' ' , ''))
}

function showAddAndEditModalHandler(){
    let modalWrapperClass = addAndEditModal.className
    let modalClass = addAndEditModal.firstElementChild.className
    
    // modalWrapperClass = modalWrapperClass.replace('hidden' , 'flex')
    modalWrapperClass = modalWrapperClass.replace('-z-10' , 'z-30')
    modalWrapperClass = modalWrapperClass.replace('bg-black/0' , 'bg-black/50')
    
    modalClass = modalClass.replace('opacity-0' , 'opacity-100')
    
    addAndEditModal.className = modalWrapperClass
    addAndEditModal.firstElementChild.className = modalClass 
}

function showRemoveProductModalHandler(){
    let modalWrapperClass = removeProductModal.className
    let modalClass = removeProductModal.firstElementChild.className
    
    // modalWrapperClass = modalWrapperClass.replace('hidden' , 'flex')
    modalWrapperClass = modalWrapperClass.replace('-z-10' , 'z-30')
    modalWrapperClass = modalWrapperClass.replace('bg-black/0' , 'bg-black/50')
    
    modalClass = modalClass.replace('opacity-0' , 'opacity-100')
    
    removeProductModal.className = modalWrapperClass
    removeProductModal.firstElementChild.className = modalClass 
}

function closeAddAndEditModalHandler(){
    let modalWrapperClass = addAndEditModal.className
    let modalClass = addAndEditModal.firstElementChild.className
    
    // modalWrapperClass = modalWrapperClass.replace('flex' , 'hidden')
    modalWrapperClass = modalWrapperClass.replace('z-30' , '-z-10')
    modalWrapperClass = modalWrapperClass.replace('bg-black/50' , 'bg-black/0')
    
    modalClass = modalClass.replace('opacity-100' , 'opacity-0')
    
    addAndEditModal.className = modalWrapperClass
    addAndEditModal.firstElementChild.className = modalClass 

}

function closeRemoveProductModalHandler(){
    let modalWrapperClass = removeProductModal.className
    let modalClass = removeProductModal.firstElementChild.className
    
    // modalWrapperClass = modalWrapperClass.replace('flex' , 'hidden')
    modalWrapperClass = modalWrapperClass.replace('z-30' , '-z-10')
    modalWrapperClass = modalWrapperClass.replace('bg-black/50' , 'bg-black/0')
    
    modalClass = modalClass.replace('opacity-100' , 'opacity-0')
    
    removeProductModal.className = modalWrapperClass
    removeProductModal.firstElementChild.className = modalClass 
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
// show and hide modals

editProductBtns.forEach(editProductBtn => {
    editProductBtn.addEventListener('click' , showAddAndEditModalHandler)
})

removeProductBtns.forEach(removeProductBtn => {
    removeProductBtn.addEventListener('click' , showRemoveProductModalHandler)
})

addAndEditModal.addEventListener('click' , e => {
    if(e.target.id === 'addAndEditModal'){
        closeAddAndEditModalHandler()
    }
})

removeProductModal.addEventListener('click' , e => {
    if(e.target.id === 'removeProductModal' || e.target.id === 'closeRemoveProductModalBtn'){
        closeRemoveProductModalHandler()
    }
})

changeSearchTargetLabel.addEventListener('click' , changeSearchTargetHandler)
viewUserOrdersBtn.addEventListener('click' , showUserOrdersHandler)
menuBtn.addEventListener('click' , toggleMenu)
menu.addEventListener('click' , changeMenu)