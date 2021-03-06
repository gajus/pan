/**
 * @version 1.1.6
 * @link https://github.com/gajus/pan for the canonical source repository
 * @license https://github.com/gajus/pan/blob/master/LICENSE BSD 3-Clause
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
* @version 1.0.1
* @link https://github.com/gajus/sister for the canonical source repository
* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
*/
/**
* @link https://github.com/gajus/sister for the canonical source repository
* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
*/
function S () {
    if (!(this instanceof S)) {
        return new S();
    }
    this._events = {};
}
/**
 * @name listener
 * @function
 * @param {Object} data Event data.
 */

/**
 * @param {String} name Event name.
 * @param {listener} listener
 */
S.prototype.on = function (name, listener) {
    this._events[name] = this._events[name] || [];
    this._events[name].unshift(listener);
    return this;
};
/**
 * @param {String} name Event name.
 * @param {Object} data Event data.
 */
S.prototype.trigger = function (name, data) {
    var listeners = this._events[name],
        i;

    if (listeners) {
        i = listeners.length;
        while (i--) {
            listeners[i](data);
        }
    }
};

if (module !== undefined && module.exports) {
    module.exports = S;
} else {
    window.Sister = S;
}
},{}],2:[function(require,module,exports){
(function (global){
var Sister = require('sister');

/**
 * @param {HTMLElement} targetElement
 */
function Pan (targetElement) {
    var pan = this;

    targetElement.draggable = true;

    return {
        eventEmitter: pan.bind(targetElement)
    };
}

Pan.prototype.bind = function (targetElement) {
    var eventEmitter = new Sister(),
        pan = this,
        handle,
        positionTracker,
        position,
        dragStartSubjectDisplay,
        dragStartSubjectOpacity,
        dragStart,
        dragMove,
        dragEndt,
        firstMove;

    dragStart = function (e) {
        positionTracker = pan.positionTracker(e);

        dragStartSubjectDisplay = targetElement.style.display;
        dragStartSubjectOpacity = targetElement.style.opacity;

        handle = pan.makeHandle(targetElement);

        targetElement.style.opacity = 0;

        firstMove = true;

        // Doesn't work without this in Firefox.
        e.dataTransfer.setData('text/plain', 'node');
    };
    
    dragMove = function (e) {
        // For mobile.
        e.preventDefault();

        position = positionTracker.update(e);

        if (firstMove) {
            // Manipulating (hiding) the targetElement on dragStart is
            // causing instant dragEnd.

            targetElement.parentNode.insertBefore(handle, targetElement);
            targetElement.style.display = 'none';

            firstMove = false;

            eventEmitter.trigger('start', {
                type: 'start',
                offsetX: position.offsetX,
                offsetY: position.offsetY,
                target: targetElement,
                handle: handle
            });
        }

        if (!position.isChange || position.isOutside) {
            return;
        }

        eventEmitter.trigger('move', {
            type: 'move',
            offsetX: position.offsetX,
            offsetY: position.offsetY,
            target: targetElement,
            handle: handle
        });
    };

    dragEnd = function (e) {
        // For mobile.
        e.preventDefault();
        
        targetElement.style.display = dragStartSubjectDisplay;
        targetElement.style.opacity = dragStartSubjectOpacity;

        handle.parentNode.removeChild(handle);

        eventEmitter.trigger('end', {
            type: 'end',
            offsetX: position.offsetX,
            offsetY: position.offsetY,
            target: targetElement,
            handle: handle
        });
    };

    targetElement.addEventListener('dragstart', dragStart, false);
    //targetElement.addEventListener('drag', dragMove, false);
    targetElement.addEventListener('dragend', dragEnd, false);

    targetElement.addEventListener('touchstart', dragStart, false);
    targetElement.addEventListener('touchmove', dragMove, false);
    targetElement.addEventListener('touchend', dragEnd, false);

    // @see http://stackoverflow.com/a/902352/368691
    document.body.addEventListener('dragover', dragMove, false);

    document.body.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);

    return eventEmitter;
};

/**
 * Get the mouse cursor position or the first touch position.
 * 
 * @param {Object} event
 * @return {Object}
 */
Pan.prototype.getEventPosition = function (event) {
    var source = event.touches ? event.touches[0] : event;

    return {
        x: source.pageX,
        y: source.pageY
    };
};

/**
 * Position tracker receives the first event and uses to produce an offset calculator.
 */
Pan.prototype.positionTracker = function (startEvent) {
    var pan = this,
        pt = {},
        eventPosition = pan.getEventPosition(startEvent),
        lastPageX = eventPosition.x,
        lastPageY = eventPosition.y;

    pt.dragStartX = eventPosition.x;
    pt.dragStartY = eventPosition.y;

    return {
        update: function (event) {
            var eventPosition = pan.getEventPosition(event);

            pt.pageX = eventPosition.x;
            pt.pageY = eventPosition.y;

            pt.offsetX = eventPosition.x - pt.dragStartX;
            pt.offsetY = eventPosition.y - pt.dragStartY;

            // Is the cursor outside the screen?
            pt.isOutside = pt.pageX == document.documentElement.scrollLeft && pt.pageY == document.documentElement.scrollTop;
            // Did the cursor position change?
            pt.isChange = lastPageX != eventPosition.x || lastPageY != eventPosition.y;

            lastPageX = eventPosition.x;
            lastPageY = eventPosition.y;

            return pt;
        }
    };
};

/**
 * @param {HTMLElement} targetElement
 * @return {HTMLElement}
 */
Pan.prototype.makeHandle = function (targetElement) {
    var handle = this.makeClone(targetElement);

    return handle;
};

/**
 * Clone node.
 * 
 * @param {HTMLElement} node
 * @return {HTMLElement}
 */
Pan.prototype.makeClone = function (node) {
    var clone;

    clone = node.cloneNode(true);

    return clone;
};

global.Pan = Pan;

module.exports = Pan;
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"sister":1}]},{},[2])