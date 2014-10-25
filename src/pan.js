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
        position = positionTracker.update(e);

        dragStartSubjectDisplay = targetElement.style.display;
        dragStartSubjectOpacity = targetElement.style.opacity;

        handle = pan.makeHandle(targetElement);

        targetElement.style.opacity = 0;

        firstMove = true;

        eventEmitter.trigger('start', {
            type: 'start',
            offsetX: position.offsetX,
            offsetY: position.offsetY,
            target: targetElement,
            handle: handle
        });

        // Doesn't work without this in Firefox.
        e.dataTransfer.setData('text/plain', 'node');
    };
    
    dragMove = function (e) {
        // For mobile.
        e.preventDefault();

        position = positionTracker.update(e);

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
    targetElement.addEventListener('drag', function () {
        if (firstMove) {
            // Manipulating (hiding) the targetElement on dragStart is
            // causing instant dragEnd.

            targetElement.parentNode.insertBefore(handle, targetElement);
            targetElement.style.display = 'none';

            firstMove = false;
        }
    }, false);
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