/**
 *
 */
function Pan (targetElement) {
    var pan = this,
        handle,
        dragClickOffsetX,
        dragClickOffsetY,
        lastDragX,
        lastDragY,
        dragStartSubject,
        dragStartX,
        dragStartY,
        dragStart,
        dragMove,
        dragEndt;

    targetElement.draggable = true;

    pan.styleHandle(targetElement);
    
    dragStart = function (e) {
        var eventPosition = pan.getEventPosition(e);

        dragStartSubject = pan.getElementOffset(targetElement);

        handle = pan.makeHandle(targetElement);

        dragStartX = eventPosition.x;
        dragStartY = eventPosition.y;
        
        this.style.opacity = 0;
    };
    
    dragMove = function (e) {
        var eventPosition = pan.getEventPosition(e),
            changeX = eventPosition.x - dragStartX,
            changeY = eventPosition.y - dragStartY;

        //console.log(changeX, changeY);

        //if (eventPosition.x === 0 && eventPosition.y === 0) {
        //    eventPosition.x = lastDragX;
        //    eventPosition.y = lastDragY;
        //}

        console.log(dragStartSubject.x, dragStartSubject.y);

        pan.translate(changeX, changeY, handle, targetElement);

        //lastDragX = eventPosition.x;
        //lastDragY = eventPosition.y;
    };

    dragEnd = function (e) {
        this.style.opacity = 1;

        handle.parentNode.removeChild(handle);
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
}

/**
 * @param {object}
 * @return {object}
 */
Pan.prototype.getEventPosition = function (event) {
    return {
        x: event.touches ? event.touches[0].pageX : event.pageX,
        y: event.touches ? event.touches[0].pageY : event.pageY
    }
};

/**
 * @param {HTMLElement}
 * @return {Object}
 */
Pan.prototype.getElementOffset = function (element) {
    var subjectRect = element.getBoundingClientRect();

    return {
        x: subjectRect.left + document.documentElement.scrollLeft,
        y: dragStartSubjectY = subjectRect.top + document.documentElement.scrollTop
    };
};

/**
 * Prevent the text contents of the handle element from being selected.
 */
Pan.prototype.styleHandle = function (node) {
    node.style.userSelect = 'none';
};

/**
 * @param {HTMLElement} targetElement
 * @return {HTMLElement}
 */
Pan.prototype.makeHandle = function (targetElement) {
    return this.makeClone(targetElement);
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

    node.parentNode.insertBefore(clone, node);

    return clone;
};

/**
 * Used to position the handle element.
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {HTMLElement} handle
 * @parma {HTMLElement} targetElement
 */
Pan.prototype.translate = function (x, y, handle, targetElement) {
    handle.style.transform = 'translate(' + x + 'px,' + y + 'px)';
};

window.Pan = Pan;