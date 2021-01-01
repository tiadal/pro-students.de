
const navbar = document.querySelector(".navbar")
const navbarButton = document.querySelector(".navbar .navbar-left button")

if (navbar != null && navbarButton != null) {
    navbarButton.onclick = function() {
        navbar.classList.toggle("show")
    }
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
    
            var illustration = child.querySelector("[data-course='illustration']")
            var data = course.getAttribute("illustration")
            if(illustration) {
                if(data) {
                    illustration.src = data
                } else {
                    illustration.classList.add('hidden')
                }
            }
    
            var title = child.querySelector("[data-course='title']")
            data = course.getElementsByTagName("title")[0].innerHTML
            if(title) {
                if(data) {
                    title.innerHTML = data
                } else {
                    title.classList.add('hidden')
                }
            }
    
            var description = child.querySelector("[data-course='description']")
            data = course.getElementsByTagName("description")[0].innerHTML
            if(description) {
                if(data) {
                    description.innerHTML = data
                } else {
                    description.classList.add('hidden')
                }
            }
    
            var lessons = child.querySelector("[data-course='lessons']")
            data = course.getElementsByTagName("lessons")[0]
            if(lessons) {
                if(data) {
                    var lessonTemplate = lessons.firstElementChild
                    lessons.innerHTML = ""

                    Array.from(data.children).forEach(lesson => {

                        var li = lessonTemplate.cloneNode(true);
                        li.innerHTML = lesson.innerHTML
                        lessons.appendChild(li)

                    })

                } else {
                    lessons.classList.add('hidden')
                }
            }
    
            var contents = child.querySelector("[data-course='contents']")
            data = course.getElementsByTagName("contents")[0]
            if(contents) {
                if(data) {

                    var contentTemplate = contents.firstElementChild
                    contents.innerHTML = ""

                    Array.from(data.children).forEach(content => {

                        var li = contentTemplate.cloneNode(true);
                        li.innerHTML = content.innerHTML
                        contents.appendChild(li)

                    })
                } else {
                    contents.classList.add('hidden')
                }
            }

            courselist.appendChild(child);
        })
    
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    })
})