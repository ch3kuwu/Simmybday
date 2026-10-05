import { useEffect, useRef, useState } from "react"

import blueExclamation from "./assets/exclamation-blue.png"
import clickOnItBubble from "./assets/click-on-it.png"
import clickPhoneBubble from "./assets/click-phone-bubble.png"
import redExclamation from "./assets/exclamation-red.png"
import flowers from "./assets/flowers.png"
import happyBirthdayBubble from "./assets/happy-birthday-bubble.png"
import letterOneBmo from "./assets/letter-one-bmo.png"
import letterOneMarceline from "./assets/letter-one-marceline.png"
import letterOneMessage from "./assets/letter-one-message.jpg"
import letterOneNameBubble from "./assets/letter-one-name-bubble.png"
import letterSixMessage from "./assets/letter-six-message.jpg"
import letterSixNameBubble from "./assets/letter-six-name-bubble.png"
import letterSevenNameBubble from "./assets/letter-seven-name-bubble.png"
import letterSevenPage1 from "./assets/letter-seven-page-1.jpeg"
import letterSevenPage2 from "./assets/letter-seven-page-2.jpeg"
import letterSevenPage3 from "./assets/letter-seven-page-3.jpeg"
import letterFourMessage from "./assets/letter-four-message.jpg"
import letterFourNameBubble from "./assets/letter-four-name-bubble.png"
import letterFiveGojo from "./assets/letter-five-gojo.png"
import letterFiveMessage from "./assets/letter-five-message.jpg"
import letterFiveNameBubble from "./assets/letter-five-name-bubble.png"
import letterEightMessage from "./assets/letter-eight-message.png"
import letterEightNameBubble from "./assets/letter-eight-name-bubble.png"
import letterThreeMessage from "./assets/letter-three-message.jpg"
import letterThreeNameBubble from "./assets/letter-three-name-bubble.png"
import letterTwoMessage from "./assets/letter-two-message.jpg"
import letterTwoNameBubble from "./assets/letter-two-name-bubble.png"
import marceline from "./assets/marceline.png"
import marcelineGiftAnimation from "./assets/marceline-gift-animation.mp4"
import messageBubble from "./assets/message-bubble.png"
import pageTwoBackground from "./assets/page-two-background.png"
import pageTwoBubble from "./assets/page-two-bubble.png"
import pageTwoFlowers from "./assets/page-two-flowers.png"
import pageTwoHeart from "./assets/page-two-heart.png"
import pageTwoMarceline from "./assets/page-two-marceline.png"
import pageThreeBubble from "./assets/page-three-bubble.png"
import pageThreeLetter1 from "./assets/page-three-letter-1.jpeg"
import pageThreeLetter2 from "./assets/page-three-letter-2.jpeg"
import pageThreeLetter3 from "./assets/page-three-letter-3.jpeg"
import pageThreeLetter4 from "./assets/page-three-letter-4.jpeg"
import pageThreeLetter5 from "./assets/page-three-letter-5.jpeg"
import pageThreeLetter6 from "./assets/page-three-letter-6.jpeg"
import pageThreeLetter7 from "./assets/page-three-letter-7.jpeg"
import pageThreeLetter8 from "./assets/page-three-letter-8.jpg"
import pageThreeMarceline from "./assets/page-three-marceline.png"
import phone from "./assets/phone.png"
import plaidBackground from "./assets/plaid-background.png"
import music from "./assets/overthemoon.mp3"

const pageThreeLetters = [
  pageThreeLetter1,
  pageThreeLetter2,
  pageThreeLetter3,
  pageThreeLetter4,
  pageThreeLetter5,
  pageThreeLetter6,
  pageThreeLetter7,
  pageThreeLetter8,
]

const pageThreeAssets = [
  pageThreeMarceline,
  pageThreeBubble,
  ...pageThreeLetters,
]

export function goToNextPage() {
  // Page 2 will subscribe to or replace this placeholder transition hook.
  window.dispatchEvent(new CustomEvent("birthday:next-page"))
}

export function goToThirdPage() {
  // Page 3 can subscribe to or replace this transition hook.
  window.dispatchEvent(new CustomEvent("birthday:third-page"))
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  >(1)
  const [letterSevenPage, setLetterSevenPage] = useState<0 | 1 | 2>(0)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isMessageOpened, setIsMessageOpened] = useState(false)
  const [isBirthdayRevealed, setIsBirthdayRevealed] = useState(false)
  const [isPhonePromptRevealed, setIsPhonePromptRevealed] = useState(false)
  const [isGiftAnimationPlaying, setIsGiftAnimationPlaying] = useState(false)
  const [isGiftTransitionActive, setIsGiftTransitionActive] = useState(false)
  const [isReturningToPageThree, setIsReturningToPageThree] = useState(false)
  const navigationStarted = useRef(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const giftAnimationRef = useRef<HTMLVideoElement>(null)
  const giftCanvasRef = useRef<HTMLCanvasElement>(null)
  const giftAnimationFrameRef = useRef<number>(0)
  const giftGlowTimerRef = useRef<number>(0)
  const giftTransitionStartedRef = useRef(false)
  const thirdPageTimerRef = useRef<number>(0)
  const pageThreeAssetsReadyRef = useRef<Promise<void> | null>(null)
  const notificationAudioContextRef = useRef<AudioContext>(null)
  const notificationSoundRequestRef = useRef(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.3

    const prepareAudio = () => {
      if (
        audio.readyState >= HTMLMediaElement.HAVE_METADATA &&
        audio.currentTime < 29.5
      ) {
        audio.currentTime = 30
      }
    }

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      prepareAudio()
    } else {
      audio.addEventListener("loadedmetadata", prepareAudio, { once: true })
    }

    return () => {
      audio.removeEventListener("loadedmetadata", prepareAudio)
      audio.pause()
      notificationSoundRequestRef.current += 1
      notificationAudioContextRef.current?.close()
      window.cancelAnimationFrame(giftAnimationFrameRef.current)
      window.clearTimeout(giftGlowTimerRef.current)
      window.clearTimeout(thirdPageTimerRef.current)
    }
  }, [])

  useEffect(() => {
    pageThreeAssetsReadyRef.current = Promise.all(
      pageThreeAssets.map(async (source) => {
        const image = new Image()
        image.src = source

        try {
          await image.decode()
        } catch {
          await new Promise<void>((resolve) => {
            if (image.complete) {
              resolve()
              return
            }

            image.onload = () => resolve()
            image.onerror = () => resolve()
          })
        }
      }),
    ).then(() => undefined)
  }, [])

  useEffect(() => {
    const showPageThree = () => {
      setIsReturningToPageThree(false)
      setCurrentPage(3)
    }

    const showPageThreeWhenReady = () => {
      const assetsReady = pageThreeAssetsReadyRef.current

      if (assetsReady) {
        void assetsReady.then(showPageThree)
      } else {
        showPageThree()
      }
    }

    window.addEventListener("birthday:third-page", showPageThreeWhenReady)
    return () =>
      window.removeEventListener("birthday:third-page", showPageThreeWhenReady)
  }, [])

  useEffect(() => {
    const showPageTwo = () => {
      setCurrentPage(2)
    }

    window.addEventListener("birthday:next-page", showPageTwo)
    return () => window.removeEventListener("birthday:next-page", showPageTwo)
  }, [])

  const playNotificationSound = async (delay = 0) => {
    const requestId = ++notificationSoundRequestRef.current
    const audioContext =
      notificationAudioContextRef.current ?? new AudioContext()
    notificationAudioContextRef.current = audioContext

    try {
      await audioContext.resume()
    } catch {
      return
    }

    if (
      audioContext.state !== "running" ||
      requestId !== notificationSoundRequestRef.current
    ) {
      return
    }

    const startTime = audioContext.currentTime + delay
    const gain = audioContext.createGain()
    gain.gain.setValueAtTime(0.0001, startTime)
    gain.gain.exponentialRampToValueAtTime(0.16, startTime + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.48)
    gain.connect(audioContext.destination)

    ;[
      { frequency: 880, start: 0, duration: 0.16 },
      { frequency: 1318.51, start: 0.14, duration: 0.34 },
    ].forEach(({ frequency, start, duration }) => {
      const oscillator = audioContext.createOscillator()
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(frequency, startTime + start)
      oscillator.connect(gain)
      oscillator.start(startTime + start)
      oscillator.stop(startTime + start + duration)
    })
  }

  useEffect(() => {
    if (isMessageOpened) return

    const notificationTimer = window.setTimeout(() => {
      void playNotificationSound()
    }, 2000)

    return () => window.clearTimeout(notificationTimer)
  }, [isMessageOpened])

  const startNextPageTransition = () => {
    if (!isPhonePromptRevealed) return

    const audio = audioRef.current

    if (audio && audio.paused) {
      audio.play().catch(() => {})
    }

    if (navigationStarted.current) return

    navigationStarted.current = true
    setIsLeaving(true)

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    window.setTimeout(goToNextPage, reduceMotion ? 0 : 40)
  }

  const openMessage = () => {
    if (isMessageOpened) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    void playNotificationSound(reduceMotion ? 0 : 0.28)

    const audio = audioRef.current

    if (audio) {
      if (
        audio.readyState >= HTMLMediaElement.HAVE_METADATA &&
        audio.currentTime < 29.5
      ) {
        audio.currentTime = 30
      }
      audio.play().catch(() => {})
    }

    setIsMessageOpened(true)
  }

  const revealBirthdayMessage = () => {
    if (!isMessageOpened || isBirthdayRevealed) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    void playNotificationSound(reduceMotion ? 0 : 0.28)
    setIsBirthdayRevealed(true)
  }

  const revealPhonePrompt = () => {
    if (!isBirthdayRevealed || isPhonePromptRevealed) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    void playNotificationSound(reduceMotion ? 0 : 0.28)
    setIsPhonePromptRevealed(true)
  }

  const drawGiftFrame = (continuePlayback = true) => {
    const video = giftAnimationRef.current
    const canvas = giftCanvasRef.current
    if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return
    }

    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const frame = context.getImageData(0, 0, canvas.width, canvas.height)

    for (let index = 0; index < frame.data.length; index += 4) {
      if (
        frame.data[index] > 246 &&
        frame.data[index + 1] > 246 &&
        frame.data[index + 2] > 246
      ) {
        frame.data[index + 3] = 0
      }
    }

    context.putImageData(frame, 0, 0)

    if (continuePlayback && !video.paused && !video.ended) {
      giftAnimationFrameRef.current = window.requestAnimationFrame(() =>
        drawGiftFrame(),
      )
    }
  }

  const startGiftTransition = () => {
    if (giftTransitionStartedRef.current) return

    giftTransitionStartedRef.current = true
    setIsGiftTransitionActive(true)
    thirdPageTimerRef.current = window.setTimeout(goToThirdPage, 2000)
  }

  const scheduleGiftTransition = () => {
    const video = giftAnimationRef.current
    if (!video) return

    const schedule = () => {
      const delay = Math.max(0, (video.duration - 1) * 1000)
      giftGlowTimerRef.current = window.setTimeout(startGiftTransition, delay)
    }

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      schedule()
    } else {
      video.addEventListener("loadedmetadata", schedule, { once: true })
    }
  }

  const finishGiftAnimation = () => {
    startGiftTransition()
  }

  const playGiftAnimation = () => {
    if (isGiftAnimationPlaying) return

    setIsGiftAnimationPlaying(true)
    const video = giftAnimationRef.current
    if (!video) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const showFinalFrame = () => {
        video.addEventListener("seeked", () => drawGiftFrame(false), {
          once: true,
        })
        video.addEventListener("seeked", startGiftTransition, { once: true })
        video.currentTime = Math.max(0, video.duration - 0.05)
      }

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        showFinalFrame()
      } else {
        video.addEventListener("loadedmetadata", showFinalFrame, { once: true })
      }
      return
    }

    video.currentTime = 0
    scheduleGiftTransition()
    video
      .play()
      .then(() => drawGiftFrame())
      .catch(() => {})
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={music}
        playsInline
        preload="auto"
        hidden
      />

      {(currentPage === 1 || currentPage === 2) && (
        <main
          aria-hidden={currentPage !== 2}
          aria-label="Open your gift, Simmy"
          className={`page-two${isGiftAnimationPlaying ? " gift-animation-playing" : ""}${isGiftTransitionActive ? " gift-transition-active" : ""}`}
        >
          <div
            className="page-two-stage"
            style={{ backgroundImage: `url(${pageTwoBackground})` }}
          >
            <div className="page-two-heart page-two-heart-one">
              <img src={pageTwoHeart} alt="" />
            </div>
            <div className="page-two-heart page-two-heart-two">
              <img src={pageTwoHeart} alt="" />
            </div>
            <div className="page-two-heart page-two-heart-three">
              <img src={pageTwoHeart} alt="" />
            </div>
            <div className="page-two-heart page-two-heart-four">
              <img src={pageTwoHeart} alt="" />
            </div>

            <div className="page-two-flowers">
              <img src={pageTwoFlowers} alt="" />
            </div>

            <div className="page-two-bubble">
              <div className="page-two-bubble-hitbox" />
              <div className="page-two-bubble-hover">
                <div className="page-two-bubble-idle">
                  <img src={pageTwoBubble} alt="Open it, Simmy!" />
                </div>
              </div>
            </div>

            <div className="page-two-marceline">
              <button
                aria-label="Open Marceline's gift"
                className="page-two-marceline-hitbox"
                onClick={playGiftAnimation}
                tabIndex={currentPage === 2 ? 0 : -1}
                type="button"
              />
              <div className="page-two-marceline-hover">
                <div className="page-two-marceline-idle">
                  <img src={pageTwoMarceline} alt="" />
                </div>
              </div>
            </div>

            <canvas
              aria-hidden="true"
              className="marceline-gift-animation"
              height={360}
              ref={giftCanvasRef}
              width={640}
            />
            <video
              aria-hidden="true"
              className="gift-animation-source"
              muted
              playsInline
              preload="auto"
              ref={giftAnimationRef}
              src={marcelineGiftAnimation}
              onEnded={finishGiftAnimation}
            />
          </div>
        </main>
      )}
      {currentPage !== 1 && (
        <main
          aria-label="Click on the letters, Simmy"
          className={`page-three${
            currentPage === 3
              ? isReturningToPageThree
                ? " is-returning"
                : " is-active"
              : " is-waiting"
          }`}
        >
          <div
            className="page-three-stage"
            style={{ backgroundImage: `url(${pageTwoBackground})` }}
          >
            <div className="page-three-marceline">
              <div className="page-three-marceline-idle">
                <img src={pageThreeMarceline} alt="" />
              </div>
            </div>

            <div className="page-three-bubble">
              <div className="page-three-bubble-idle">
                <img src={pageThreeBubble} alt="Click on the letters, Simmy!" />
              </div>
            </div>

            <div className="page-three-letters">
              {pageThreeLetters.map((letter, index) => (
                <button
                  aria-label={`Letter ${index + 1}`}
                  className={`page-three-letter page-three-letter-${index + 1}`}
                  key={letter}
                  onClick={
                    index === 0
                      ? () => setCurrentPage(4)
                      : index === 1
                        ? () => setCurrentPage(5)
                        : index === 2
                          ? () => setCurrentPage(6)
                          : index === 3
                            ? () => setCurrentPage(7)
                            : index === 4
                              ? () => setCurrentPage(8)
                              : index === 5
                                ? () => setCurrentPage(9)
                                : index === 6
                                  ? () => {
                                      setLetterSevenPage(0)
                                      setCurrentPage(10)
                                    }
                                  : index === 7
                                    ? () => setCurrentPage(11)
                                    : undefined
                  }
                  tabIndex={currentPage === 3 ? 0 : -1}
                  type="button"
                >
                  <span className="page-three-letter-idle">
                    <img src={letter} alt="" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
      )}
      {currentPage !== 1 && (
        <main
          aria-hidden={currentPage !== 4}
          aria-label="Letter from Tarush"
          className={`letter-one-page${currentPage === 4 ? " is-active" : ""}`}
        >
          <div
            className="letter-one-stage"
            style={{ backgroundImage: `url(${pageTwoBackground})` }}
          >
            <button
              aria-label="Back to the letters"
              className="letter-one-back"
              onClick={() => {
                setIsReturningToPageThree(true)
                setCurrentPage(3)
              }}
              tabIndex={currentPage === 4 ? 0 : -1}
              type="button"
            >
              <span className="letter-one-back-arrow" />
              <span>BACK</span>
            </button>

            <div className="letter-one-marceline">
              <div className="letter-one-marceline-idle">
                <img src={letterOneMarceline} alt="" />
              </div>
            </div>

            <div className="letter-one-message">
              <div className="letter-one-message-idle">
                <img src={letterOneMessage} alt="Birthday letter from Tarush" />
              </div>
            </div>

            <div className="letter-one-name">
              <div className="letter-one-name-idle">
                <img src={letterOneNameBubble} alt="Tarush" />
              </div>
            </div>

            <div className="letter-one-bmo">
              <div className="letter-one-bmo-idle">
                <img src={letterOneBmo} alt="" />
              </div>
            </div>
          </div>
        </main>
      )}
      {currentPage !== 1 && (
        <main
          aria-hidden={currentPage !== 5}
          aria-label="Letter from Zeg"
          className={`letter-one-page letter-two-page${currentPage === 5 ? " is-active" : ""}`}
        >
          <div
            className="letter-one-stage"
            style={{ backgroundImage: `url(${pageTwoBackground})` }}
          >
            <button
              aria-label="Back to the letters"
              className="letter-one-back"
              onClick={() => {
                setIsReturningToPageThree(true)
                setCurrentPage(3)
              }}
              tabIndex={currentPage === 5 ? 0 : -1}
              type="button"
            >
              <span className="letter-one-back-arrow" />
              <span>BACK</span>
            </button>

            <div className="letter-one-marceline">
              <div className="letter-one-marceline-idle">
                <img src={letterOneMarceline} alt="" />
              </div>
            </div>

            <div className="letter-one-message">
              <div className="letter-one-message-idle">
                <img src={letterTwoMessage} alt="Birthday letter from Zeg" />
              </div>
            </div>

            <div className="letter-one-name">
              <div className="letter-one-name-idle">
                <img src={letterTwoNameBubble} alt="Zeg" />
              </div>
            </div>

            <div className="letter-one-bmo">
              <div className="letter-one-bmo-idle">
                <img src={letterOneBmo} alt="" />
              </div>
            </div>
          </div>
        </main>
      )}
      {currentPage !== 1 && (
        <main
          aria-hidden={currentPage !== 6}
          aria-label="Letter from Pratham"
          className={`letter-one-page letter-three-page${currentPage === 6 ? " is-active" : ""}`}
        >
          <div
            className="letter-one-stage"
            style={{ backgroundImage: `url(${pageTwoBackground})` }}
          >
            <button
              aria-label="Back to the letters"
              className="letter-one-back"
              onClick={() => {
                setIsReturningToPageThree(true)
                setCurrentPage(3)
              }}
              tabIndex={currentPage === 6 ? 0 : -1}
              type="button"
            >
              <span className="letter-one-back-arrow" />
              <span>BACK</span>
            </button>

            <div className="letter-one-marceline">
              <div className="letter-one-marceline-idle">
                <img src={letterOneMarceline} alt="" />
              </div>
            </div>

            <div className="letter-one-message">
              <div className="letter-one-message-idle">
                <img
                  src={letterThreeMessage}
                  alt="Birthday letter from Pratham"
                />
              </div>
            </div>

            <div className="letter-one-name">
              <div className="letter-one-name-idle">
                <img src={letterThreeNameBubble} alt="Pratham" />
              </div>
            </div>

            <div className="letter-one-bmo">
              <div className="letter-one-bmo-idle">
                <img src={letterOneBmo} alt="" />
              </div>
            </div>
          </div>
        </main>
      )}
      {currentPage !== 1 && (
        <main
          aria-hidden={currentPage !== 7}
          aria-label="Letter from Naitik"
          className={`letter-one-page letter-four-page${currentPage === 7 ? " is-active" : ""}`}
        >
          <div
            className="letter-one-stage"
            style={{ backgroundImage: `url(${pageTwoBackground})` }}
          >
            <button
              aria-label="Back to the letters"
              className="letter-one-back"
              onClick={() => {
                setIsReturningToPageThree(true)
                setCurrentPage(3)
              }}
              tabIndex={currentPage === 7 ? 0 : -1}
              type="button"
            >
              <span className="letter-one-back-arrow" />
              <span>BACK</span>
            </button>

            <div className="letter-one-marceline">
              <div className="letter-one-marceline-idle">
                <img src={letterOneMarceline} alt="" />
              </div>
            </div>

            <div className="letter-one-message">
              <div className="letter-one-message-idle">
                <img
                  src={letterFourMessage}
                  alt="Birthday letter from Naitik"
                />
              </div>
            </div>

            <div className="letter-one-name">
              <div className="letter-one-name-idle">
                <img src={letterFourNameBubble} alt="Naitik" />
              </div>
            </div>

            <div className="letter-one-bmo">
              <div className="letter-one-bmo-idle">
                <img src={letterOneBmo} alt="" />
              </div>
            </div>
          </div>
        </main>
      )}
      {currentPage !== 1 && (
        <main
          aria-hidden={currentPage !== 8}
          aria-label="Letter from Soham"
          className={`letter-one-page letter-five-page${currentPage === 8 ? " is-active" : ""}`}
        >
          <div
            className="letter-one-stage"
            style={{ backgroundImage: `url(${pageTwoBackground})` }}
          >
            <button
              aria-label="Back to the letters"
              className="letter-one-back"
              onClick={() => {
                setIsReturningToPageThree(true)
                setCurrentPage(3)
              }}
              tabIndex={currentPage === 8 ? 0 : -1}
              type="button"
            >
              <span className="letter-one-back-arrow" />
              <span>BACK</span>
            </button>

            <div className="letter-one-marceline">
              <div
                className="letter-one-marceline-idle"
                style={{ marginRight: "-227px", marginTop: "93px" }}
              >
                <img src={letterFiveGojo} alt="" />
              </div>
            </div>

            <div className="letter-one-message">
              <div className="letter-one-message-idle">
                <img src={letterFiveMessage} alt="Birthday letter from Soham" />
              </div>
            </div>

            <div className="letter-one-name">
              <div className="letter-one-name-idle">
                <img src={letterFiveNameBubble} alt="Soham" />
              </div>
            </div>

            <div className="letter-one-bmo">
              <div className="letter-one-bmo-idle">
                <img src={letterOneBmo} alt="" />
              </div>
            </div>
          </div>
        </main>
      )}
      {currentPage !== 1 && (
        <main
          aria-hidden={currentPage !== 9}
          aria-label="Letter from Ashish"
          className={`letter-one-page letter-six-page${currentPage === 9 ? " is-active" : ""}`}
        >
          <div
            className="letter-one-stage"
            style={{ backgroundImage: `url(${pageTwoBackground})` }}
          >
            <button
              aria-label="Back to the letters"
              className="letter-one-back"
              onClick={() => {
                setIsReturningToPageThree(true)
                setCurrentPage(3)
              }}
              tabIndex={currentPage === 9 ? 0 : -1}
              type="button"
            >
              <span className="letter-one-back-arrow" />
              <span>BACK</span>
            </button>

            <div className="letter-one-marceline">
              <div className="letter-one-marceline-idle">
                <img src={letterOneMarceline} alt="" />
              </div>
            </div>

            <div className="letter-one-message">
              <div className="letter-one-message-idle">
                <img src={letterSixMessage} alt="Birthday letter from Ashish" />
              </div>
            </div>

            <div className="letter-one-name">
              <div className="letter-one-name-idle">
                <img src={letterSixNameBubble} alt="Ashish" />
              </div>
            </div>

            <div className="letter-one-bmo">
              <div className="letter-one-bmo-idle">
                <img src={letterOneBmo} alt="" />
              </div>
            </div>
          </div>
        </main>
      )}
      {currentPage !== 1 && (
        <main
          aria-hidden={currentPage !== 10}
          aria-label={`Letter from Saara, page ${letterSevenPage + 1} of 3`}
          className={`letter-one-page letter-seven-page${currentPage === 10 ? " is-active" : ""}`}
        >
          <div
            className="letter-one-stage"
            style={{ backgroundImage: `url(${pageTwoBackground})` }}
          >
            <button
              aria-label={
                letterSevenPage < 2
                  ? "Next page of Saara's letter"
                  : "Back to the letters"
              }
              className={`letter-one-back letter-seven-nav${letterSevenPage < 2 ? " is-next" : ""}`}
              onClick={() => {
                if (letterSevenPage < 2) {
                  setLetterSevenPage(
                    (letterSevenPage + 1) as 1 | 2,
                  )
                  return
                }

                setIsReturningToPageThree(true)
                setLetterSevenPage(0)
                setCurrentPage(3)
              }}
              tabIndex={currentPage === 10 ? 0 : -1}
              type="button"
            >
              <span className="letter-one-back-arrow" />
              <span>{letterSevenPage < 2 ? "NEXT" : "BACK"}</span>
            </button>

            <div className="letter-one-marceline">
              <div className="letter-one-marceline-idle">
                <img src={letterOneMarceline} alt="" />
              </div>
            </div>

            <div className="letter-one-message letter-seven-message">
              <div className="letter-one-message-idle">
                <div
                  className={`letter-seven-track letter-seven-track-${letterSevenPage + 1}`}
                >
                  <div className="letter-seven-sheet">
                    <img
                      src={letterSevenPage1}
                      alt="Page 1 of Saara's birthday letter"
                    />
                  </div>
                  <div className="letter-seven-sheet">
                    <img
                      src={letterSevenPage2}
                      alt="Page 2 of Saara's birthday letter"
                    />
                  </div>
                  <div className="letter-seven-sheet">
                    <img
                      src={letterSevenPage3}
                      alt="Page 3 of Saara's birthday letter"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="letter-one-name">
              <div className="letter-one-name-idle">
                <img src={letterSevenNameBubble} alt="Saara" />
              </div>
            </div>

            <div className="letter-one-bmo">
              <div className="letter-one-bmo-idle">
                <img src={letterOneBmo} alt="" />
              </div>
            </div>
          </div>
        </main>
      )}
      {currentPage !== 1 && (
        <main
          aria-hidden={currentPage !== 11}
          aria-label="Letter from Cheku"
          className={`letter-one-page letter-eight-page${currentPage === 11 ? " is-active" : ""}`}
        >
          <div
            className="letter-one-stage"
            style={{ backgroundImage: `url(${pageTwoBackground})` }}
          >
            <button
              aria-label="Back to the letters"
              className="letter-one-back"
              onClick={() => {
                setIsReturningToPageThree(true)
                setCurrentPage(3)
              }}
              tabIndex={currentPage === 11 ? 0 : -1}
              type="button"
            >
              <span className="letter-one-back-arrow" />
              <span>BACK</span>
            </button>

            <div className="letter-one-marceline">
              <div className="letter-one-marceline-idle">
                <img src={letterOneMarceline} alt="" />
              </div>
            </div>

            <div className="letter-one-message">
              <div className="letter-one-message-idle">
                <img src={letterEightMessage} alt="Birthday letter from Cheku" />
              </div>
            </div>

            <div className="letter-one-name">
              <div className="letter-one-name-idle">
                <img src={letterEightNameBubble} alt="Cheku" />
              </div>
            </div>

            <div className="letter-one-bmo">
              <div className="letter-one-bmo-idle">
                <img src={letterOneBmo} alt="" />
              </div>
            </div>
          </div>
        </main>
      )}
      <main
          aria-label={
            isPhonePromptRevealed
              ? "Click on the phone for a surprise."
              : isBirthdayRevealed
                ? "Happy birthday, Simmy."
                : "Someone sent you a message. Open it."
          }
          className={`birthday-page${isLeaving ? " is-leaving" : ""}`}
        >
      <div className="stage">
        <div
          className="plaid-scene"
          style={{ backgroundImage: `url(${plaidBackground})` }}
        >
          <div className="composition">
            <div className="asset flowers">
              <img src={flowers} alt="" />
            </div>

            <div className="message-pair">
              <div className="message-pair-idle">
                <div className="asset marceline">
                  <img src={marceline} alt="" />
                </div>

                <div
                  className={`asset message${isMessageOpened ? " message-open" : ""}${isBirthdayRevealed ? " birthday-open" : ""}${isPhonePromptRevealed ? " phone-prompt-open" : ""}`}
                >
                  <div className="message-alert">
                    <button
                      aria-label="Read the birthday message"
                      className="message-content"
                      disabled={!isMessageOpened || isBirthdayRevealed}
                      onClick={(event) => {
                        event.stopPropagation()
                        revealBirthdayMessage()
                      }}
                      onKeyDown={(event) => event.stopPropagation()}
                      type="button"
                    >
                      <span className="message-hover">
                        <img
                          className="original-message"
                          src={messageBubble}
                          alt=""
                        />
                      </span>
                    </button>

                    <button
                      aria-label="Continue to the next message"
                      className="birthday-message-alert"
                      disabled={
                        !isBirthdayRevealed || isPhonePromptRevealed
                      }
                      onClick={(event) => {
                        event.stopPropagation()
                        revealPhonePrompt()
                      }}
                      onKeyDown={(event) => event.stopPropagation()}
                      type="button"
                    >
                      <span className="birthday-message-hover">
                        <img
                          className="birthday-message"
                          src={happyBirthdayBubble}
                          alt="Happy birthday Simmy!"
                        />
                      </span>
                    </button>

                    <div className="phone-prompt-message-alert">
                      <div className="phone-prompt-message-hover">
                        <img
                          className="phone-prompt-message"
                          src={clickPhoneBubble}
                          alt="Click on the phone for a surprise"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    aria-label="Open the message"
                    className="dialogue-prompt"
                    onClick={(event) => {
                      event.stopPropagation()
                      openMessage()
                    }}
                    onKeyDown={(event) => event.stopPropagation()}
                    type="button"
                  >
                    <span className="dialogue-prompt-hover">
                      <img src={clickOnItBubble} alt="" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <button
              aria-label="Open the surprise"
              className={`asset phone${isPhonePromptRevealed ? " phone-ready" : ""}`}
              disabled={!isPhonePromptRevealed}
              onClick={(event) => {
                event.stopPropagation()
                startNextPageTransition()
              }}
              type="button"
            >
              <div className="phone-idle">
                <div className="phone-hover">
                  <img src={phone} alt="" />
                </div>
              </div>
            </button>

            <div className="asset exclamation exclamation-red">
              <div className="exclamation-float exclamation-float-red">
                <img src={redExclamation} alt="" />
              </div>
            </div>

            <div className="asset exclamation exclamation-blue">
              <div className="exclamation-float exclamation-float-blue">
                <img src={blueExclamation} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="cinematic-bar cinematic-bar-top" />
        <div className="cinematic-bar cinematic-bar-bottom" />
      </div>
      </main>
    </>
  )
}
