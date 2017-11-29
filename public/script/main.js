window.addEventListener('DOMContentLoaded', event => {
  let needleImg = document.querySelector('.compassNeedleImg')
  window.addEventListener('deviceorientation', event => {
    let alpha = event.alpha
    document.querySelector('.lat').textContent = ''
    document.querySelector('.lat').textContent = Math.floor(alpha)
    console.log('alpha = ', alpha)
    needleImg.style.transform = 'rotate(' + Math.floor(alpha) + 'deg)'
  })
})
