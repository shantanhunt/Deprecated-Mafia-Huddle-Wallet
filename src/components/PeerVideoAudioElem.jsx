import { useHuddleStore } from "@huddle01/huddle01-client/hooks";
import React, { useCallback, useEffect, useRef } from "react";

const PeerVideoAudioElem = ({ peerIdAtIndex }) => {
  const videoRef = useRef(null);

  const peerCamTrack = useHuddleStore(
    useCallback(
      (state) => state.peers[peerIdAtIndex]?.consumers?.cam,
      [peerIdAtIndex]
    )
  )?.track;

  const getStream = (_track) => {
    const stream = new MediaStream();
    stream.addTrack(_track);
    return stream;
  };

  useEffect(() => {
    const videoObj = videoRef.current;

    if (videoObj && peerCamTrack) {
      videoObj.load();
      videoObj.srcObject = getStream(peerCamTrack);
      videoObj.play().catch((err) => {
        console.log({
          message: "Error playing video",
          meta: {
            err,
          },
        });
      });
    }

    return () => {
      if (videoObj) {
        videoObj?.pause();
        videoObj.srcObject = null;
      }
    };
  }, [peerCamTrack]);

  return (
    <video ref={videoRef} muted autoPlay playsInline style={{ width: "50%" }} />
  );
};

export default React.memo(PeerVideoAudioElem);
