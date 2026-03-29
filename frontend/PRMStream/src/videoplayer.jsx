import { useParams } from "react-router-dom";
import './videoplayer.css'

function VideoPlayer() {
    const { id } = useParams();

   // const src = `https://www.vidking.net/embed/movie/${id}`
    const src = `https://player.videasy.net/movie/${id}?overlay=true`

return (

    // <div className="player">
    //     <iframe src="https://www.vidking.net/embed/movie/1078605?color=e50914?autoPlay=1" width="100%" height="600"
    //             frameBorder="0"
    //             allowFullScreen></iframe>
    // </div>
    <div className={"player"}>
        <iframe className={"video-player"}
            src={src}
            frameBorder="0"
            allowFullScreen
        ></iframe>
    </div>
)
}


export default VideoPlayer;