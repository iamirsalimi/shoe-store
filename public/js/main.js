let hamburger = document.getElementById('hamburger-menu')
let menu = document.getElementById('menu')
let closeModalBtn = document.getElementById('closeModalBtn')
let navElems = document.querySelectorAll('nav ul')



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

// changing root and active class to Element
const changeRoot = e => {
    if(e.target.tagName == "A"){
        let prevLink = e.target.parentNode.parentNode.querySelector('.active')
        prevLink.classList.remove('active')
        e.target.parentNode.classList.add('active')
    }
}

// when user click on darkness that placed in right of the menu menu must closed
document.addEventListener('click' , e => {
    if(e.target.id === 'menu-wrapper'){
        closeMenu()
    }
})

navElems.forEach(nav => {
    nav.addEventListener('click' , changeRoot)
})
hamburger.addEventListener('click' , showMenu)
closeModalBtn.addEventListener('click' , closeMenu)

let swiperSlider = new Swiper('.swiper' , {
    loop : true,
    slidePerView : 3,
    fade : true ,
    spaceBetween : 10,
    autoplay: {
        delay: 2500,
    },
    // navigation: {
    //     nextEl: '#swiper-button-next',
    //     prevEl: '#swiper-button-prev',
    //  },
      breakpoints : {
        0 : {
            slidesPerView : 1,  
        },
        480 : {
            slidesPerView : 2 ,
        },
        768 : {
            slidesPerView : 3 ,
        } 
      }
})