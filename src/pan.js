function Pan (subject) {
    var dative = this,
        handle,
        dragClickOffsetX,
        dragClickOffsetY,
        lastDragX,
        lastDragY,
        dragStartSubjectX,
        dragStartSubjectY,
        dragStartX,
        dragStartY,
        dragStart,
        dragMove,
        dragEndt

    subject.draggable = true;

    dative.styleHandle(subject);
    
    dragStart = function (e) {
        var useX = e.touches ? e.touches[0].pageX : e.pageX,
            useY = e.touches ? e.touches[0].pageY : e.pageY;

        var subjectRect = subject.getBoundingClientRect();

        handle = dative.makeHandle(subject);

        dragStartSubjectX = subjectRect.left + document.documentElement.scrollLeft;
        dragStartSubjectY = subjectRect.top + document.documentElement.scrollTop;

        dragStartX = useX;
        dragStartY = useY;
        
        this.style.opacity = 1;
    };
    
    dragMove = function (e) {
        var useX = e.touches ? e.touches[0].pageX : e.pageX,
            useY = e.touches ? e.touches[0].pageY : e.pageY;

        if (useX === 0 && useY === 0) {
            useX = lastDragX;
            useY = lastDragY;
        }

        dative.translate(
            dragStartSubjectX + useX - dragStartX,
            dragStartSubjectY + useY - dragStartY,
        handle, subject);

        lastDragX = useX;
        lastDragY = useY;
    };

    dragEnd = function (e) {
        this.style.opacity = 1;

        handle.parentNode.removeChild(handle);

        console.log('End');
    };

    subject.addEventListener('dragstart', dragStart);
    subject.addEventListener('drag', dragMove);
    subject.addEventListener('dragend', dragEnd);

    subject.addEventListener('touchstart', dragStart);
    subject.addEventListener('touchmove', dragMove);
    subject.addEventListener('touchend', dragEnd);

    document.body.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    document.body.addEventListener('drop');
};

/**
 * Prevent the text contents of the handle element from being selected.
 */
Pan.prototype.styleHandle = function (node) {
    node.style['userSelect'] = 'none';
};

/**
 * @param {HTMLElement} subject
 * @return {HTMLElement}
 */
Pan.prototype.makeHandle = function (subject) {
    return this.makeClone(subject);
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
    node.style.left = '-9999px';

    node.style.margin = 0;
    node.style.padding = 0;
};

/**
 * Used to position the handle element.
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {HTMLElement} handle
 * @parma {HTMLElement} subject
 */
Pan.prototype.translate = function (x, y, handle, subject) {
    handle.style.transform = 'translate(' + x + 'px,' + y + 'px)';
};