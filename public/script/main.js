const app = {
  degtorad: Math.PI / 180,
  needleImg: document.querySelector('.needleImg'),
  dialImg: document.querySelector('.dialImg'),
  dir: document.querySelector('.dir'),
  angle: document.querySelector('.angle'),
  latVal: document.querySelector('.lat .value'),
  lngVal: document.querySelector('.lng .value'),
  geoError: document.querySelector('.geoError'),
  alert: document.querySelector('.alert'),
  minAccThreshold: 10
}

const errorStrings = {
  PERMISSION_DENIED: 'Permision Denied',
  POSITION_UNAVAILABLE: 'Network Error',
  TIMEOUT: 'Timeout, Retry'
}

const warningStrings = {
  NO_INTERNET: 'No Connection',
  UNSUPPORTED_ORIENTATION: 'Switch back to portrait or lock your device to portrait'
}

const infoStrings = {
  CALIBRATION: 'Calibrate your device by rotating 360° vertically and horizontally'
}
const handleMotionEvent = event => {
  if (event.acceleration.x > app.minAccThreshold) {
    if (window.navigator.onLine) {
      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(locationUpdate, locationUpdateFail, {
          enableHighAccuracy: false,
          maximumAge: 30000,
          timeout: 27000
        })
      }
    } else {
      noNetworkHandler()
    }
  }
}

const handleOrientation = event => {
  let heading = event.alpha
  app.angle.textContent = ''
  app.angle.textContent = Math.floor(heading)
  app.dir.textContent = ''
  app.dir.textContent = displayDirection(Math.floor(heading))
  app.needleImg.style.transform = 'rotate(' + heading + 'deg)'
}

const displayDirection = alpha => {
  if ((alpha > 330 && alpha <= 360) || (alpha >= 0 && alpha <= 30)) return 'N'
  if (alpha > 30 && alpha < 80) return 'NE'
  if (alpha >= 80 && alpha <= 90) return 'E'
  if (alpha > 90 && alpha < 150) return 'SE'
  if (alpha >= 150 && alpha <= 180) return 'S'
  if (alpha > 180 && alpha < 260) return 'SW'
  if (alpha >= 260 && alpha <= 270) return 'W'
  if (alpha > 270 && alpha < 330) return 'NW'
}

const noNetworkHandler = () => {
  updateNotification(warningStrings.NO_INTERNET, 'warning')
  app.latVal.textContent = '---'
  app.lngVal.textContent = '---'
}

const locationUpdate = position => {
  app.latVal.textContent = (position.coords.latitude).toFixed(4) + '°'
  app.lngVal.textContent = (position.coords.longitude).toFixed(4) + '°'
}

const locationUpdateFail = err => {
  app.latVal.textContent.length !== 0 ? app.latVal.textContent : app.latVal.textContent = '---'
  app.lngVal.textContent.length !== 0 ? app.lngVal.textContent : app.lngVal.textContent = '---'
  handleErrorCase(err)
}

const handleErrorCase = err => {
  if (app.geoError.textContent.length === 0) {
    switch (err.code) {
      case 1: updateNotification(errorStrings.PERMISSION_DENIED, 'error')
        break
      case 2: updateNotification(errorStrings.POSITION_UNAVAILABLE, 'error')
        break
      case 3: updateNotification(errorStrings.TIMEOUT, 'error')
        break
    }
  }
}

const updateNotification = (errorString, notificationClass) => {
  app.alert.style.display = 'flex'
  resetAlert()
  app.alert.classList.add(notificationClass)
  app.geoError.textContent = ''
  app.geoError.textContent = errorString
  setTimeout(clearError, 8000)
}

const resetAlert = () => {
  app.alert.classList.remove('error')
  app.alert.classList.contains('warning')
}

const clearError = () => {
  app.geoError.textContent = ''
  resetAlert()
  app.alert.style.display = 'none'
}

const fetchCurrentLocation = () => {
  if (window.navigator.onLine) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(locationUpdate, locationUpdateFail, {
        enableHighAccuracy: false,
        timeout: 27000
      })
    }
  } else {
    noNetworkHandler()
  }
}

const displayCalibrationInfo = () => {
  updateNotification(infoStrings.CALIBRATION, 'info')
}

window.addEventListener('DOMContentLoaded', event => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
      .then(reg => {
        console.log('serviceWorker Registration success. Scope is : ', reg.scope)
      })
      .catch(err => {
        console.log('error in serviceWorker Registration: ', err)
      })
  }
  if (!/Mobi/.test(navigator.userAgent)) {
    document.querySelector('.appContent').style.display = 'none'
    document.querySelector('.notMobile').style.display = 'flex'
    document.querySelector('.notMobile').textContent = 'Compass not supported in desktop browser. Please use mobile phone'
  } else {
    displayCalibrationInfo()
    window.addEventListener('deviceorientation', handleOrientation)
    window.addEventListener('devicemotion', handleMotionEvent)
    window.onorientationchange = readDeviceOrientation
    fetchCurrentLocation()
  }
})

function readDeviceOrientation () {
  if (Math.abs(window.orientation) === 90) { // Landscape
    app.alert.style.display = 'flex'
    resetAlert()
    app.alert.classList.add('warning')
    app.geoError.textContent = ''
    app.geoError.textContent = warningStrings.UNSUPPORTED_ORIENTATION
  } else { // Portrait
    clearError()
  }
}
