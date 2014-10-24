# Pan

Touch enabled implementation of [WHATWG](https://html.spec.whatwg.org/#dnd) drag and drop mechanism.

## Quick Start

To make element draggable:

```js
var targetElement,
    pan;

targetElement = document.querySelector('#target-element');
pan new Pan(targetElement);

pan.eventEmitter.on('start', function (e) {
    console.log(e);
});

pan.eventEmitter.on('move', function (e) {
    e.handle.style.transform = 'translate(' + e.offsetX + 'px,' + e.offsetY + 'px)';
});

pan.eventEmitter.on('end', function (e) {
    console.log(e);
});
```

This will make the `#target-element` element draggable using CSS3 transformations.

The result of `Pan()` is an object with a single property `eventEmitter` used for [events](#events).

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