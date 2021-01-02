var fs = require("fs")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


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
        
        var out = dom.serialize().replace("<body></body>", "");

        // Save the assembled file
        fs.writeFile('docs/' + htmlDoc, out, err => { if (err) { console.log("Couldn't write " + htmlDoc + " because of " + err) } })
    })
}

