

let song = document.querySelector("#song");
let playBtn = document.querySelector("#play-button");

if (playBtn) {
    playBtn.addEventListener('click', function () {
        if (song) song.play();
    });

    if (song) {
        song.onloadeddata = function() {
            playBtn.style.visibility = "visible";
        };
    }
} else {
    console.warn('Play button not found in DOM.');
}