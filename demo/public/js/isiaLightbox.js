(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory())
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    root.isiaLightbox = factory()
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict'

  const body = document.body

  const trigger = document.getElementsByClassName('isiaLightbox-trigger')

  const defaults = {
    closeIconImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACMklEQVQ4ja2UsWsUQRjFf285jiBBLMIVFiJBECSliBwhjbsgtoIgSBCRWKSQEAI2kiIElSCSIo2ghYQgVsHS2eh/IVFShSBiFUKqcNyzuNnL3OYSLHzd7nz8Zub73hsZU6nIiwxo2u6UW2WHUxTrGkA3lGGgLkuKzgE5sCrpXvweBmsA14EVYKbIi7F0XcYUeXHO9h1Ja7ZbknaB18D7UIbDBNa0fVPSSoQCvLS9Wm6VfwCyePxJSWtASxLAJWAOeFjkxYUKBrQlLUdYBmS2n0majetkQBO4a7tVu93lCH1Q5MVF25O2F4F22ipJGfA4cmgAHeCbpNvxZKnGgafAVUkTtqdSWNSh7U1JR2kPR+IucxFSV9d2dZq+bB9I+ggshjL87gNjj0aB6Qi9MgRa1z6wAbwIZdirfvZ3jNNcB94AP/8Btg68An6lCwNXCGU4ADaBL0D3DOA28A7YC2UYqBsAFnkxYvsaMGGbM9QCJoHz9YU0KU3bbUnPbU/VB1DTOMeWGj0BjHFqA0v0TH4WLIXO236UxlR5nmfADWCV4wSk2qfXszGGT3+X3nDehjJ0MqBh+/4psAN61pilN/2dIcAqpv2kdCX9qFdF027E3feAnWjueU6af5voiiy+Z5/ovRqVBQ5jApaJ1oiW+kDvFdpNYF+BeeA4egBFXrSAGdtPgM+Slqo4pcpv5SOSpm0vSPoOLAA7lR9Ve7GbsRdHoQxHQ/pV1TViXTfW9s09APwf+gvf9e8PsXsJjAAAAABJRU5ErkJggg==',
    animateInClass: 'lightboxBounceIn',
    animateOutClass: 'lightboxFadeOut',
    animateInTimeOut: 500,
    animateOutTimeOut: 1000,
    allowedCloseMethods: ['overlay-click', 'close-button-click', 'keyboard-escape-press'],
    onBeforeTemplateInit: null,
    onOpen: null,
    onClose: null,
    onBeforeOpen: null,
    onBeforeClose: null
  }

  let settings, lightbox, overlayElement, showOverlay, content, footerContent
  
  let apiOnBeforeOpen, apiOnAfterOpen, apiOnBeforeClose, apiOnAfterClose, apiOnBeforeTemplateInit

  function _extend () {
    for (let i = 1; i < arguments.length; i++) {
      for (let key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key]
        }
      }
    }
    return arguments[0]
  }

  function _init (options) {
    settings = _extend({}, defaults, options)
    _bindEvents()
  }

  function _bindEvents () {
    _showLightbox()
    _drawOverlay()
  }

  function _drawOverlay () {
    window.addEventListener('load', function () {
      overlayElement = document.createElement('div')
      overlayElement.setAttribute('class', 'isiaLightbox-overlay')
      body.insertAdjacentElement('beforeend', overlayElement)
    })
  }

  function _drawLightbox (lightboxParams) {

    if(lightboxParams.overlay){
      showOverlay = lightboxParams.overlay
    }

    if(lightboxParams.footerContent){
      footerContent = lightboxParams.footerContent
    }

    apiOnBeforeTemplateInit = lightboxParams.apiOnBeforeTemplateInit || null
    apiOnBeforeOpen = lightboxParams.apiOnBeforeOpen || null
    apiOnAfterOpen = lightboxParams.apiOnAfterOpen || null
    apiOnBeforeClose = lightboxParams.apiOnBeforeClose || null
    apiOnAfterClose = lightboxParams.apiOnAfterClose || null

    const lightBoxTemplate = _buildLightboxTemplate(lightboxParams)

    const range = document.createRange()
    range.selectNode(document.getElementsByTagName('div').item(0))

    const documentFragment = range.createContextualFragment(lightBoxTemplate)
    document.body.appendChild(documentFragment)

    lightbox = document.getElementsByClassName('isiaLightbox')[0]

    _animateInLightbox()

    if(settings.allowedCloseMethods.indexOf('overlay-click') > -1){
      overlayElement.addEventListener('click', function () {
        _animateOutLightbox()
      })      
    }
    if(settings.allowedCloseMethods.indexOf('close-button-click') > -1){
      const lightboxCloseBtn = document.getElementsByClassName('isiaLightboxClose')
      lightboxCloseBtn[0].addEventListener('click', function () {
        _animateOutLightbox()
      })      
    }
    if(settings.allowedCloseMethods.indexOf('keyboard-escape-press') > -1){
      window.addEventListener('keydown', function (e) {
        if (e.keyCode === 27) {
          _animateOutLightbox()
        }
      })      
    }

  }

  function _extractLightboxParams (lightboxElement) {
    const params = lightboxElement.dataset
    return params
  }

  function _showLightbox () {

    for (let i = 0; i < trigger.length; i++) {
      trigger[i].addEventListener('click', e => {
        e.preventDefault()
        const lightboxTriggerOptions = trigger[i].dataset.src.split(',')
        showOverlay = JSON.parse(trigger[i].dataset.overlay || true)

        let lightboxParams
        switch (lightboxTriggerOptions[0]) {
          case 'next':
            const lightboxElement = trigger[i].nextElementSibling
            lightboxParams = _extractLightboxParams(lightboxElement)
            content = lightboxElement.innerHTML
            _drawLightbox(lightboxParams)
            break
          case 'id':
            const lightboxElementId = document.querySelector('#' + lightboxTriggerOptions[1])
            lightboxParams = _extractLightboxParams(lightboxElementId)
            content = document.getElementById(lightboxTriggerOptions[1]).innerHTML
            _drawLightbox(lightboxParams)
            break
        }
      })
    }
  }

  function _buildLightboxTemplate(lightboxParams){
    let id, title, subtitle, theme, closeBtn

    if (typeof settings.onBeforeTemplateInit === 'function') {
      settings.onBeforeTemplateInit.call(this)
    }

    if (typeof apiOnBeforeTemplateInit === 'function') {
      apiOnBeforeTemplateInit.call(this)
    }

    if(lightboxParams.subtitle && lightboxParams.subtitle !== ''){
      subtitle = `<span>${lightboxParams.subtitle}</span>`
    }

    if(lightboxParams.title && lightboxParams.title !== ''){
      title = `<h3>${lightboxParams.title}${subtitle}</h3>`
    }

    id = `${lightboxParams.id}`
    if (id === 'undefined') {
      id = ''
    } else {
      id = `id=${lightboxParams.id}`
    }

    theme = `\u0020${lightboxParams.theme}`
    if (theme === ' undefined') {
      theme = ''
    }
    
    
    closeBtn = `<div class="isiaLightboxClose close"><img class="close-icon" src="${settings.closeIconImg}" /></div>`

    return `<div ${id} class="isiaLightbox${theme}"><div class="isiaLightbox-header">${title}${closeBtn}</div><div class="isiaLightbox-content">${content}</div><div class="isiaLightbox-footer">${footerContent}</div></div>`
  
  }

  function _adjustLightboxContentHeight(){

      let lightboxContent = document.getElementsByClassName('isiaLightbox-content')[0]
      let lightboxHeader = document.getElementsByClassName('isiaLightbox-header')[0]
      let lightboxFooter = document.getElementsByClassName('isiaLightbox-footer')[0]

      lightboxContent.style.height = (lightbox.clientHeight - lightboxFooter.clientHeight - lightboxHeader.clientHeight - parseInt((window.getComputedStyle(lightboxContent).getPropertyValue('padding-top')).replace('px', '')) - parseInt((window.getComputedStyle(lightboxContent).getPropertyValue('padding-bottom')).replace('px', ''))) + 'px'
      lightboxContent.style.overflowY = 'auto'
  }

  function _animateInLightbox () {

    if (typeof settings.onBeforeOpen === 'function') {
      settings.onBeforeOpen.call(this)
    }

    if (typeof apiOnBeforeOpen === 'function') {
      apiOnBeforeOpen.call(this)
    }

    _adjustLightboxContentHeight()

    let timeout = 0

    if (showOverlay) {
      overlayElement.style.display = 'block'
      overlayElement.style.height = '100%'
      overlayElement.style.width = '100%'
      overlayElement.classList.add('overlayFadeIn')
      timeout = settings.animateInTimeOut
    }
    setTimeout(function () {
      lightbox.classList.add(settings.animateInClass)
    }, timeout)
  
    if (typeof settings.onOpen === 'function') {
      settings.onOpen.call(this)
    }
  
    if (typeof apiOnAfterOpen === 'function') {
      apiOnAfterOpen.call(this)
    }

  }

  function _animateOutLightbox () {

    if (typeof settings.onBeforeClose === 'function') {
      settings.onBeforeClose.call(this)
    }

    if (typeof apiOnBeforeClose === 'function') {
      apiOnBeforeClose.call(this)
    }

    lightbox.classList.remove(settings.animateInClass)
    lightbox.classList.add(settings.animateOutClass)
    
    let timeout = settings.animateOutTimeOut
    
    if (showOverlay) {
      overlayElement.classList.remove('overlayFadeIn')
      overlayElement.classList.add('overlayFadeOut')
    }

    setTimeout(function () {
      if (showOverlay) {
        overlayElement.style.display = 'none'
        overlayElement.style.height = '0%'
        overlayElement.style.width = '0%'
        overlayElement.classList.remove('overlayFadeOut')
      }
      lightbox.remove()
    }, timeout)

    if (typeof settings.onClose === 'function') {
      settings.onClose.call(this)
    }
  
    if (typeof apiOnAfterClose === 'function') {
      apiOnAfterClose.call(this)
    }

  }

  //API Methods
  function _close(){
    if(document.getElementsByClassName('isiaLightbox').length !== 0 ){
      _animateOutLightbox()
    }
  }

  function _open(lightboxParams) {
    _drawLightbox(lightboxParams)
  }

  function _setApiContent (html) {
    content = html
  }

  function _setApiFooterContent (html) {
    FooterContent = html
  }

  return {
    modalActive: function (options) {
      _init(options)
    },
    close: _close,
    open: _open,
    setContent: _setApiContent,
    setFooterContent: _setApiFooterContent
  }
}))
