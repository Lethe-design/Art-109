
console.log("hello hello");


let pageTitle = document.querySelector("#page-title");
//JS Timeout changes h1 title in 3 seconds
setTimeout(function(){
    pageTitle.style.color = "pink";
    //console.log("timeout worked!")
},3000)


//Click event on headerchanges background color
document.querySelector("header").onclick = function() {
    //console.log("clicked header")
    document.querySelector("body").style.backgroundColor = "black";
}