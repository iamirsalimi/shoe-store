let apiData = {
    // users api data
    getUsersUrl : "https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/UsersTable?select=*",
    getUsersApiKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY",

    updateUsersUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/UsersTable?some_column=eq.',
    updateUsersApiKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',

    deleteUsersUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/UsersTable?some_column=eq.',
    deleteUsersApiKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',

    postUsersUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/UsersTable',
    postUsersApiData : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',
    
    // products api data
    getProductsUrl : "https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/Products?select=*",
    getProductsApiKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY",
    
    updateProductsUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/Products?some_column=eq.',
    updateProductsApiKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',

    deleteProductsUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/Products?some_column=eq.',
    deleteProductsApiKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',
    
    postProductsUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/Products',
    postProductsApiData : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',
    
    // purchases
    getPurchasesUrl : "https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/PurchasesTable?select=*",
    getPurchasesApiKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY",
    
    postPurchasesUrl : 'https://ggyvmzjvnhinwptohcap.supabase.co/rest/v1/PurchasesTable',
    postPurchasesApiData : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY',

    authorization : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXZtemp2bmhpbndwdG9oY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MTEwNzksImV4cCI6MjAwNzA4NzA3OX0.6wZXdw6rDjT_BvSUX_KwCqTRQiC-vvrpeYrraNed7NY'
}

function getCookies(){
    let userCookies = document.cookie.split(';')
    let mainUserCookie = null

    userCookies.find(userCookie => {
        if(userCookie.includes('userToken')){
            mainUserCookie = userCookie.slice((userCookie.indexOf('=')+ 1)).split('-')
        }
    })

    // index 0 of mainUserCookie array is userId and index 1 is his/her username
    return mainUserCookie
}

async function isUserInUsers(userToken){
    let targetUserObject = null

    await fetch(apiData.getUsersUrl , {
        headers : {
            'apikey' : apiData.getUsersApiKey,
            'authorization' : apiData.authorization
        }
    })
    .then(res => res.json())
    .then(users => {
        targetUserObject = users.find(user => user.id == userToken[0] && user.userName == userToken[1]) 
    })
    .catch(err => console.log(err))
    
    return targetUserObject
}


async function getUsersAndProductsHandler(){
    let loginAndPanelWrapper = document.querySelector('#user-register')
    let userBasketBtn = document.querySelector('#basketBtn')
    let userToken = getCookies()
    
    if(userToken){
        let userObj = await isUserInUsers(userToken)
        console.log(userObj)
        
        // If there is a user token, we must show the first child that is linked to the panels and hide the second child that is linked to the registration and login form.
        if(userObj){
            loginAndPanelWrapper.firstElementChild.classList.remove('hidden')
            loginAndPanelWrapper.firstElementChild.classList.add('flex')
            loginAndPanelWrapper.lastElementChild.classList.remove('flex')
            loginAndPanelWrapper.lastElementChild.classList.add('hidden')
            
            loginAndPanelWrapper.firstElementChild.href = `./${userObj.role}Panel.html`
            loginAndPanelWrapper.firstElementChild.lastElementChild.innerHTML = `${userObj.role}Panel`

            if(userObj.role == 'admin'){
                userBasketBtn.classList.add('hidden')
            } else {
                // Quantifying the number of products in the user's shopping cart
                userBasketBtn.lastElementChild.innerHTML = userObj.basket || 0
            }


        } else {
            loginAndPanelWrapper.lastElementChild.classList.remove('hidden')
            loginAndPanelWrapper.lastElementChild.classList.add('flex')
            loginAndPanelWrapper.firstElementChild.classList.remove('flex')
            loginAndPanelWrapper.firstElementChild.classList.add('hidden')
        }



        console.log(loginAndPanelWrapper.firstElementChild , loginAndPanelWrapper.lastElementChild);
    }
}

export {getUsersAndProductsHandler , getCookies , isUserInUsers}
export default apiData