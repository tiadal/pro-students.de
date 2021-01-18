const videoModal = document.querySelector("#video-modal")

if(videoModal) {
    const videos = document.querySelectorAll("button[data-video]")
    const videoCard = videoModal.querySelector("#video-card");
    const videoContent = videoCard.querySelector("#video-content");
    const videoClose = videoCard.querySelector("#video-close")

    videoClose.onclick = () => {
        videoModal.classList.remove("show")
        videoContent.innerHTML = ""
        videoCard.onresize = null
    }

    videos.forEach(video => {

        video.onclick = () => {
            videoModal.classList.add("show")
    
            const videoId = video.getAttribute("data-video");
            var width = videoCard.clientWidth * 0.8

            if(width < 500) {
                width = videoCard.clientWidth * 0.95
            }

            var height = (width / 16) * 9

            var videoIframe = '<iframe width="%width%" height="%height%" src="https://www.youtube-nocookie.com/embed/%videoid%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
            videoIframe = videoIframe.replace("%videoid%", videoId)
            videoIframe = videoIframe.replace("%width%", width)
            videoIframe = videoIframe.replace("%height%", height)

            videoContent.innerHTML = videoIframe

            window.onresize = () => {

                var width = videoCard.clientWidth * 0.8

                if(width < 500) {
                    width = videoCard.clientWidth * 0.95
                }

                var height = (width / 16) * 9

                videoContent.firstElementChild.setAttribute("width", width)
                videoContent.firstElementChild.setAttribute("height", height)
            }

            
        }
    
    })
}

/*
 * XML Parsing for Course List Pages
 */
const xmlParser = new DOMParser;
var courselists = document.querySelectorAll("[data-courses]"); // Find elements that are a course list (defined by having a data-courses attribute referring to the corresponding XML file)
courselists.forEach(courselist => {

    var xmlFile = courselist.getAttribute("data-courses");

    fetch("data/" + xmlFile + ".xml")
    .then(function (response) {
        return response.text();
    }).then(function (xmlString) {
        /*
         * Process the XML file and integrate contents into our HTML document
         */

        const xmlDoc = xmlParser.parseFromString(xmlString, "text/xml")
    
        var template = courselist.firstElementChild; // By definition: element representing a course list should have a template element defining the general structure (only needs to be filled out with concrete information from XML file)
        courselist.innerHTML = "";
    
        Array.from(xmlDoc.documentElement.children).forEach(course => {
            // Cast each course given in the XML document into an HTML representation and append to HTML course list (courselist)
    
            var htmlCourse = template.content.cloneNode(true)
    
            var illustration = htmlCourse.querySelector("[data-course='illustration']") // Get the element which needs to be filled with content (here, an attribute will have to be set)
            var data = course.getAttribute("illustration")  // Get the data to fill in from the XML
            if(illustration) {
                if(data) {
                    illustration.src = data
                } else {
                    illustration.classList.add('hidden')
                }
            }
    
            var title = htmlCourse.querySelector("[data-course='title']") // Similar to above; here innerhtml content will be set
            data = course.getElementsByTagName("title")[0].innerHTML
            if(title) {
                if(data) {
                    title.innerHTML = data
                } else {
                    title.classList.add('hidden')
                }
            }
    
            var description = htmlCourse.querySelector("[data-course='description']")
            data = course.getElementsByTagName("description")[0].innerHTML
            if(description) {
                if(data) {
                    description.innerHTML = data
                } else {
                    description.classList.add('hidden')
                }
            }
    
            var lessons = htmlCourse.querySelector("[data-course='lessons']")
            data = course.getElementsByTagName("lessons")[0]
            if(lessons) {
                if(data) {
                    var lessonTemplate = lessons.firstElementChild // Similar to initial approach with courses: we have a "template" list element that can be reproduced to insert actual content
                    lessons.innerHTML = ""

                    Array.from(data.children).forEach(lesson => {

                        var li = lessonTemplate.cloneNode(true);
                        li.firstElementChild.innerHTML = lesson.innerHTML
                        lessons.appendChild(li)

                    })

                } else {
                    htmlCourse.querySelector("h4.lessons-heading").classList.add('hidden')
                    lessons.classList.add('hidden')
                }
            }
    
            var contents = htmlCourse.querySelector("[data-course='contents']")
            data = course.getElementsByTagName("contents")[0]
            if(contents) {
                if(data) {

                    var contentTemplate = contents.firstElementChild
                    contents.innerHTML = ""

                    Array.from(data.children).forEach(content => {

                        var li = contentTemplate.cloneNode(true);
                        li.firstElementChild.innerHTML = content.innerHTML
                        contents.appendChild(li)

                    })
                } else {
                    htmlCourse.querySelector("h4.contents-heading").classList.add('hidden')
                    contents.classList.add('hidden')
                }
            }

            courselist.appendChild(htmlCourse);
        })
    
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    })
})
