import Video_card from './video_card.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoPlayer from './videoplayer.jsx';
import Homepage from './Homepage.jsx';
function App()
{


  return (
      <>

          <BrowserRouter>
              <Routes>
            <Route path="/" element={<Homepage />} />
                  <Route path="/player/:type/:id/:season?/:episode?" element={<VideoPlayer />} />
              </Routes>
          </BrowserRouter>
      </>
  )
}

export default App;