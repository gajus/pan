var Sister = require('sister');

/**
 * @param {HTMLElement} targetElement
 */
function Pan (targetElement) {
    var pan = this;

    targetElement.draggable = true;

    return {
        eventEmitter: pan.bind(targetElement)
    }
}

Pan.prototype.bind = function (targetElement) {
    var eventEmitter = new Sister(),
        pan = this,
        handle,
        lastDragX,
        lastDragY,
        dragStartSubjectDisplay,
        dragStartSubjectOpacity,
        dragStartX,
        dragStartY,
        dragStart,
        dragMove,
        dragEndt,
        firstMove;

    dragStart = function (e) {
        var eventPosition = pan.getEventPosition(e);

        dragStartSubjectDisplay = targetElement.style.display;
        dragStartSubjectOpacity = targetElement.style.opacity;

        handle = pan.makeHandle(targetElement);

        targetElement.style.opacity = 0;
        
        dragStartX = eventPosition.x;
        dragStartY = eventPosition.y;

        firstMove = true;
    };
    
    dragMove = function (e) {
        var eventPosition = pan.getEventPosition(e),
            offsetX = eventPosition.x - dragStartX,
            offsetY = eventPosition.y - dragStartY;

        if (firstMove) {
            // Manipulating (hiding) the targetElement on dragStart is
            // causing instant dragEnd.

            targetElement.parentNode.insertBefore(handle, targetElement);
            targetElement.style.display = 'none';

            firstMove = false;

            eventEmitter.trigger('start', {
                type: 'start',
                offsetX: offsetX,
                offsetY: offsetY,
                target: targetElement,
                handle: handle
            });
        }

        // Outside screen.
        if (eventPosition.x === document.documentElement.scrollLeft && document.documentElement.scrollTop === eventPosition.y) {
            return;
        }

        // Position did not update.
        if (lastDragX == eventPosition.x && lastDragY == eventPosition.y) {
            return;
        }

        lastDragX = eventPosition.x;
        lastDragY = eventPosition.y;

        eventEmitter.trigger('move', {
            type: 'move',
            offsetX: offsetX,
            offsetY: offsetY,
            target: targetElement,
            handle: handle
        });
    };

    dragEnd = function (e) {
        var eventPosition = pan.getEventPosition(e),
            offsetX = eventPosition.x - dragStartX,
            offsetY = eventPosition.y - dragStartY;
        
        targetElement.style.display = dragStartSubjectDisplay;
        targetElement.style.opacity = dragStartSubjectOpacity;

        handle.parentNode.removeChild(handle);

        eventEmitter.trigger('end', {
            type: 'end',
            offsetX: offsetX,
            offsetY: offsetY,
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
    return {
        x: event.touches ? event.touches[0].pageX : event.pageX,
        y: event.touches ? event.touches[0].pageY : event.pageY
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

window.Pan = Pan;