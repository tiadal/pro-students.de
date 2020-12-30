
const navbar = document.querySelector(".navbar")
const navbarButton = document.querySelector(".navbar .navbar-left button")
navbarButton.onclick = function() {
    navbar.classList.toggle("show")
}

const xmlParser = new DOMParser;

var courselists = document.querySelectorAll("[data-courses]"); // Find elements that are partial markers
courselists.forEach(courselist => {

    var xmlFile = courselist.getAttribute("data-courses");

    fetch("data/" + xmlFile + ".xml")
    .then(function (response) {
        return response.text();
    }).then(function (xmlString) {

        const xmlDoc = xmlParser.parseFromString(xmlString, "text/xml")
    
        var template = courselist.firstElementChild;
        courselist.innerHTML = "";
    
        Array.from(xmlDoc.documentElement.children).forEach(course => {
    
            var child = template.content.cloneNode(true)
    
            child.querySelector("[data-course='illustration']").src = course.getAttribute("illustration")
            child.querySelector("[data-course='title']").innerHTML = course.getElementsByTagName("title")[0].innerHTML
            child.querySelector("[data-course='description']").innerHTML = course.getElementsByTagName("description")[0].innerHTML
    
            courselist.appendChild(child);
        })
    
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    })
})