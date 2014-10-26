# Pan

[![NPM version](https://badge.fury.io/js/pan-drag.svg)](http://badge.fury.io/js/pan-drag)
[![Bower version](https://badge.fury.io/bo/pan.svg?)](http://badge.fury.io/bo/pan)

Touch enabled implementation of [WHATWG](https://html.spec.whatwg.org/#dnd) drag and drop (aka [HTML drag and drop](http://www.w3.org/html/wg/drafts/html/master/editing.html#dnd)) mechanism.

## Contents

- [How Does It Work?](#how-does-it-work)
    - [Visual Feedback](#visual-feedback)
    - [Benefits](#benefits)
- [Quick Start](#quick-start)
    - [Examples](#examples)
- [Events](#events)
    - [Event Object](#event-object)
- [Download](#download)



## How Does It Work?

```js
new Pan(targetElement);
```

This will give `targetElement` a [draggable](http://www.w3.org/html/wg/drafts/html/master/editing.html#the-draggable-attribute) property and set an event listener for [dragstart](http://www.w3.org/html/wg/drafts/html/master/editing.html#event-dnd-dragstart), [drag](http://www.w3.org/html/wg/drafts/html/master/editing.html#event-dnd-drag) and [dragend](http://www.w3.org/html/wg/drafts/html/master/editing.html#event-dnd-dragend); it will also set an event listener for [touchstart](http://www.w3.org/TR/touch-events/#the-touchstart-event), [touchmove](http://www.w3.org/TR/touch-events/#the-touchmove-event) and [touchend](http://www.w3.org/TR/touch-events/#the-touchend-event). These events are re-emitted through the [`eventEmitter`](#events) and allow you to animate [handle](#visual-feedback) in response to drag/touch events.

### Visual Feedback

[HTML drag and drop](http://www.w3.org/html/wg/drafts/html/master/editing.html#dnd) spec does not define a method for styling or animating the handle in response to the drag event, e.g. [there is no way to control element opacity while dragging](http://stackoverflow.com/questions/9712535/html5-drag-and-drop-no-transparency).

The following mechanism is used to get the full control of the visual feedback:

In the event of `dragstart` and `touchstart`:

1. Make a clone (handle) of the target element.
1. Take the target element out of the flow (i.e., hide).
1. Insert the handle element in place of the target element.

In the event of `drag` and `touchmove`:

1. Make a reference to the handle element available to the [event object](#event-object).

In the event of `dragend` and `touchend`:

3. Remove the handle element.
3. Restore the target element.

As a result, you have full control over the visual feedback.

There is a reference to the `handle` element in the [Event Object](#event-object).

### Benefits

* Access to all of the DOM events for [drag](http://www.w3.org/html/wg/drafts/html/master/editing.html#dndevents) and [touch](http://www.w3.org/TR/touch-events/#list-of-touchevent-types).
* Lightweight and performs good.

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

The result of `Pan()` is an object with a single property (`eventEmitter`) used to emit [events](#events).

### Examples

* [Basic](http://gajus.com/sandbox/pan/examples/basic/) element dragging using CSS transformations.
* [Events](http://gajus.com/sandbox/pan/examples/events/) logged in the `console.log`.

The code for all of the examples is in the [examples](./examples/) folder.

[Raise an issue](https://github.com/gajus/pan/issues) if you are missing an example.

## Events

You can listen for individual drag and touch [DOM events](#dom-events):

```js
targetElement.addEventListener('dragstart', dragStart);
targetElement.addEventListener('drag', dragMove);
targetElement.addEventListener('dragend', dragEnd);

targetElement.addEventListener('touchstart', dragStart);
targetElement.addEventListener('touchmove', dragMove);
targetElement.addEventListener('touchend', dragEnd);
```

You can use the [`eventEmitter`](#events) object that will normalize drag and touch events to:

```js
pan.eventEmitter.on('start', dragStart);
pan.eventEmitter.on('move', dragMove);
pan.eventEmitter.on('end', dragEnd);
```

### Event Object

The listener of the `eventEmitter` is passed a single `eventObject` object.

```js
pan.eventEmitter.on('move', function (eventObject) {
    
});
```

| Name | Value |
| --- | --- |
| `offsetX` | Distance from the starting point on X axis. |
| `offsetY` | Distance from the starting point on Y axis. |
| `target` | Target that received the event. |
| `handle` | Element used to represent the target element when dragging. |
| `type` | Event name. |

## Download

Using [Bower](http://bower.io/):

```sh
bower install pan
```

Using [NPM](https://www.npmjs.org/):

```sh
npm install pan-drag
```

The old-fashioned way, download either of the following files:

* https://raw.githubusercontent.com/gajus/pan/master/dist/pan.js
* https://raw.githubusercontent.com/gajus/pan/master/dist/pan.min.js
