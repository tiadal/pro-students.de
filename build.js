var fs = require("fs")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


// fs.readdir(__dirname + "/docs", deleteOldFiles);


function deleteOldFiles(err, fileList) {
    if (err) {
        return console.error(err);
    }

    fileList.forEach(htmlDoc => {
        if (!htmlDoc.endsWith('.html')) {
            return; // This isn't an html document
        }

        try {
          fs.unlinkSync(__dirname + "/docs/" + htmlDoc)
        } catch(err) {
          console.error(err)
        }
    })
}

fs.readdir(__dirname + "/src", assembleFiles);

LEGAL_ACTIVITY_DATA_NAMES = ["terms-active", "privacy-active", "imprint-active"];
function assembleFiles(err, fileList) {
    if (err) {
        return console.error(err);
    }
    
    fileList.forEach(htmlDoc => {
        if (!htmlDoc.endsWith('.html')) {
            return; // This isn't an html document
        }

        var dom = new JSDOM(fs.readFileSync("src/" + htmlDoc).toString());
        
        var partials = dom.window.document.querySelectorAll("[data-partial]"); // Find elements that are partial markers
        partials.forEach(partial => {
            var partialName = partial.getAttribute("data-partial");
        
            var partialFramework = fs.readFileSync("src/partials/" + partialName + ".html").toString();

            termsPrivacyImprintActive = [false, false, false];
            Array.from(partial.children).forEach(child => {
                // For each child of the original document's partial marker, look for parameters. If found, replace them into
                // this partialFramework
                if (partialName == "header-legal" && LEGAL_ACTIVITY_DATA_NAMES.indexOf(child.getAttribute("data-name")) != -1) {
                    switch (child.getAttribute("data-name")) {
                        case "terms-active":
                            termsPrivacyImprintActive[0] = true;
                            break;
                        case "privacy-active":
                            termsPrivacyImprintActive[1] = true;
                            break;
                        case "imprint-active":
                            termsPrivacyImprintActive[2] = true;
                            break;
                        default:
                    }
                } else {
                    partialFramework = partialFramework.replace("%" + child.getAttribute("data-name") + "%", child.innerHTML)
                }
            })
            
            // Set legal link activity given saved parameters (extra loop necessary to clear classlist of non-active links)
            for (var i in termsPrivacyImprintActive) {
                var dataName = LEGAL_ACTIVITY_DATA_NAMES[i]
                if (termsPrivacyImprintActive[i]) {
                    partialFramework = partialFramework.replace("%" + dataName + "%", "active")
                } else {
                    partialFramework = partialFramework.replace("%" + dataName + "%", "")
                }
            }
        
            // Replace partial marker with filled-out partialFramework
            partial.outerHTML = partialFramework;
        })

        assembleXml(dom);
        
        var out = dom.serialize().replace("<body></body>", "");

        // Save the assembled file
        fs.writeFile('docs/' + htmlDoc, out, err => { if (err) { console.log("Couldn't write " + htmlDoc + " because of " + err) } })
    })
}

function assembleXml(dom) {
    /*
     * XML Parsing for Course List Pages
     */
    const DOMParser = dom.window.DOMParser
    const xmlParser = new DOMParser
    var courselists = dom.window.document.querySelectorAll("[data-courses]"); // Find elements that are a course list (defined by having a data-courses attribute referring to the corresponding XML file)
    courselists.forEach(courselist => {
    
        var xmlFile = courselist.getAttribute("data-courses");

        var xmlString = fs.readFileSync("src/data/" + xmlFile + ".xml").toString();
        const xmlDoc = xmlParser.parseFromString(xmlString, "text/xml")

            var template = courselist.firstElementChild;
            courselist.innerHTML = "";

            Array.from(xmlDoc.documentElement.children).forEach(course => {// Cast each course given in the XML document into an HTML representation and append to HTML course list (courselist)
        
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
    })

    return dom;
}