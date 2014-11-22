<!--
This file has been generated using GitDown (https://github.com/gajus/gitdown).
Direct edits to this will be be overwritten. Look for GitDown markup file under ./.gitdown/ path.
-->
<h1 id="pan">Pan</h1>

[![NPM version](http://img.shields.io/npm/v/pan.svg?style=flat)](https://www.npmjs.org/package/pan)
[![Bower version](http://img.shields.io/bower/v/pan.svg?style=flat)](http://bower.io/search/?q=pan)

Touch enabled implementation of [WHATWG](https://html.spec.whatwg.org/#dnd) drag and drop (aka [HTML drag and drop](http://www.w3.org/html/wg/drafts/html/master/editing.html#dnd)) mechanism.

<h2 id="pan-contents">Contents</h2>

* [Pan](#pan)
    * [Contents](#pan-contents)
    * [How Does It Work?](#pan-how-does-it-work-)
        * [Visual Feedback](#pan-how-does-it-work--visual-feedback)
        * [Benefits](#pan-how-does-it-work--benefits)
    * [Quick Start](#pan-quick-start)
        * [Examples](#pan-quick-start-examples)
    * [Events](#pan-events)
        * [Event Object](#pan-events-event-object)
    * [Download](#pan-download)


<h2 id="pan-how-does-it-work-">How Does It Work?</h2>

```js
new Pan(targetElement);
```

This will give `targetElement` a [draggable](http://www.w3.org/html/wg/drafts/html/master/editing.html#the-draggable-attribute) property and set an event listener for [dragstart](http://www.w3.org/html/wg/drafts/html/master/editing.html#event-dnd-dragstart), [drag](http://www.w3.org/html/wg/drafts/html/master/editing.html#event-dnd-drag) and [dragend](http://www.w3.org/html/wg/drafts/html/master/editing.html#event-dnd-dragend); it will also set an event listener for [touchstart](http://www.w3.org/TR/touch-events/#the-touchstart-event), [touchmove](http://www.w3.org/TR/touch-events/#the-touchmove-event) and [touchend](http://www.w3.org/TR/touch-events/#the-touchend-event). These events are re-emitted through the [`eventEmitter`](#events) and allow you to animate [handle](#visual-feedback) in response to drag/touch events.

<h3 id="pan-how-does-it-work--visual-feedback">Visual Feedback</h3>

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

<h3 id="pan-how-does-it-work--benefits">Benefits</h3>

* Access to all of the DOM events for [drag](http://www.w3.org/html/wg/drafts/html/master/editing.html#dndevents) and [touch](http://www.w3.org/TR/touch-events/#list-of-touchevent-types).
* Lightweight and performs good.

<h2 id="pan-quick-start">Quick Start</h2>

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

<h3 id="pan-quick-start-examples">Examples</h3>

* [Basic](http://gajus.com/sandbox/pan/examples/basic/) element dragging using CSS transformations.
* [Events](http://gajus.com/sandbox/pan/examples/events/) logged in the `console.log`.

The code for all of the examples is in the [examples](./examples/) folder.

[Raise an issue](https://github.com/gajus/pan/issues) if you are missing an example.

<h2 id="pan-events">Events</h2>

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

<h3 id="pan-events-event-object">Event Object</h3>

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

<h2 id="pan-download">Download</h2>

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