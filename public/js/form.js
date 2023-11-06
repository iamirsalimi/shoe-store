let showPassBtns = document.querySelectorAll('#showAndHidePass')
let tabsWrapper = document.getElementById('tabs')
let formTitle = document.getElementById('form-title')
let backBtn = document.getElementById('backBtn')

// login form elements
let passwordInput = document.getElementById('password')
let loginBtn = document.getElementById('login-submitbtn')
let rememberMeCheckBox = document.getElementById('rememberMe')
// register form elements
let emailInput = document.getElementById('email')
let usernameInputs = document.querySelectorAll('#username')
let passwordErrorElem = document.getElementById('passwords-validate')
let passInput = document.getElementById('password-register')
let repeatPassInput = document.getElementById('passwordrepeat')
let registerBtn = document.getElementById('register-submitbtn')


let submitBtns = document.querySelectorAll('#submitBtn')

// regEx
let emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/gi
let usernameRegEx = /^[a-z0-9]+([\._]?[a-z0-9]+)*$/gi
let passwordRegEx = /^([a-z0-9])([0-9])*?([a-z0-9]){8,16}$/g

function showPassHandler(e){
    // user may click on svg's path And to avoid errors , we must have SVG in any case
    let targetElem = e.target.tagName == 'svg' ? e.target : e.target.parentNode
    let targetPasswordInput = targetElem.parentNode.parentNode.firstElementChild

    if(targetElem.id === 'showPassBtn'){
        targetPasswordInput.type = 'text'
        targetElem.nextElementSibling.classList.remove('hidden')
    } else {
        targetPasswordInput.type = 'password'
        targetElem.previousElementSibling.classList.remove('hidden')
    }
    
    targetElem.classList.add('hidden')
}

// changing tabs
function changeTabs(e){
    let prevNotActiveTab = tabsWrapper.querySelector('.notactive')

    if(prevNotActiveTab !== e.target){
        return false
    }


    changeForms(e)
    
    // first we must remove active class from prev form tab then we must give active class to target form tab 
    let prevActiveTab = e.target.innerHTML =='Register' ? e.target.previousElementSibling : e.target.nextElementSibling

    prevActiveTab.classList.add('notactive')
    e.target.classList.remove('notactive')
}

function changeForms(e){
    // accessing to the form wrapper accord dataset target
    let targetWrapper = document.getElementById(e.target.dataset.target)
    formTitle.innerHTML = e.target.dataset.title

    // first we must remove active class from prev form wrapper then we must give active class to target form wrapper 
    let prevActiveFormWrapper = e.target.dataset.target === 'register-form' ? targetWrapper.previousElementSibling : targetWrapper.nextElementSibling
    
    prevActiveFormWrapper.classList.remove('active')
    targetWrapper.classList.add('active')
}

function emailValidate(e){
    let emailValue = e.target.value.trim() 
    let errorElem = e.target.parentNode.lastElementChild
    if(emailValue && !emailValue.match(emailRegEx)){
        errorElem.classList.remove('hidden')
        disableSubmits()
    } else {
        errorElem.classList.add('hidden')
        activeSubmits()
    }
}

function usernameValidate(e){
    let usernameValue = e.target.value.trim() 
    let errorElem = e.target.parentNode.lastElementChild

    if(usernameValue && !usernameValue.match(usernameRegEx)){
        errorElem.classList.remove('hidden')
        disableSubmits()
    } else {
        errorElem.classList.add('hidden')
        activeSubmits()
    }
}


function passValidate(e){
    let passValue = e.target.value.trim() 
    let errorElem = e.target.parentNode.lastElementChild
    
    if(passValue && !passValue.match(passwordRegEx)){
        errorElem.classList.remove('hidden')
        disableSubmits()
    } else {
        errorElem.classList.add('hidden')
        activeSubmits()
    }
}

function passwordValidate(e){
    let passValue = passInput.value.trim()
    let repeatPassValue = repeatPassInput.value.trim()

    // Checking that if the inputs are not empty and the input values ​​are not equal, an error will be displayed to the user
    passValidate(e)

    if(!(passValue === repeatPassValue)){
        passwordErrorElem.classList.remove('hidden')
        disableSubmits()
    } else {
        passwordErrorElem.classList.add('hidden')
    }
}

function disableSubmits(){
    submitBtns.forEach(submitBtn => {
        submitBtn.setAttribute('disabled' , 'true')
    })
}

function activeSubmits(){
    submitBtns.forEach(submitBtn => {
        submitBtn.removeAttribute('disabled' , 'true')
    })
}

// login
function getDate(days){
    let now = new Date()

    now.setTime(now.getTime() + (days * 24 * 60 * 60 * 1000))

    return now
}

function setCookie(cookieValue , expires){
    document.cookie = `userId=${cookieValue};path=/${expires ? (';Expires=' + expires) : ';'}`
    console.log(document.cookie);
}

function loginUser(e){
    let cookieValue = 5

    const cookieDays = 10
    let expires = rememberMeCheckBox.checked ? getDate(cookieDays) : null

    // cookie value must be user id
    setCookie(cookieValue , expires)
}


loginBtn.addEventListener('click' , loginUser)
// register


// events

backBtn.addEventListener('click' , () => {
    history.back()
})

showPassBtns.forEach(showPassBtn => {
    showPassBtn.addEventListener('click' , showPassHandler)
})

usernameInputs.forEach(usernameInput => {
    usernameInput.addEventListener('input' , usernameValidate)
})

passwordInput.addEventListener('input' , passValidate)
passInput.addEventListener('input' , passwordValidate)
repeatPassInput.addEventListener('input' , passwordValidate)
emailInput.addEventListener('input' , emailValidate)
tabsWrapper.addEventListener('click' , changeTabs)

