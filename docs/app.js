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
