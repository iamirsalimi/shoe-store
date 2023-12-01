import apiData from './api.js'
import {isUserInUsers , getCookies} from './api.js'


let menu = document.getElementById('menu')
let menuBtn = document.getElementById('menu-btn')
let currentPage = document.getElementById('currentPage')
let content = document.getElementById('content')

let searchInputs = document.querySelectorAll('.searchInput')

let shortCutBtns = document.querySelectorAll('.shortcut-btn')

// purchases section elems
let changeSearchTargetCheckBox = document.getElementById('changeSearchTargetCheckBox')
let changeSearchTargetLabel = document.querySelector('#changeSearchTarget label')
let viewUserOrdersBtn = document.getElementById('viewUserOrdersBtn')
let addNewProductBtn = document.getElementById('addNewProduct') 

let addAndEditModal = document.getElementById('addAndEditModal') 
let removeProductModal = document.getElementById('removeProductModal')

let addAndEditProductForm = document.querySelector('#addAndEditModal form') 
let removeProductBtn = document.querySelector('#removeProductModal #removeProductBtn')

// users section elems
let updateUserBtn = document.getElementById('updateUserBtn')
let removeUserBtn = document.getElementById('removeUserBtn')
let userRoleSelect = document.getElementById('userRoleSelect')

let targetElem = null
let currentTab = 'Dashboard'
let searchTarget = 'Customer Id'
let productTargetOperation = null
let productId = null
let tableFragment = document.createDocumentFragment()
let usersTableFragment = document.createDocumentFragment()
let targetProductObj = null
let targetUserObj = null
let deleteModalTarget = null

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

function showDetailsHandler(detailsWrapper){
    console.log(detailsWrapper);
    detailsWrapper.classList.remove('hidden')
    detailsWrapper.classList.add('flex')
    detailsWrapper.nextElementSibling.classList.add('hidden')
}

function hideDetailsHandler(detailsWrapper){
    console.log(detailsWrapper);
    detailsWrapper.classList.remove('flex')
    detailsWrapper.classList.add('hidden')
    detailsWrapper.nextElementSibling.classList.remove('hidden')
}

function showProductDetailsHandler(productObj){
    let productDetailWrapper = document.querySelector('#productDetailWrapper').firstElementChild
    showDetailsHandler(productDetailWrapper)

    let productImgElem = productDetailWrapper.querySelector('.productDetailImgWrapper img')
    let productIdElem = productDetailWrapper.querySelector('.productIdWrapper').lastElementChild
    let productNameElem = productDetailWrapper.querySelector('.productNameWrapper').lastElementChild
    let productSummaryElem = productDetailWrapper.querySelector('.productSummaryWrapper').lastElementChild
    let productDescElem = productDetailWrapper.querySelector('.productDescWrapper').lastElementChild
    let imagePathElem = productDetailWrapper.querySelector('.imagePathWrapper').lastElementChild
    let isInSliderWrapper = productDetailWrapper.querySelector('.isInSliderWrapper').lastElementChild
    let productSizesElem = productDetailWrapper.querySelector('.productsSizeDetail')
    let productColorsElem = productDetailWrapper.querySelector('.productsColorDetail')
    let productCategoryElem = productDetailWrapper.querySelector('.productCategoryWrapper').lastElementChild
    let orderNumberElem = productDetailWrapper.querySelector('.orderNumberWrapper').lastElementChild
    let productReviewsElem = productDetailWrapper.querySelector('.productReviewsWrapper').lastElementChild
    let priceElem = productDetailWrapper.querySelector('.priceWrapper').lastElementChild
    let discountElem = productDetailWrapper.querySelector('.discountWrapper').lastElementChild
    let finalPriceElem = productDetailWrapper.querySelector('.finalPriceWrapper').lastElementChild

    productImgElem.src = `./images/${productObj.imagePath}`
    productIdElem.innerHTML = productObj.id
    productNameElem.innerHTML = productObj.productName
    productSummaryElem.innerHTML = productObj.productSummary
    productDescElem.innerHTML = productObj.productDesc
    imagePathElem.innerHTML = productObj.imagePath
    isInSliderWrapper.innerHTML = productObj.isInSlider
    isInSliderWrapper.className = `text-${productObj.isInSlider ? 'green' : 'red'}-500`

    productSizesElem.innerHTML = productObj.sizes.split(' ').map(size => `<span>${size}</span>`).join('')

    productColorsElem.innerHTML = productObj.colors.split(' ').map(color => `<span class="inline-block w-3 h-3 rounded-full bg-${(color =='white' || color == 'black') ? color : color + '-500'} ${color == 'white' ? 'border border-gray-400' : ''}"></span>`).join('')
    
    productCategoryElem.innerHTML = productObj.productCategory
    orderNumberElem.innerHTML = productObj.orderNumbers
    productReviewsElem.innerHTML = productObj.reviews?.length || 0 
    priceElem.innerHTML = `$${productObj.price}`
    discountElem.innerHTML = `${productObj.discount}%`
    finalPriceElem.innerHTML = `$${productObj.finalPrice}`
}

function showUserDetailsHandler(userObj){
    let userDetailWrapper = document.querySelector('#UserDetailWrapper').firstElementChild
    showDetailsHandler(userDetailWrapper)

    let userIdElem = userDetailWrapper.querySelector('.userIdWrapper').lastElementChild
    let userFullNameElem = userDetailWrapper.querySelector('.userFullNameWrapper').lastElementChild
    let usernameElem = userDetailWrapper.querySelector('.usernameWrapper').lastElementChild
    let userEmailElem = userDetailWrapper.querySelector('.userEmailWrapper').lastElementChild
    let userNumOfOrdersElem = userDetailWrapper.querySelector('.userNumOfOrdersWrapper').lastElementChild
    let userViewOrdersBtn = userDetailWrapper.querySelector('.userOrdersBtn').lastElementChild
    let userRoleElem = userDetailWrapper.querySelector('.userRoleWrapper').lastElementChild

    userIdElem.innerHTML = userObj.id
    userFullNameElem.innerHTML = `${userObj.firstName} ${userObj.lastName}` 
    usernameElem.innerHTML = userObj.userName
    userEmailElem.innerHTML = userObj.email
    userNumOfOrdersElem.innerHTML = userObj.numberOfOrders 
    userViewOrdersBtn.setAttribute('data-customerId' , userObj.id)
    userRoleElem.innerHTML = userObj.role
    userRoleSelect.value = userObj.role
    
    targetUserObj = userObj
}

async function updateUserRoleHandler(){
    // Checking whether the previous value differs from the new value or not, so that if there is no difference (previous value and new value were same), the request for information update will not be made.
    if(userRoleSelect.value == targetUserObj.role){
        Swal.fire({
            icon: "info",
            title: 'No new information has been entered to update user information',
            showConfirmButton: false,
            timer: 3000
        })
    } else {
        let newUserRole = {
            role : userRoleSelect.value
        }

        if(targetUserObj.id == 1){
            Swal.fire({
                icon: "info",
                title: 'You cannot change the information of this admin',
                showConfirmButton: false,
                timer: 3000
            })
           } else {
            
            await fetch(`${apiData.updateUsersUrl}${targetUserObj.id}` , {
                method : 'PATCH',
    
                headers : {
                    'Content-type' : 'application/json',
                    'apikey' : apiData.updateUsersApiKey,
                    'authorization' : apiData.authorization
                },
    
                body : JSON.stringify(newUserRole)
            })
            .then(res => {
                console.log(res)
                if([205 , 204 , 203 , 202 , 201 ,200].includes(res.status)){
                    Swal.fire({
                        icon: "success",
                        title: `User with ${targetUserObj.id} ID Was Updated`,
                        showConfirmButton: false,
                        timer: 3000
                    })

                    targetUserObj.role = newUserRole.role
                    getUsersHandler()
                } else {
                    Swal.fire({
                    icon: "error",
                    title: `${res.status} Error`,
                    text: "Something went wrong! please try again later",
                    timer: 3000
                    });
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
    }
}

async function removeUserHandler(){
    if(targetUserObj.role == 'admin'){
        Swal.fire({
            icon: "info",
            title: 'You cannot delete admins',
            showConfirmButton: false,
            timer: 3000
        })
    } else {
        await fetch(`${apiData.deleteUsersUrl}${targetUserObj.id}` , {
            method : 'DELETE',
        
            headers : {
                'apikey' : apiData.deleteUsersApiKey,
                'authorization' : apiData.authorization
            }
        })
        .then(res => {
            console.log(res)
            if([205 , 204 , 203 , 202 , 201 ,200].includes(res.status)){
                Swal.fire({
                    icon: "success",
                    title: `User with ${targetUserObj.id} ID Was Deleted`,
                    showConfirmButton: false,
                    timer: 3000
                })
        
                let userDetailWrapper = document.querySelector('#UserDetailWrapper').firstElementChild
                hideDetailsHandler(userDetailWrapper)
                getUsersHandler()
                closeRemoveProductModalHandler()
            } else {
                Swal.fire({
                icon: "error",
                title: `${res.status} Error`,
                text: "Something went wrong! please try again later",
                timer: 3000
                });
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
}


function showOrderDetail(targetDetailsWrapper , targetObj){
    window.scrollTo(0,0)
    content.scrollTo(0,0)

    if(targetDetailsWrapper == 'product'){
        showProductDetailsHandler(targetObj)
    } else if(targetDetailsWrapper == 'user'){
        showUserDetailsHandler(targetObj)
    } 
    // else if(targetDetailsWrapper == 'purchases'){
    //     showPurchasesDetailsHandler(targetObj)
    // }
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

// products section

// show And Hide modals
function showAddAndEditModalHandler(e , productObj){
    clearInputs()
    targetProductObj = productObj
    
    productId = productObj?.id
    let targetOperation = e.target.dataset.target

    let modalWrapperClass = addAndEditModal.className
    let modalClass = addAndEditModal.firstElementChild.className
    
    let modalTitle = addAndEditModal.querySelector('h2')
    let modalSubmitBtn = addAndEditModal.querySelector('button')

    modalTitle.innerHTML = targetOperation === 'PUSH' ? 'Add Product' : 'Edit Product Details'  
    modalSubmitBtn.innerHTML = targetOperation === 'PUSH' ? 'Add Product' : 'Edit Product'

    modalWrapperClass = modalWrapperClass.replace('-z-10' , 'z-30')
    modalWrapperClass = modalWrapperClass.replace('bg-black/0' , 'bg-black/50')
    
    modalClass = modalClass.replace('opacity-0' , 'opacity-100')
    
    addAndEditModal.className = modalWrapperClass
    addAndEditModal.firstElementChild.className = modalClass 

    productTargetOperation = targetOperation 
}

function showRemoveProductModalHandler(e){
    productId = e.target.dataset.productid
    deleteModalTarget = e.target.dataset.target

    let modalWrapperClass = removeProductModal.className
    let modalClass = removeProductModal.firstElementChild.className
    let removeModalTitle = removeProductModal.querySelector('span')

    removeModalTitle.innerHTML = deleteModalTarget
    removeProductBtn.innerHTML = `Remove ${deleteModalTarget}`

    modalWrapperClass = modalWrapperClass.replace('-z-10' , 'z-30')
    modalWrapperClass = modalWrapperClass.replace('bg-black/0' , 'bg-black/50')
    
    modalClass = modalClass.replace('opacity-0' , 'opacity-100')
    
    removeProductModal.className = modalWrapperClass
    removeProductModal.firstElementChild.className = modalClass 
}

function closeAddAndEditModalHandler(){
    let modalWrapperClass = addAndEditModal.className
    let modalClass = addAndEditModal.firstElementChild.className
    
    modalWrapperClass = modalWrapperClass.replace('z-30' , '-z-10')
    modalWrapperClass = modalWrapperClass.replace('bg-black/50' , 'bg-black/0')
    
    modalClass = modalClass.replace('opacity-100' , 'opacity-0')
    
    addAndEditModal.className = modalWrapperClass
    addAndEditModal.firstElementChild.className = modalClass 
    targetProductObj = null
}

function closeRemoveProductModalHandler(){
    let modalWrapperClass = removeProductModal.className
    let modalClass = removeProductModal.firstElementChild.className
    
    modalWrapperClass = modalWrapperClass.replace('z-30' , '-z-10')
    modalWrapperClass = modalWrapperClass.replace('bg-black/50' , 'bg-black/0')
    
    modalClass = modalClass.replace('opacity-100' , 'opacity-0')
    
    removeProductModal.className = modalWrapperClass
    removeProductModal.firstElementChild.className = modalClass 
}

// set and update products

// set new Product
async function setProductsHandler(newProductObj){
    await fetch(apiData.postProductsUrl , {
        method : 'POST' , 
        
        headers : {
            'Content-Type': 'application/json',
            'apikey' : apiData.postProductsApiData,
            'authorization' : apiData.authorization
        },

        body : JSON.stringify(newProductObj)
    })
    .then(res => {
        console.log(res)
        Swal.fire({
            icon: "success",
            title: "Product Was Added",
            showConfirmButton: false,
            timer: 2000
        })
        getProductsHandler()
        clearInputs()
    })
    .catch(err =>{
        console.log(err)
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        timer: 2000
        });
    })
}

// update products
async function updateProductHandler(newProductObj){
    delete targetProductObj.id

    // Checking whether the previous value differs from the new value or not, so that if there is no difference, the request for information update will not be made.
    if(JSON.stringify(newProductObj) === JSON.stringify(targetProductObj)){
        
        Swal.fire({
            icon: "info",
            title: "The changes were not applied because no new information was entered",
            showConfirmButton: false,
            timer: 5000
          });

        closeAddAndEditModalHandler()
    } else {
        await fetch(`${apiData.updateProductsUrl}${productId}` , {
            method : 'PATCH' , 
            
            headers : {
                'Content-Type': 'application/json',
                'apikey' : apiData.updateProductsApiKey,
                'authorization' : apiData.authorization
            },
    
            body : JSON.stringify(newProductObj)
        })
        .then(res => {
            console.log(res)
            if([205 , 204 , 203 , 202 , 201 ,200].includes(res.status)){
                Swal.fire({
                    icon: "success",
                    title: "Product Was Added",
                    showConfirmButton: false,
                    timer: 3000
                })
                getProductsHandler()
                clearInputs()
            } else {
                Swal.fire({
                icon: "error",
                title: `${res.status} Error`,
                text: "Something went wrong! please try again later",
                timer: 3000
                });
            }
        })
        .catch(err =>{
            console.log(err)
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! please try again later",
            timer: 3000
            });
        })
    }
}

async function addAndEditProductHandler(e){
    e.preventDefault()
    
    let targetForm = e.target

    let productName = targetForm.querySelector('#productName').value.trim()
    let productSummary = targetForm.querySelector('#productSummary').value.trim()
    let price = parseFloat(targetForm.querySelector('#productPrice').value.trim())
    let sizes = targetForm.querySelector('#productSizes').value.trim()
    let colors = targetForm.querySelector('#productColors').value.trim()
    let imagePath = targetForm.querySelector('#productImagePath').value.trim()
    let discount = parseFloat(targetForm.querySelector('#productDiscount').value.trim())
    let productCategory = targetForm.querySelector('#productCategory').value
    let productDesc = targetForm.querySelector('#productDesc').value.trim()
    let isInSlider = targetForm.querySelector('#isInSliderCheckbox').checked

    let finalPrice = price - ((parseInt(price) * parseInt(discount)) / 100).toFixed(1) 

    let newProductObj = {
        productName,
        productSummary,
        productDesc,
        imagePath,
        isInSlider,
        sizes,
        colors,
        productCategory,
        orderNumbers : targetProductObj?.orderNumbers || 0,
        reviews : targetProductObj?.reviews || null,
        price,
        discount,
        finalPrice,
    }

    if(productTargetOperation === 'PUSH'){
        setProductsHandler(newProductObj)
    } else {
        updateProductHandler(newProductObj)
    }

    getProductsHandler()
    closeAddAndEditModalHandler()
}

// delete Product
async function deleteProductHandler(){
    fetch(`${apiData.deleteProductsUrl}${productId}` , {
        method:'DELETE',
        
        headers : {
            'apikey' : apiData.deleteProductsApiKey,
            'authorization' : apiData.authorization
        }
    })
    .then(res => {
        console.log(res)
        if([205 , 204 , 203 , 202 , 201 ,200].includes(res.status)){
            Swal.fire({
                icon: "success",
                title: `Product with ${productId} ID Was Removed`,
                showConfirmButton: false,
                timer: 3000
            })
            
            let productDetailWrapper = document.querySelector('#productDetailWrapper').firstElementChild
            showDetailsHandler(productDetailWrapper)
            getProductsHandler()
            clearInputs()
        } else {
            Swal.fire({
            icon: "error",
            title: `${res.status} Error`,
            text: "Something went wrong! please try again later",
            timer: 3000
            });
        }
    })
    .catch(err =>{
        console.log(err)
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! please try again later",
        timer: 3000
        });
    })

    closeRemoveProductModalHandler()
}


function clearInputs(){
    let allInputs = document.querySelectorAll('input')
    let textarea = document.querySelector('textarea')
    let selectBox = document.querySelector('#addAndEditModal #productCategory')
    textarea.value = ''
    selectBox.value = 'All'

    allInputs.forEach(input => {
        if(input.type != 'checkbox'){
            input.value = ''
        } else {
            input.checked = false
        }
    })
}

// getting users and products and purchases
function createUsersRowHandler(users){
    let usersTable = document.querySelector('.usersTableShortCutWrapper')
    let mainUsersTable =  document.querySelector('#UsersTable')

    mainUsersTable.innerHTML = ''
    usersTable.innerHTML = ''

    users.sort((a , b) => a.id - b.id)

    users.forEach(user => {
        // users Shortcut Table 
        let divElem = document.createElement('div')
        divElem.className = 'flex items-center justify-between  bg-gray-100 even:bg-white px-1  rounded lg:py-2 lg:px-4'

        let userIdSpan = document.createElement('span')
        userIdSpan.className = 'text-gray-800 rounded font-semibold lg:text-lg'
        userIdSpan.innerHTML = user. id
        
        let userFullNameSpan = document.createElement('span')
        userFullNameSpan.className = 'text-gray-800 rounded font-semibold lg:text-lg'
        userFullNameSpan.innerHTML = `${user.firstName} ${user.lastName}` 
        
        let userNameSpan = document.createElement('span')
        userNameSpan.className = 'text-gray-800 rounded font-semibold lg:text-lg'
        userNameSpan.innerHTML = user.userName
        
        let userRoleSpan = document.createElement('span')
        userRoleSpan.className = 'text-gray-800 rounded font-semibold lg:text-lg'
        userRoleSpan.innerHTML = user.role

        divElem.append(userIdSpan , userFullNameSpan , userNameSpan , userRoleSpan)
        usersTableFragment.append(divElem)

        // main Users Table
        let trElem = document.createElement('tr')
        trElem.className = 'even:bg-white odd:bg-gray-100 hover:bg-gray-200 transition-colors'

        let userIdTdElem = document.createElement('td')
        userIdTdElem.className = 'px-[2px] text-center text-gray-500'
        userIdTdElem.innerHTML = user.id
        
        let userNameTdElem = document.createElement('td')
        userNameTdElem.className = 'text-center text-gray-800'
        userNameTdElem.innerHTML = `${user.firstName} ${user.lastName}`
        
        let usernameTdElem = document.createElement('td')
        usernameTdElem.className = 'UserId px-[2px] text-center text-gray-800'
        usernameTdElem.innerHTML = user.userName

        let userEmailTdElem = document.createElement('td')
        userEmailTdElem.className = 'px-[2px] text-center text-gray-800'
        userEmailTdElem.innerHTML = user.email
        
        let userRoleTdElem = document.createElement('td')
        userRoleTdElem.className = 'px-[2px] text-center text-gray-800'
        userRoleTdElem.innerHTML = user.role

        let viewUserDetailsTdWrapper = document.createElement('td')
        viewUserDetailsTdWrapper.className = 'text-center'

        let viewUserDetailsBtn = document.createElement('button')
        viewUserDetailsBtn.className = 'showOrderDetailsBtn w-full py-1 px-2 rounded-md  text-sky-500 hover:bg-sky-500 hover:text-white transition-colors font-bold text-center cursor-pointer' 
        viewUserDetailsBtn.innerHTML = 'View'
        viewUserDetailsBtn.addEventListener('click' ,() => showOrderDetail('user' , user))

        viewUserDetailsTdWrapper.append(viewUserDetailsBtn)

        trElem.append(userIdTdElem , userNameTdElem , usernameTdElem , userEmailTdElem , userRoleTdElem , viewUserDetailsTdWrapper)
        tableFragment.append(trElem)
    })

    usersTable.append(usersTableFragment)

    mainUsersTable.append(tableFragment)
}

async function getUsersHandler(){
    await fetch(apiData.getUsersUrl , {
        headers : {
            'apikey' : apiData.getUsersApiKey,
            'authorization' : apiData.authorization
        }
    })
    .then(res => res.json())
    .then(users => createUsersRowHandler(users))
    .catch(err => console.log(err))
}

function createProductsRowHandler(products){
    let productsTable =  document.querySelector('#ProductsTable') 

    productsTable.innerHTML = ''

    products.sort((a, b) => a.id - b.id)

    products.forEach(product => {
        let trElem = document.createElement('tr')
        trElem.className = 'even:bg-white odd:bg-gray-100 hover:bg-gray-200 transition-colors'

        let productIdTdElem = document.createElement('td')
        productIdTdElem.className = 'ProductId px-[2px] text-center text-gray-500'
        productIdTdElem.innerHTML = product.id

        let productNameTdElem = document.createElement('td')
        productNameTdElem.className = 'text-center text-gray-800'
        productNameTdElem.innerHTML = product.productName
        
        let orderNumbersTdElem = document.createElement('td')
        orderNumbersTdElem.className = 'px-[2px] text-center text-gray-800'
        orderNumbersTdElem.innerHTML = product.orderNumbers
        
        let productPriceTdElem = document.createElement('td')
        productPriceTdElem.className = 'UserId px-[2px] text-center text-gray-800'
        productPriceTdElem.innerHTML = `$${product.finalPrice}`
        
        let isInSliderTdELem = document.createElement('td')
        isInSliderTdELem.className = `px-[2px] text-center text-${product.isInSlider ? 'green' : 'red'}-500`
        isInSliderTdELem.innerHTML = product.isInSlider

        let productBtnTdWrapper = document.createElement('td')
        productBtnTdWrapper.className = 'text-center'

        let viewProductDetailsBtn = document.createElement('button')
        viewProductDetailsBtn.className = 'bg-green-100 hover:bg-green-200 transition-colors rounded p-[2px]' 
        viewProductDetailsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 stroke-green-700 pointer-events-none">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>`
        viewProductDetailsBtn.title = 'View More Details'
        viewProductDetailsBtn.addEventListener('click' ,() => showOrderDetail('product' , product))
        
        let editProductBtn = document.createElement('button')
        editProductBtn.className = 'editProductBtn bg-sky-100 hover:bg-sky-200 transition-colors rounded p-[2px]'
        editProductBtn.setAttribute('data-target' , 'PATCH')
        editProductBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 stroke-sky-700 pointer-events-none">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>`
        editProductBtn.title = 'Edit Product'
        editProductBtn.addEventListener('click' , e => {
            showAddAndEditModalHandler(e , product)
            
            let productName = addAndEditModal.querySelector('#productName')
            let productSummary = addAndEditModal.querySelector('#productSummary')
            let price = addAndEditModal.querySelector('#productPrice')
            let sizes = addAndEditModal.querySelector('#productSizes')
            let colors = addAndEditModal.querySelector('#productColors')
            let imagePath = addAndEditModal.querySelector('#productImagePath')
            let discount = addAndEditModal.querySelector('#productDiscount')
            let productCategory = addAndEditModal.querySelector('#productCategory')
            let productDesc = addAndEditModal.querySelector('#productDesc')
            let isInSlider = addAndEditModal.querySelector('#isInSliderCheckbox')
        
            productName.value = product.productName
            productSummary.value = product.productSummary
            price.value = product.price
            sizes.value = product.sizes
            colors.value = product.colors
            imagePath.value = product.imagePath
            discount.value = product.discount
            productCategory.value = product.productCategory
            // for old Browsers we must change select box value with selectedIndex
            productCategory.selectedIndex = product.productCategory == 'All' ?  0 : product.productCategory == 'Men' ? 1 : product.productCategory == 'Women' ? 2 : 3     
            productDesc.value = product.productDesc
            isInSlider.checked = product.isInSlider
        })
        
        let deleteProductsBtn = document.createElement('button')
        deleteProductsBtn.className = `bg-red-100 hover:bg-red-200 transition-colors rounded p-[2px]`
        deleteProductsBtn.setAttribute('data-productId' , product.id)
        deleteProductsBtn.setAttribute('data-target' , 'product')
        deleteProductsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 stroke-red-700 pointer-events-none">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>` 
            deleteProductsBtn.title = 'View More Details'
        deleteProductsBtn.addEventListener('click' , showRemoveProductModalHandler)
            

        productBtnTdWrapper.append(viewProductDetailsBtn , editProductBtn , deleteProductsBtn)
        trElem.append(productIdTdElem , productNameTdElem , orderNumbersTdElem , productPriceTdElem , isInSliderTdELem , productBtnTdWrapper,)
        tableFragment.append(trElem)
    })
    productsTable.append(tableFragment)
}

async function getProductsHandler(){
    await fetch(apiData.getProductsUrl , {
        headers : {
            'apikey' : apiData.getProductsApiKey,
            'authorization' : apiData.authorization
        }
    })
    .then(res => res.json())
    .then(products => createProductsRowHandler(products))
    .catch(err => console.log(err))
}

function showUserInfos(userObj){
    let userInfoWrapper = document.querySelector('#userInfo')

    let userFirstName = userInfoWrapper.querySelector('.userFirstNameDetail').lastElementChild
    let userLastName = userInfoWrapper.querySelector('.userLastNameDetail').lastElementChild
    let userEmail = userInfoWrapper.querySelector('.userEmailDetail').lastElementChild
    let userName = userInfoWrapper.querySelector('.userNameDetail').lastElementChild

    userFirstName.innerHTML = userObj.firstName
    userLastName.innerHTML = userObj.lastName
    userEmail.innerHTML = userObj.email
    userName.innerHTML = userObj.userName
}

async function getInfosHandler(){
    clearInputs()

    let userToken = getCookies()
    let userObj = await isUserInUsers(userToken) 
    // if user wasn't admin we must redirect him/her to home page
    
    if(userObj?.role === 'admin'){
        // let purchasesTable = document.querySelector('#PurchasesTable')  
        showUserInfos(userObj)
        try{
            await getUsersHandler()
            await getProductsHandler()

        } catch(err){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong! please refresh the page",
                timer: 5000
            });
        }
    } else {
        location.href = 'http://127.0.0.1:5500/public/index.html'
    }
}

function deleteHandler(){
    if(deleteModalTarget == 'user'){
        removeUserHandler()
    } else if(deleteModalTarget == 'product') {
        deleteProductHandler()
    }
}

// events

shortCutBtns.forEach(shortCutBtn => {
    shortCutBtn.addEventListener('click' , changeContent)
})

searchInputs.forEach(searchInput => {
    searchInput.addEventListener('keyup' , searchHandler)
})
// show and hide modals

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

updateUserBtn.addEventListener('click' , updateUserRoleHandler)
removeUserBtn.addEventListener('click' , showRemoveProductModalHandler)
removeProductBtn.addEventListener('click' , deleteHandler)
document.addEventListener('DOMContentLoaded', getInfosHandler)
addAndEditProductForm.addEventListener('submit' ,  addAndEditProductHandler)
addNewProductBtn.addEventListener('click' , showAddAndEditModalHandler)
changeSearchTargetLabel.addEventListener('click' , changeSearchTargetHandler)
viewUserOrdersBtn.addEventListener('click' , showUserOrdersHandler)
menuBtn.addEventListener('click' , toggleMenu)
menu.addEventListener('click' , changeMenu)