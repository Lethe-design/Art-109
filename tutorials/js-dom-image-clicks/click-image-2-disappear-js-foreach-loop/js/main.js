

// ~~~ Loop through ALL the class items so you apply a JS function all of them at once!~~~
// https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/

// first store ALL the image-div class elements in a variable 
let divs = document.querySelectorAll(".image-div"); 

// next apply an event listener to all of them at once using a forEach loop
divs.forEach((div) => {
    div.addEventListener('click', () => {
        console.log("forEach worked");
        div.style.visibility = "hidden";
    });
});







// ~~~FROM PREVIOUS TUTORIAL~~~
// For just image-0 and image-1... you have to replicate this code for every image!

// document.querySelector("#image-0").onclick = function(){
//     document.querySelector("#image-0").style.visibility = "hidden";
// }

// document.querySelector("#image-1").onclick = function(){
//     document.querySelector("#image-1").style.visibility = "hidden";
// }
