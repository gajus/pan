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
    };
    
    dragMove = function (e) {
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

    targetElement.addEventListener('dragstart', dragStart);
    targetElement.addEventListener('drag', dragMove);
    targetElement.addEventListener('dragend', dragEnd);

    targetElement.addEventListener('touchstart', dragStart);
    targetElement.addEventListener('touchmove', dragMove);
    targetElement.addEventListener('touchend', dragEnd);

    document.body.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    document.body.addEventListener('drop');

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