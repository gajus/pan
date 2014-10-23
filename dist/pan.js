(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

        if (lastDragX == eventPosition.x && lastDragY == eventPosition.y) {
            return;
        }

        pan.translate(changeX, changeY, handle, targetElement);

        lastDragX = eventPosition.x;
        lastDragY = eventPosition.y;
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
},{}]},{},[1])