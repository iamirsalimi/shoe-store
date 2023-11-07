let aboutUsWrapper = document.getElementById('about-us')
let aboutUsElems = document.querySelectorAll('#about-us #accordion')


function showAboutUsContent(e){
    let targetElem = null
    let prevActiveElem = aboutUsWrapper.querySelector('.active') || null
    
    if(e.target.tagName !== 'DIV'){
        targetElem = e.target.tagName === 'path' ? e.target.parentNode.parentNode.parentNode : e.target.parentNode.parentNode
    } else {
        targetElem = e.target.parentNode
    }
    

    targetElem.classList.add('active')
    if(prevActiveElem){
        prevActiveElem.classList.remove('active')
    }
}

aboutUsElems.forEach(aboutUsElem => {
    aboutUsElem.addEventListener('click' , showAboutUsContent)
})