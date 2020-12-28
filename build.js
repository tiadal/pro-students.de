var fs = require("fs")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


fs.readdir(__dirname, assembleFiles);

function assembleFiles(err, fileList) {
    if (err) {
        return console.error(err);
    }
    
    fileList.forEach(htmlDoc => {
        if (!htmlDoc.endsWith('.html')) {
            return; // This isn't an html document
        }

        var dom = new JSDOM(fs.readFileSync(htmlDoc).toString());
        
        var partials = dom.window.document.querySelectorAll("[data-partial]"); // Find elements that are partial markers
        partials.forEach(partial => {
            var partialName = partial.getAttribute("data-partial");
        
            var partialFramework = fs.readFileSync("partials/" + partialName + ".html").toString();
        
            Array.from(partial.children).forEach(child => {
                // For each child of the original document's partial marker, look for parameters. If found, replace them into
                // this partialFramework
                partialFramework = partialFramework.replace("%" + child.getAttribute("data-name") + "%", child.innerHTML)
            })
        
            // Replace partial marker with filled-out partialFramework
            partial.outerHTML = partialFramework;
        })
        
        // Save the assembled file
        fs.writeFile('out/' + htmlDoc, dom.serialize(), err => { if (err) { console.log("Couldn't write " + htmlDoc + " because of " + err) } })
    })
}

