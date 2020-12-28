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

        var htmlDocText = fs.readFileSync("src/" + htmlDoc)

        // Copy the file as-is into the docs folder for usage by browsersync
        fs.writeFile('docs/' + htmlDoc, htmlDocText, err => { if (err) { console.log("Couldn't write " + htmlDoc + " because of " + err) } })
    })
}

