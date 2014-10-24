document.addEventListener('DOMContentLoaded', function () {
    var targetElement,
        pan;

    targetElement = document.querySelector('.target');
    pan = new Pan(targetElement);

    pan.eventEmitter.on('start', function (e) {
        console.log(e);
    });

    pan.eventEmitter.on('move', function (e) {
        console.log(e);
    });

    pan.eventEmitter.on('end', function (e) {
        console.log(e);
    });
}); 