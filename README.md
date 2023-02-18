#navControl

## What is the navControl?
It is a lightweight, responsive navigation plugin.

## Usage

Load via a `<script src="js/nav.js"></script>` tag.

Then in the javascript:

```javascript
window.onload = function () {
    var navigation = new NavControl();
    navigation.init();
};
```

## Demo

Check out the demo,  @ https://fret2buzz.github.io/nav-control/index.html

## Options

```
BREAKPOINT: 1024, // desktop breakpoint
TIME: 300, // transition time for mobile
CLASSNAME_NAV: 'js-nav', // navigation class name
CLASSNAME_VISIBLE: 'm-active', // active class name
CLASSNAME_OPENED: 'm-opened', // opened class name
DATA_MAIN: 'main', // data attribute for parent LI
DATA_CLOSE: 'close', // data attribute for close button
```



