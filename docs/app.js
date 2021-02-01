/*
 * Code to enable keyboard-based usage of the navbar on mobile devices (or generally
 * devices that show the hamburger menu instead of the wide navbar)
 */
let checkboxLabel = document.querySelector('.navbar-menu-button-icon')
let checkbox = document.getElementById('navbar-menu-button')

function toggleBoxIfEnter(e) {
    console.log("Event fired")
    if (e.keyCode == 13) {
        checkbox.checked = !checkbox.checked
    }
}
checkboxLabel.addEventListener("keyup", toggleBoxIfEnter)
