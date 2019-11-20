import plantumlEncoder from "plantuml-encoder";
import panzoom from "panzoom";
import Spotlight from "spotlight-canvas";

import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';

function renderPlantUML() {
    const plantumlFiles = document.getElementsByClassName('plantuml');
    Array.from(plantumlFiles).forEach((el) => {
        const template = el.textContent;
        const encoded = plantumlEncoder.encode(template);
        const url = `http://www.plantuml.com/plantuml/img/${encoded}`;
        const image = document.createElement("img");
        image.src = url;
        el.textContent = "";
        el.appendChild(image);
        enablePanZoom(image);
    });
}

function enablePanZoom(ele) {
    panzoom(ele, {
        filterKey: () => true
    });
}

function enableSpotlight() {
    _spotlight = new Spotlight();
    if (_currentLocation) {
        _spotlight.circle(_currentLocation.x, _currentLocation.y, _spotlightRadius);
    } else {
        _spotlight.circle(100, 100, _spotlightRadius);
    }

    _spotlight.fadeIn();
    _spotlightListener = (e) => spotlightMove(e);
    document.body.addEventListener('mousemove', _spotlightListener);
    document.body.addEventListener('touchmove', _spotlightListener);
}

function disableSpotlight() {
    document.body.removeEventListener('mousemove', _spotlightListener);
    document.body.removeEventListener('touchmove', _spotlightListener);
    _spotlight.fadeOut();
    _spotlight = undefined;
}

function spotlightMove(e) {
    const point = translateEvent(e);
    const opening = _spotlight.openings[_spotlight.openings.length - 1];
    opening.x = point.x;
    opening.y = point.y;
    _spotlight.redraw();
}

function translateEvent(e) {
    let x, y;
    if (e.changedTouches) {
        const touch = e.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
    } else {
        x = e.pageX;
        y = e.pageY;
    }
    return {
        x,
        y
    };
}

function spotlight() {
    document.addEventListener("keypress", function onEvent(event) {
        if (event.key === "s") {
            if (_spotlightEnabled) {
                disableSpotlight();
                _spotlightEnabled = false;
            } else {
                enableSpotlight();
                _spotlightEnabled = true;
            }
        }
    });

    const move = (e) => _currentLocation = translateEvent(e);
    document.addEventListener("mousemove", move);
    document.addEventListener("touchmove", move);
}

function startPanzoom() {
    Array.from(document.getElementsByClassName("panzoom")).forEach(enablePanZoom);
}

let _spotlight;
let _spotlightListener;
let _spotlightRadius = 100;
let _currentLocation;
let _spotlightEnabled = false;

renderPlantUML();
startPanzoom();
spotlight();