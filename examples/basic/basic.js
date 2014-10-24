document.addEventListener('DOMContentLoaded', function () {
    var targetElement,
        pan;

    targetElement = document.querySelector('.target');
    pan = new Pan(targetElement);

    pan.emitter.on('move', function (e) {
        e.handle.style.transform = 'translate(' + e.offsetX + 'px,' + e.offsetY + 'px)';
    });
}); 