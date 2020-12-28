var fs = require("fs")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


fs.readdir(__dirname + "/src", assembleFiles);

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
        
            Array.from(partial.children).forEach(child => {
                // For each child of the original document's partial marker, look for parameters. If found, replace them into
                // this partialFramework
                partialFramework = partialFramework.replace("%" + child.getAttribute("data-name") + "%", child.innerHTML)
            })
        
            // Replace partial marker with filled-out partialFramework
            partial.outerHTML = partialFramework;
        })

        // const DOMParser = dom.window.DOMParser;
        // const xmlParser = new DOMParser;
        
        // var courselists = dom.window.document.querySelectorAll("[data-courses]"); // Find elements that are partial markers
        // courselists.forEach(courselist => {

        //     var xmlFile = courselist.getAttribute("data-courses");
        //     var xmlString = fs.readFileSync("src/data/" + xmlFile + ".xml").toString();
        //     const xmlDoc = xmlParser.parseFromString(xmlString, "text/xml")

        //     var template = courselist.firstElementChild;
        //     courselist.innerHTML = "";

        //     Array.from(xmlDoc.documentElement.children).forEach(course => {

        //         var child = template.content.cloneNode(true)

        //         child.querySelector("[data-course='illustration']").src = course.getAttribute("illustration")
        //         child.querySelector("[data-course='title']").innerHTML = course.getElementsByTagName("title")[0].innerHTML
        //         child.querySelector("[data-course='description']").innerHTML = course.getElementsByTagName("description")[0].innerHTML

        //         courselist.appendChild(child);
        //     })
        // })
        
        // Save the assembled file
        fs.writeFile('docs/' + htmlDoc, dom.serialize(), err => { if (err) { console.log("Couldn't write " + htmlDoc + " because of " + err) } })
    })
}

