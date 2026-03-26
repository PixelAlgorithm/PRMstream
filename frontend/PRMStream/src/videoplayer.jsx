import { useParams } from "react-router-dom";
function VideoPlayer() {
    const { id } = useParams();

    const src = `https://www.vidking.net/embed/movie/${id}`

return(

    <div className="player">
        <iframe src={src} width="100%" height="600" frameBorder="0"
                allowFullScreen>

        </iframe>
    </div>
)
}


export default VideoPlayer;