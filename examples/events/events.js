document.addEventListener('DOMContentLoaded', function () {
    var targetElement,
        pan;

    targetElement = document.querySelector('.target');
    pan = new Pan(targetElement);

    pan.emitter.on('start', function (e) {
        console.log(e);
    });

    pan.emitter.on('move', function (e) {
        console.log(e);
    });

    pan.emitter.on('end', function (e) {
        console.log(e);
    });
}); 