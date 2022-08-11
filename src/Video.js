import React from 'react';
import video from '../assets/images/ThwartMe.mp4';


const Video = () => {

  return (
    <div id="video-wrapper">
      <video controls >
        <source src={video} type="video/mp4"/>
      </video>
    </div>
  );
};

export default Video;