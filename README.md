# Pan

Touch enabled implementation of [WHATWG](https://html.spec.whatwg.org/#dnd) drag and drop mechanism.

## Quick Start

To make element draggable:

```js
var targetElement,
    pan;

targetElement = document.querySelector('#target-element');
pan new Pan(targetElement);

pan.emitter.on('start', function (e) {
    console.log(e);
});

pan.emitter.on('move', function (e) {
    e.handle.style.transform = 'translate(' + e.offsetX + 'px,' + e.offsetY + 'px)';
});

pan.emitter.on('end', function (e) {
    console.log(e);
});
```

This will make the `#target-element` element draggable using CSS3 transformations.

## Location Translator

The above will generate a table of contents for all of the headings in the document. Table of contents is an (<ol>) element; it will be appended to #contents container (See Markup).

The result of the gajus.contents() is an object with list (the generated <ol> element) and eventProxy properties.


## Examples

* [Basic](http://gajus.com/sandbox/pan/examples/basic/)
* [Events](http://gajus.com/sandbox/pan/examples/events/) logged in the `console.log`.

The code for all of the examples is in the [examples](./examples/) folder.

[Raise an issue](https://github.com/gajus/pan/issues) if you are missing an example.

## Events

| Event | Description |
| --- | --- |
| `start` |  |
| `move` |  |
| `end` |  |

### Event Object

| Name | Value |
| --- | --- |
| `offsetX` | Distance from the starting point on X axis. |
| `offsetY` | Distance from the starting point on Y axis. |
| `target` | Target that received the event. |
| `handle` | Element used to represent the target element when dragging. |
| `type` | Event name. |