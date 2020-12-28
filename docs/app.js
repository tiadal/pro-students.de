var partials = document.querySelectorAll("[data-partial]");

partials.forEach(partial => {
    var value = partial.getAttribute("data-partial");

    fetch("partials/" + value + ".html")
    .then(function (response) {
        // The API call was successful!
        return response.text();
    }).then(function (html) {
    
        // Convert the HTML string into a document object
        var parser = new DOMParser();
        var innerHTML = parser.parseFromString(html, 'text/html').body.innerHTML;

        Array.from(partial.children).forEach(child => {
            innerHTML = innerHTML.replace("%" + child.getAttribute("data-name") + "%", child.innerHTML)
        })

        partial.outerHTML = innerHTML;
    
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    })
})