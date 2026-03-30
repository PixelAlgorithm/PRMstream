import { useParams } from "react-router-dom";
import './videoplayer.css'

function VideoPlayer() {

    const { type, id, season, episode } = useParams();

    let src;

    if (type === "tv") {
        const s = season || 1;
        const e = episode || 1;

        src = `https://player.videasy.net/tv/${id}/${s}/${e}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&color=8B5CF6`;
    } else {
        src = `https://player.videasy.net/movie/${id}`;
    }

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