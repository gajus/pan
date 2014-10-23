(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 *
 */
function Pan (targetElement) {
    var dative = this,
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

    dative.styleHandle(targetElement);
    
    dragStart = function (e) {
        var useX = e.touches ? e.touches[0].pageX : e.pageX,
            useY = e.touches ? e.touches[0].pageY : e.pageY;

        dragStartSubject = pan.getElementOffset(targetElement);

        handle = dative.makeHandle(targetElement);

        dragStartX = useX;
        dragStartY = useY;
        
        this.style.opacity = 0;
    };
    
    dragMove = function (e) {
        var useX = e.touches ? e.touches[0].pageX : e.pageX,
            useY = e.touches ? e.touches[0].pageY : e.pageY;

        if (useX === 0 && useY === 0) {
            useX = lastDragX;
            useY = lastDragY;
        }

        dative.translate(
            dragStartSubject.x + useX - dragStartX,
            dragStartSubject.y + useY - dragStartY,
        handle, targetElement);

        lastDragX = useX;
        lastDragY = useY;
    };

    dragEnd = function (e) {
        this.style.opacity = 1;

        //handle.parentNode.removeChild(handle);
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

Pan.prototype.getEventCoordinates

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

    this.styleClone(clone, node.offsetWidth, node.offsetHeight);

    node.parentNode.insertBefore(clone, node);

    return clone;
};

/**
 * Make clone width and height static.
 * Take clone out of the element flow.
 *
 * @param {HTMLElement} node
 * @param {Number} width
 * @param {Nubmer} height
 */
Pan.prototype.styleClone = function (node, width, height) {
    node.style.position = 'fixed';
    node.style.zIndex = 9999;
    node.style.width = width + 'px';
    node.style.height = height + 'px';

    node.style.margin = 0;
    node.style.padding = 0;
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