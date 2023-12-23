import apiData from './api.js'

let showPassBtns = document.querySelectorAll('#showAndHidePass')
let tabsWrapper = document.getElementById('tabs')
let formTitle = document.getElementById('form-title')
let backBtn = document.getElementById('backBtn')

// login form elements
let passwordInput = document.getElementById('login-password')
let loginForm = document.getElementById('login-form')
let rememberMeCheckBox = document.getElementById('rememberMe')
// register form elements
let registerForm = document.getElementById('register-form')
let emailInput = document.getElementById('email')
let usernameInputs = document.querySelectorAll('#username')
let passwordErrorElem = document.getElementById('passwords-validate')
let passInput = document.getElementById('password-register')
let repeatPassInput = document.getElementById('passwordrepeat')
let registerBtn = document.getElementById('register-submitbtn')

let allInputs = document.querySelectorAll('input')
let submitBtns = document.querySelectorAll('.submitBtn')


// regEx
let emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/gi
let usernameRegEx = /^[a-z0-9]+([\._]?[a-z0-9]+)*$/gi
let passwordRegEx = /^([a-z0-9])([0-9])*?([a-z0-9]){7,16}$/gi

// User Class for creating User Object
class User {
    constructor(firstName , lastName , userName , password , email){
        this.firstName = firstName,
        this.lastName = lastName,
        this.userName = userName,
        this.password = password,
        this.email = email,
        this.role = 'user',
        this.numberOfOrders = 0,
        this.orders = null,
        this.basket = null,
        this.wishlist = null
    }
}



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
function changeTabs(e , targetTab){
    let prevNotActiveTab = tabsWrapper.querySelector('.notactive')

    let prevActiveTab = null
    if(targetTab){
        prevActiveTab = targetTab == 'Register' ? tabsWrapper.querySelector('#login-tab') : tabsWrapper.querySelector('#register-tab')
    } else {
        if(prevNotActiveTab !== e.target){
            return false
        }
    
        changeForms(e)

        // first we must remove active class from prev form tab then we must give active class to target form tab 
        prevActiveTab = e.target.innerHTML =='Register' ? e.target.previousElementSibling : e.target.nextElementSibling
    }
    prevActiveTab.classList.add('notactive')
    prevNotActiveTab.classList.remove('notactive')
}

function changeForms(e , targetForm){
    // accessing to the form wrapper accord dataset target

    let targetWrapper = null
    let prevActiveFormWrapper = null
    if(targetForm){
        targetWrapper = document.getElementById(targetForm) 
        document.title = `Show Store | ${targetForm === 'register-form'  ? 'Register' : 'Login'}`
        prevActiveFormWrapper = targetForm == 'register-form' ? targetWrapper.previousElementSibling : targetWrapper.nextElementSibling
        
    } else {
        targetWrapper = document.getElementById(e.target.dataset.target)
        document.title = `Show Store | ${e.target.dataset.target === 'register-form' ? 'Register' : 'Login'}`
        prevActiveFormWrapper = e.target.dataset.target === 'register-form' ? targetWrapper.previousElementSibling : targetWrapper.nextElementSibling
    }
    
    // first we must remove active class from prev form wrapper then we must give active class to target form wrapper 
    formTitle.innerHTML = targetForm || e.target.dataset.title
    
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
    let errorElem = e.target.parentNode.querySelector('#username-err')
    let usernameErr = document.getElementById('register-usernameErr')

    if(usernameValue.length < 8 || !usernameValue.match(usernameRegEx)){
        errorElem.classList.remove('hidden')
        disableSubmits()
    } else {
        errorElem.classList.add('hidden')
        activeSubmits()
    }

    if(usernameValue){
        usernameErr.classList.remove('hidden') 
        usernameErr.classList.add('flex')
        usernameErr.firstElementChild.classList.remove('hidden')
        usernameErr.firstElementChild.classList.add('inline-block')
    } else {
        usernameErr.classList.remove('flex')
        usernameErr.classList.add('hidden')
        usernameErr.firstElementChild.classList.remove('hidden')
        usernameErr.firstElementChild.classList.add('inline-block')
    }

    usernameErr.lastElementChild.classList.remove('inline-block')
    usernameErr.lastElementChild.classList.add('hidden')
}

async function checkUsernameExistHandler(e){ 
    let userObject = await isUserInUsers(e.target.value.toLowerCase())
    let usernameErr = document.getElementById('register-usernameErr')
    if(userObject){
        usernameErr.classList.remove('hidden') 
        usernameErr.classList.add('flex')
        usernameErr.firstElementChild.classList.add('hidden')
        usernameErr.firstElementChild.classList.remove('inline-block')
        usernameErr.lastElementChild.classList.remove('hidden')
        usernameErr.lastElementChild.classList.add('inline-block')
        disableSubmits()
    } else {
        usernameErr.classList.remove('flex')
        usernameErr.classList.add('hidden')
        usernameErr.firstElementChild.classList.remove('hidden')
        usernameErr.firstElementChild.classList.add('inline-block')
        usernameErr.lastElementChild.classList.remove('hidden')
        usernameErr.lastElementChild.classList.add('inline-block')
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
    document.cookie = `userToken=${cookieValue};path=/${expires ? (';Expires=' + expires) : ';'}`
}

async function isUserInUsers(username){
    let targetUserObject = null
    await fetch(apiData.getUsersUrl , {
        headers : {
            'apikey' : apiData.getUsersApiKey,
            'authorization' : apiData.authorization
        }
    })
    .then(res => res.json())
    .then(users => {
        targetUserObject = users.find(user => user.userName === username) 
    })
    .catch(err => console.log(err))
    
    return targetUserObject
}


async function loginUserHandler(e){
    e.preventDefault()
    let userNameInput= e.target.querySelector('#login-username')
    let passwordInput= e.target.querySelector('#login-password')
    
    let errWrapper = e.target.querySelector('#err-wrapper')
    
    let userObject = await isUserInUsers(userNameInput.value.trim().toLowerCase())
    
    if(userObject){
        if(passwordInput.value.toLowerCase() === userObject.password){
            errWrapper.classList.add('hidden')
            let successWrapper = e.target.querySelector('#success-wrapper')
            successWrapper.classList.remove('hidden')
            
            let cookieValue = `${userObject.id}-${userObject.userName}`
        
            const cookieDays = 10
            let expires = rememberMeCheckBox.checked ? getDate(cookieDays) : null
        
            // cookie value must be user id
            setCookie(cookieValue , expires)

            // redirect user to home page
            location.href = 'https://iamirsalimi.github.io/shoe-store/public/index.html'
        } else {
            errWrapper.classList.remove('hidden')
            errWrapper.innerHTML = 'Password Is incorrect'
        }
    } else {
        errWrapper.classList.remove('hidden')
        errWrapper.innerHTML = 'UserName is not exist, please register first'
    }
}

// register

async function registerUserHandler(e){
    e.preventDefault()

    let targetForm = e.target

    let firstName = targetForm.querySelector('#firstname').value.trim().toLowerCase()
    let lastName = targetForm.querySelector('#lastname').value.trim().toLowerCase()
    let email = targetForm.querySelector('#email').value.trim().toLowerCase()
    let userName = targetForm.querySelector('#username').value.trim().toLowerCase()
    let password = passInput.value.trim().toLowerCase()

    let newUserObj = new User(firstName , lastName , userName , password , email)

    await fetch(apiData.postUsersUrl , {
        method : 'POST',

        headers : {
            'Content-Type': 'application/json',
            'apikey' : apiData.postUsersApiData,
            'authorization' : apiData.authorization
        },

        body : JSON.stringify(newUserObj)
    })
    .then(res => {
        console.log(res)
        changeTabs(e , 'Login')
        changeForms(null , 'login-form')
        swal({
            title : 'Your Account Was Created Successfully' ,
            text : 'Now you can log in to your account' , 
            icon : 'success',
            timer:5000,
        })
    })
    .catch(err => {
        console.log(err)
        swal({
            title : 'Failed' ,
            text : 'please try again later' ,
            icon :  'error'
        })
    })
    .finally(clearInputs)
}

function clearInputs(){
    allInputs.forEach(input => {
        if(input.type !== 'checkbox'){
            input.value = ''
        }
    })
}


// events

backBtn.addEventListener('click' , () => {
    history.back()
})

showPassBtns.forEach(showPassBtn => {
    showPassBtn.addEventListener('click' , showPassHandler)
})

usernameInputs.forEach(usernameInput => {
    usernameInput.addEventListener('input' , usernameValidate)
    
    if(usernameInput.dataset.target === 'register-username'){
        usernameInput.addEventListener('blur' , checkUsernameExistHandler)
    }
})



document.addEventListener('DOMContentLoaded' , clearInputs)
loginForm.addEventListener('submit' , loginUserHandler)
registerForm.addEventListener('submit' , registerUserHandler)
passwordInput.addEventListener('input' , passValidate)
passInput.addEventListener('input' , passwordValidate)
repeatPassInput.addEventListener('input' , passwordValidate)
emailInput.addEventListener('input' , emailValidate)
tabsWrapper.addEventListener('click' , changeTabs)