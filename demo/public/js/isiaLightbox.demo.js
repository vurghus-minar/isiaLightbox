isiaLightbox.modalActive({
  allowedCloseMethods: ['overlay-click', 'close-button-click', 'keyboard-escape-press'],
  onOpen: function() {
    console.log('modal opened');
  },
  onClose: function() {
    console.log('modal closed');
  },
  onBeforeOpen: function() {
    console.log('modal before open');
  },
  onBeforeClose: function() {
    console.log('modal before close');
  },  
})

//API test

// Open
document.getElementById('open-lightbox').addEventListener('click', function(){
  isiaLightbox.open({
    id: 'bla',
    title: 'API OPEN TEST',
    subtitle: 'TEST',
    theme: '',
    footerContent: '<a href="#" id="close-lightbox">API CLOSE</a>',
    overlay: true,
    apiOnBeforeTemplateInit: function () {
      isiaLightbox.setContent('<iframe width="560" height="315" src="https://www.youtube.com/embed/jDWwsRK73lY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
    },
    apiOnBeforeOpen: function () {
      console.log('apiOnBeforeOpen!')

      let contentWrapper = document.getElementsByClassName('isiaLightbox-content')
      let html = '<br/><strong>I was added after the initial template load!</strong>'
      contentWrapper[0].insertAdjacentHTML('beforeend',html)

      document.getElementById('close-lightbox').addEventListener('click', function(){
        isiaLightbox.close()
      })

    },
    apiOnAfterOpen: function () {
      console.log('apiOnAfterOpen!')
    },
    apiOnBeforeClose: function () {
      console.log('apiOnBeforeClose!')
    },
    apiOnAfterClose: function () {
      console.log('apiOnAfterClose!')
    }
  })
})

// Close Test
document.getElementById('close2-lightbox').addEventListener('click', function(){
    isiaLightbox.close()
})