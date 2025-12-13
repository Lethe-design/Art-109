

let song = document.querySelector("#song");
let playBtn = document.querySelector("#play-button");
let pauseBtn = document.querySelector("#pause-button");
let volumeSlider = document.querySelector("#volume-slider");
let volumeLabel = document.querySelector("#volume-label");

if (playBtn) {
    playBtn.addEventListener('click', function () {
        if (song) song.play();
    });
} else {
    console.warn('Play button not found in DOM.');
}

if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
        if (song) song.pause();
    });
}

if (volumeSlider) {
    // Initialize slider from audio element if available
    if (song) volumeSlider.value = (song.volume !== undefined) ? song.volume : 1;
    if (volumeLabel) volumeLabel.textContent = Math.round(volumeSlider.value * 100) + "%";

    volumeSlider.addEventListener('input', function (e) {
        let v = parseFloat(e.target.value);
        if (song) song.volume = v;
        if (volumeLabel) volumeLabel.textContent = Math.round(v * 100) + "%";
    });
}

if (song) {
    song.onloadeddata = function() {
        let controls = [];
        if (playBtn) controls.push(playBtn);
        if (pauseBtn) controls.push(pauseBtn);
        if (volumeSlider) controls.push(volumeSlider);
        if (volumeLabel) controls.push(volumeLabel);
        controls.forEach(c => c.style.visibility = 'visible');
    };
}