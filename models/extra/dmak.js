// This file contains all the code to enable handwritten kanjis on writing 
// cards (using the dmak library). This code needs an internet connection 
// to function properly since it loads stroke data online.

const SETTINGS = {
    element: 'dmak',
    uri: 'http://kanjivg.tagaini.net/kanjivg/kanji/',
    step: '0.015',
    stroke: { order: { visible: false } },
    grid: { attr: { stroke: '#000000' } },
};

// shows handwritten kanji animation for given subject
function loadDMAK(subject) {
    document.getElementById('dmak').innerHTML = '';
    let DMAK = new Dmak(subject, SETTINGS);
}

// toggles stroke order display on/off
function toggleOrder(subject) {
    if (document.getElementById('order').checked)
        SETTINGS.stroke.order.visible = true;
    else SETTINGS.stroke.order.visible = false;

    // reload to immediatly to take effect
    loadDMAK(subject);
}

// changes animation speed by inverting slider input
// low slider means slow speed high means high speed
function changeSpeed(subject) {
    let speed = document.getElementById('speed');
    let max = parseFloat(speed.max);
    let min = parseFloat(speed.min);
    let value = parseFloat(speed.value);

    // reload to immediatly to take effect
    SETTINGS.step = (max + min - value).toFixed(4);
    loadDMAK(subject);
}