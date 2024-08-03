import { useRef } from "react";
import { hightlightsSlides } from "../constants";
import { useState } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import { animateWithGsap } from "../utils/animations";


const useVideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    currentVideoIndex: 0,
    isPlaying: false,
    isFinished: false,
  });

  let isFirstPlay = true

  const [loadedData, setLoadedData] = useState([]);

  const handleLoadedMetadata = (newData) => {
    console.log(newData)
    setLoadedData((prevData) => [...prevData, newData]);
  };


  const handleProcess = (action) => {
    switch (action) {
      case "play":
      case "pause":
        setVideo((prev) => ({ ...prev, isPlaying: action === "play" }));
        break;
      case "reset":
        setVideo((prev) => ({ ...prev, isFinished: false, currentVideoIndex: 0 }));
        break;
      case "next":
        setVideo((prev) => ({
          ...prev,
          currentVideoIndex: prev.currentVideoIndex + 1,
        }));
        break;
      case "end":
        setVideo((prev) => ({ ...prev, isFinished: true }));
        break
    }
  };

  const { currentVideoIndex, isPlaying } = video;

  useGSAP(() => {
    animateWithGsap("#slider", {
      transform: `translateX(${-100 * video.currentVideoIndex}%)`,
      duration: 1,
      ease: "power2.inOut"
    })

    animateWithGsap("#video", {
      onComplete: () => {
        if (!isPlaying && !isFirstPlay) {
          return
        }

        isFirstPlay = false
        handleProcess("play")
      }
    })
  }, [video.currentVideoIndex])

  useEffect(() => {
    let currentProgress = 0
    const video = videoRef.current[currentVideoIndex]
    const videoDiv = videoDivRef.current[currentVideoIndex]
    const videoSpan = videoSpanRef.current[currentVideoIndex]

    if (videoSpan && isPlaying) {
      let anim = animateWithGsap(videoSpan, {
        onUpdate: () => {

          const progress = Math.ceil(anim.progress() * 100)

          console.log(currentProgress)

          if (progress != currentProgress) {
            currentProgress = progress

            animateWithGsap(videoDiv, {
              width: window.innerWidth < 760 ? "10vw" : window.innerWidth < 1200 ? "10vw" : "4vw",
            });

            animateWithGsap(videoSpan, {
              width: `${currentProgress}%`,
              background: "white",
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            animateWithGsap(videoDiv, {
              width: "0.75rem"
            })

            animateWithGsap(videoSpan, {
              background: "#afafaf"
            })
          }
        }
      })

      if (currentVideoIndex === 0 ){
        anim.restart()
      }

      const animUpdate = () => {
        anim.progress(
          video.currentTime / hightlightsSlides[currentVideoIndex].videoDuration
        )
      }

      if (isPlaying) {
        gsap.ticker.add(animUpdate)
      } else {
        gsap.ticker.remove(animUpdate)
      }
    }
  }, [currentVideoIndex, isPlaying])

  useEffect(() => {
    if (loadedData.length > (hightlightsSlides.length - 1)) {
      if (!isPlaying) {
        videoRef.current[currentVideoIndex]?.pause();
      } else {
         videoRef.current[currentVideoIndex]?.play();
      }
    }
  }, [isPlaying, loadedData, currentVideoIndex, videoRef]);

  return {
    videoRef,
    videoSpanRef,
    videoDivRef,
    video,
    loadedData,
    setVideo,
    handleLoadedMetadata,
    handleProcess,
  };
};

const VideoCarousel = () => {
  const {
    videoRef,
    videoSpanRef,
    videoDivRef,
    video,
    handleLoadedMetadata,
    handleProcess,
  } = useVideoCarousel();

  const { currentVideoIndex, isPlaying, isFinished } = video;

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((slide, i) => (
          <div id="slider" key={slide.id} className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() => {
                    (currentVideoIndex < hightlightsSlides.length - 1)
                      ? handleProcess("next")
                      : handleProcess("end");
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetadata(e)}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {slide.textLists.map((text) => (
                  <p className="md:text-2xl text-xl font-medium" key={text}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>
        <button
          className="control-btn"
          onClick={() =>
            handleProcess(
              isFinished ? "reset" : isPlaying ? "pause" : "play",
              undefined
            )
          }
        >
          <img
            src={isFinished ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isFinished ? "replay" : isPlaying ? "pause" : "play"}
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
