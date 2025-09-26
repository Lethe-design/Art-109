

// // ~~~ Loop through ALL the class items so you apply a JS function all of them at once!~~~
// // https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/

// first store ALL the image-div class elements in a variable 
let divsNodes = document.querySelectorAll(".image-div"); 
let divs = Array.from(divsNodes);


// then use for loop to access both the current div and the next one in the loop!

for (i = 0; i < divs.length; i++) {
    let currentDiv = divs[i];
    let nextDiv = divs[i+1];
    
    currentDiv.addEventListener('click', () => {
            nextDiv.style.visibility = "visible";
    });
}


