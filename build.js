const fs = require("fs")
const glob = require('glob')
const jsdom = require("jsdom");
const { exit } = require("process");
const { JSDOM } = jsdom;

glob("src/pages/**/*.html", {}, assembleFiles);

var sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n'
const date = new Date
const lastmodDate = date.getFullYear() + "-" + ('0' + date.getMonth()).slice(-2) + "-" + ('0' + date.getDay()).slice(-2)

var svgDimensions = []

LEGAL_ACTIVITY_DATA_NAMES = ["terms-active", "privacy-active", "imprint-active"];
function assembleFiles(err, fileList) {
    if (err) {
        return console.error(err);
    }
    sitemap += "    <url>\n"
    sitemap += "        <loc>https://pro-students.kiekbjul.de/</loc>\n"
    sitemap += "        <lastmod>" + lastmodDate + "</lastmod>\n"
    sitemap += "    </url>\n\n"
    
    fileList.forEach(htmlDoc => {
        if (!htmlDoc.endsWith('.html')) {
            return;
        }

        var dom = new JSDOM(fs.readFileSync(htmlDoc).toString());

        var htmlDocOut = htmlDoc.replace("src/pages/", "docs/")

        if(htmlDocOut.indexOf('index.html') < 0 && htmlDocOut.indexOf('404.html') < 0) {
            htmlDocOut = htmlDocOut.replace('.html', '/index.html')
            sitemap += "    <url>\n"
            sitemap += "        <loc>" + htmlDocOut.replace('docs/', 'https://pro-students.kiekbjul.de/').replace('index.html', '') + "</loc>\n"
            sitemap += "        <lastmod>" + lastmodDate + "</lastmod>\n"
            sitemap += "    </url>\n\n"
        }

        var htmlDocOutPath = htmlDocOut.substring(0, htmlDocOut.lastIndexOf('/'))

        var out = pipeHtml(dom, htmlDoc)

        try {
            fs.mkdirSync(htmlDocOutPath, {
                recursive: true
            })
        } catch(ex) {}

        // Save the assembled file
        fs.writeFile(htmlDocOut, out, err => { if (err) { console.log("Couldn't write " + htmlDocOut + " because of " + err) } })
    })

    sitemap += "</urlset>\n"

    fs.writeFile('docs/sitemap.xml', sitemap, err => { if (err) { console.log("Couldn't write sitemap.xml because of " + err) } })
}

function pipeHtml(dom, file) {
    
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

    var ldjsonCourses = assembleXml(dom, file);

    var images = dom.window.document.querySelectorAll('img')

    Array.from(images).forEach((img) => {

        if(img.src.endsWith('.svg')) {

            const dimensions = getSvgDimensions(dom, img.src)

            img.width = dimensions.width
            img.height = dimensions.height
        }
    })
    
    return dom.serialize().replace("<body></body>", "").replace('%ldjson-courses%', ldjsonCourses);
}

function getSvgDimensions(dom, file) {

    for(svgDimension in svgDimensions) {

        if(svgDimension.name == file) {
            return svgDimension;
        }

    }

    const DOMParser = dom.window.DOMParser
    const xmlParser = new DOMParser

    var xmlString = fs.readFileSync("docs" + file).toString();

    const xmlDoc = xmlParser.parseFromString(xmlString, "text/xml")

    const dimensions = {
        name: file,
        width: xmlDoc.documentElement.getAttribute('width'),
        height: xmlDoc.documentElement.getAttribute('height'),
    }
    
    if(dimensions.width == null || dimensions.height == null) {
        console.log("WARNING: width or height undefined for '" + file + "'")
    }

    svgDimensions.push(dimensions)

    return dimensions
}

function assembleXml(dom, file) {
    /*
     * XML Parsing for Course List Pages
     */
    const DOMParser = dom.window.DOMParser
    const xmlParser = new DOMParser
    var courselists = dom.window.document.querySelectorAll("[data-courses]"); // Find elements that are a course list (defined by having a data-courses attribute referring to the corresponding XML file)

    var ldjsonCourses = '{"@context":"http://schema.org","@type":"ItemList","itemListElement":['

    courselists.forEach(courselist => {
    
        var xmlFile = courselist.getAttribute("data-courses");

        var xmlString = fs.readFileSync("src/data/" + xmlFile + ".xml").toString();
        const xmlDoc = xmlParser.parseFromString(xmlString, "text/xml")

        var template = courselist.firstElementChild;
        courselist.innerHTML = "";

        var pos = 1;

        Array.from(xmlDoc.documentElement.children).forEach(course => {// Cast each course given in the XML document into an HTML representation and append to HTML course list (courselist)
    
            var htmlCourse = template.content.cloneNode(true)
            var ldjsonCourse = '{"@context":"http://schema.org","@type":"Course","name":"%title%","description":"%description%","provider":{"@type":"Organization","name":"Pro Students Cottbus","sameAs":"https://pro-students.kiekbjul.de"}},\n'

    

            var previewName = file.substring(file.lastIndexOf('/') + 1)
            var previewHtml = fs.readFileSync("src/partials/preview-" + previewName).toString();
    
            var illustration = htmlCourse.querySelector("[data-course='illustration']") // Get the element which needs to be filled with content (here, an attribute will have to be set)
            var data = course.getAttribute("illustration")  // Get the data to fill in from the XML
            previewHtml = previewHtml.replaceAll('%illustration%', data)
            if(illustration) {
                if(data) {
                    illustration.src = "/" + data
                } else {
                    illustration.classList.add('hidden')
                }
            }
    
            var title = htmlCourse.querySelector("[data-course='title']") // Similar to above; here innerhtml content will be set
            data = course.getElementsByTagName("title")[0].innerHTML
            previewHtml = previewHtml.replaceAll('%title%', data)
            previewHtml = previewHtml.replaceAll('%title-kebab%', toKebabCase(data))
            var htmlDocOut = file.replace("src/pages/", "docs/")
            htmlDocOut = htmlDocOut.substring(0, htmlDocOut.lastIndexOf('.html')) + "/" + toKebabCase(data) + "/index.html"
            var htmlDocOutPath = htmlDocOut.substring(0, htmlDocOut.lastIndexOf('/'))
            ldjsonCourse = ldjsonCourse.replace('%title%', data)
            var ldjsonCourseItem = '{"@type":"ListItem","position":' + pos + ',"url":"https://pro-students.kiekbjul.de' + htmlDocOut.replace("docs/", '/').replace('/index.html', '') + '"},'
            pos++;
            if(title) {
                if(data) {
                    title.innerHTML = data
                } else {
                    title.classList.add('hidden')
                }
            }


            var previewAction = htmlCourse.querySelector("[data-course='preview']")
            if(previewAction) {
                previewAction.href = htmlDocOut.replace("docs/", '/').replace('/index.html', '');
            }

            sitemap += "    <url>\n"
            sitemap += "        <loc>" + htmlDocOut.replace('docs/', 'https://pro-students.kiekbjul.de/').replace('index.html', '') + "</loc>\n"
            sitemap += "        <lastmod>" + lastmodDate + "</lastmod>\n"
            sitemap += "    </url>\n\n"

            // Accessibility addition: add descriptive aria-labels to buttons
            let dataTitle = data
            let readMoreButton = previewAction
            let makeAppButton = htmlCourse.querySelector(".action-primary")
            
            readMoreButton.setAttribute("aria-label", "Read more about the course: &quot;" + dataTitle + "&quot;")
            makeAppButton.setAttribute("aria-label", "Make an appointment for the course: &quot;" + dataTitle + "&quot;")
            //
    
            var description = htmlCourse.querySelector("[data-course='description']")
            data = course.getElementsByTagName("description")[0].innerHTML
            ldjsonCourse = ldjsonCourse.replace('%description%', data)
            previewHtml = previewHtml.replaceAll('%description%', data)
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

                    previewHtml = previewHtml.replace('%lessons%', lessons.parentElement.outerHTML)

                } else {
                    lessons.parentElement.outerHTML = ''
                    previewHtml = previewHtml.replace('%lessons%', '')
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

                    previewHtml = previewHtml.replace('%contents%', contents.parentElement.outerHTML)
                } else {
                    contents.parentElement.outerHTML = ''
                    previewHtml = previewHtml.replace('%contents%', '')
                }
            }

            courselist.appendChild(htmlCourse);
            previewHtml = previewHtml.replace('%ldjson-course%', ldjsonCourse)
            ldjsonCourses += ldjsonCourseItem

            var previewDom = new JSDOM(previewHtml);

            var previewOut = pipeHtml(previewDom, '')

            try {
                fs.mkdirSync(htmlDocOutPath, {
                    recursive: true
                })
            } catch(ex) {}
    
            // Save the assembled file
            fs.writeFile(htmlDocOut, previewOut, err => { if (err) { console.log("Couldn't write " + htmlDocOut + " because of " + err) } })

        })
    })

    return ldjsonCourses.substring(0, ldjsonCourses.length - 1) + "]},";
}

function toKebabCase(str) {
    return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-')
}
