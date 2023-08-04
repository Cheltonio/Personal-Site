let nav = document.getElementById("open");

let bar = document.getElementById("bar");
let aboutB = document.getElementById("aboutMe");
let intB = document.getElementById("interests");
let acB = document.getElementById("academic");
let expB = document.getElementById("experience");
let port = document.getElementById("port");
let contact = document.getElementById("cont");

let main = document.getElementById("main");
let about = document.getElementById("about");
let int = document.getElementById("int");
let ac = document.getElementById("ac");
let exp = document.getElementById("exp");

let backToTop = document.getElementById("toTop");

nav.onclick = function() {
    if(bar.style.visibility=="hidden") { 
        bar.style.visibility="visible";
    }
    else {
        bar.style.visibility="hidden";
    }
}

aboutB.onclick = function() {
    about.scrollIntoView();
}

intB.onclick = function() {
    int.scrollIntoView();
}

acB.onclick = function() {
    ac.scrollIntoView();
}

expB.onclick = function() {
    exp.scrollIntoView();
}

port.onclick = function() {
    document.getElementById("portfolio").scrollIntoView();
}

contact.onclick = function() {
    document.querySelector("footer").scrollIntoView();
}

toTop.onclick = function() {
    document.querySelector("h1").scrollIntoView();
}