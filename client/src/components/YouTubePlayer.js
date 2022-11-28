import React from 'react';
import YouTube  from 'react-youtube';


const YoutubePlayer = ({videoId}) => {

    const opts = {
        height: 300,
        width: 300,
        playerVars: {

            // https://developers.google.com/youtube/player_parameters
            autoplay:1,
        },
    };

    const onReady = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
      }
    
    

    return <YouTube videoId={videoId} opts={opts} onReady={onReady} />;
}


export default YoutubePlayer