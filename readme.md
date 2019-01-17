# isiaLightbox

### About

isiaLightbox is lightweight and standalone javascript modal lightbox component.

### Get started

- Clone the repository to your dev server.
- Run `npm install`
- Run `gulp` to compile scripts and start the dev server
- Browsesync should load the demo in your default browser automatically.
- If not, copy the server address from the command shell and load in your browser to run the demo.
- Demo is served from `./demo/public` folder

### Example Use

Reference the following styles in your html header:

```html
<link rel="stylesheet" href="path_to_css_folder/isiaLightbox.css" />
```

Minimal lightbox HTML setup:

```html
<!-- Trigger -->
<a class="isiaLightbox-trigger" data-src="next" href="#">Minimal lightbox</a>

<!-- Lightbox Element -->
<div class="isiaLightbox-element"><p>Minimal lightbox</p></div>
```

Reference the following script in your html footer:

```html
<script src="path_to_js_folder/isiaLightbox.js" type="text/javascript"></script>
```

Initialize the script as follows in the footer

```html
<script type="text/javascript">
  isiaLightbox.modalActive();
</script>
```

### Option defaults

```js
isiaLightbox.modalActive({
  closeIconImg:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACMklEQVQ4ja2UsWsUQRjFf285jiBBLMIVFiJBECSliBwhjbsgtoIgSBCRWKSQEAI2kiIElSCSIo2ghYQgVsHS2eh/IVFShSBiFUKqcNyzuNnL3OYSLHzd7nz8Zub73hsZU6nIiwxo2u6UW2WHUxTrGkA3lGGgLkuKzgE5sCrpXvweBmsA14EVYKbIi7F0XcYUeXHO9h1Ja7ZbknaB18D7UIbDBNa0fVPSSoQCvLS9Wm6VfwCyePxJSWtASxLAJWAOeFjkxYUKBrQlLUdYBmS2n0majetkQBO4a7tVu93lCH1Q5MVF25O2F4F22ipJGfA4cmgAHeCbpNvxZKnGgafAVUkTtqdSWNSh7U1JR2kPR+IucxFSV9d2dZq+bB9I+ggshjL87gNjj0aB6Qi9MgRa1z6wAbwIZdirfvZ3jNNcB94AP/8Btg68An6lCwNXCGU4ADaBL0D3DOA28A7YC2UYqBsAFnkxYvsaMGGbM9QCJoHz9YU0KU3bbUnPbU/VB1DTOMeWGj0BjHFqA0v0TH4WLIXO236UxlR5nmfADWCV4wSk2qfXszGGT3+X3nDehjJ0MqBh+/4psAN61pilN/2dIcAqpv2kdCX9qFdF027E3feAnWjueU6af5voiiy+Z5/ovRqVBQ5jApaJ1oiW+kDvFdpNYF+BeeA4egBFXrSAGdtPgM+Slqo4pcpv5SOSpm0vSPoOLAA7lR9Ve7GbsRdHoQxHQ/pV1TViXTfW9s09APwf+gvf9e8PsXsJjAAAAABJRU5ErkJggg==",
  animateInClass: "lightboxBounceIn",
  animateOutClass: "lightboxFadeOut",
  animateInTimeOut: 500,
  animateOutTimeOut: 1000,
  onBeforeTemplateInit: null,
  onOpen: null,
  onClose: null,
  onBeforeOpen: null,
  onBeforeClose: null
});
```

### Callbacks Examples

```js
isiaLightbox.modalActive({
  onBeforeTemplateInit: null, //runs before the lightbox template is initialized
  onOpen: function() {
    console.log("modal opened");
  },
  onClose: function() {
    console.log("modal closed");
  },
  onBeforeOpen: function() {
    console.log("modal before open");
  },
  onBeforeClose: function() {
    console.log("modal before close");
  }
});
```

### Methods to close lightbox

By default the lightbox can be closed using three different methods:
`'overlay-click', 'close-button-click', 'keyboard-escape-press'`

You can explicitly specify the close method as follows:

```js
isiaLightbox.modalActive({
  allowedCloseMethods: ["overlay-click"]
});
```

### API Usage

Use the API as follows to attach your custom functionality:

E.g To open the lightbox:

```js
// Open
document.getElementById("open-lightbox").addEventListener("click", function() {
  isiaLightbox.open({
    id: "bla",
    title: "API OPEN TEST",
    subtitle: "TEST",
    theme: "",
    footerContent: '<a href="#" id="close-lightbox">API CLOSE</a>',
    apiOnBeforeTemplateInit: function() {
      isiaLightbox.setContent(
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/jDWwsRK73lY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
      );
    },
    apiOnBeforeOpen: function() {
      console.log("apiOnBeforeOpen!");

      let contentWrapper = document.getElementsByClassName(
        "isiaLightbox-content"
      );
      let html =
        "<br/><strong>I was added after the initial template load!</strong>";
      contentWrapper[0].insertAdjacentHTML("beforeend", html);

      document
        .getElementById("close-lightbox")
        .addEventListener("click", function() {
          isiaLightbox.close();
        });
    },
    apiOnAfterOpen: function() {
      console.log("apiOnAfterOpen!");
    },
    apiOnBeforeClose: function() {
      console.log("apiOnBeforeClose!");
    },
    apiOnAfterClose: function() {
      console.log("apiOnAfterClose!");
    }
  });
});
```

E.g To close the lightbox:

```js
// Close Test
document
  .getElementById("close2-lightbox")
  .addEventListener("click", function(event) {
    event.preventDefault();
    isiaLightbox.close();
  });
```
