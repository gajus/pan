document.addEventListener('DOMContentLoaded', function () {
    var targetElement,
        pan,
        cssTransform = prefix('transform');

    targetElement = document.querySelector('.target');
    pan = new Pan(targetElement);

    console.log('cssTransform', cssTransform);

    pan.eventEmitter.on('move', function (e) {
        e.handle.style[cssTransform] = 'translate(' + e.offsetX + 'px,' + e.offsetY + 'px)';
    });
}); 