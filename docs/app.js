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


const videoModal = document.querySelector("#video-modal")

if(videoModal) {
    const videos = document.querySelectorAll("a[data-video]")
    const videoCard = videoModal.querySelector("#video-card");
    const videoContent = videoCard.querySelector("#video-content");
    const videoClose = videoCard.querySelector("#video-close")

    videoClose.addEventListener('click', (event) => {
        event.preventDefault()

        videoModal.classList.remove("show")
        videoContent.innerHTML = ""
        videoCard.onresize = null
    })

    videos.forEach(video => {

        video.addEventListener('click', (event) => {

            event.preventDefault()

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

            
        })
    
    })
}
