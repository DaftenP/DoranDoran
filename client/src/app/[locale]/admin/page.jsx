"use client";

import { useEffect, useState } from "react";

export default function Admin() {
  // Default boxShadow values
  const defaultBoxShadow = "20px 20px 40px #cad9e0, -20px -20px 40px #ffffff";
  const hoverBoxShadow = "30px 30px 50px #cad9e0, -30px -30px 50px #ffffff";
  const clickBoxShadow = "10px 10px 20px #cad9e0, -10px -10px 20px #ffffff";

  const innerDefaultBoxShadow = "inset 20px 20px 40px #cad9e0, inset -20px -20px 40px #ffffff";

  const [quizType, setQuizType] = useState(1);
  const [quizCategory, setQuizCategory] = useState(1);
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");

  // State to track the current boxShadow of the card and the button
  const [boxShadow1, setBoxShadow1] = useState(defaultBoxShadow);
  const [boxShadow2, setBoxShadow2] = useState(defaultBoxShadow);
  const [boxShadow3, setBoxShadow3] = useState(defaultBoxShadow);
  const [buttonBoxShadow, setButtonBoxShadow] = useState(defaultBoxShadow);

  const [isTTSSelected, setIsTTSSelected] = useState(true);
  const [selectedContents, setSelectedContents] = useState("TTS");

  const [audioFile, setAudioFile] = useState(null);
  const [isTTSGenerated, setIsTTSGenerated] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedAudioText, setSelectedAudioText] = useState("");
  
  const [ttsText, setTTSText] = useState("");
  const [ttsVoice, setTTSVoice] = useState("A");
  const [isTTSLoading, setIsTTSLoading] = useState(false);

  const [imageLink, setImageLink] = useState(null);
  const [imageSeed, setImageSeed] = useState(12345678);
  const [imagePrompt, setImagePrompt] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [selectedFileList, setSelectedFileList] = useState([]);

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (imageLink) {
      const img = new Image();
      img.src = imageLink;
      img.onload = () => {
        setIsImageLoading(false);
      };
      img.onerror = () => {
        setIsImageLoading(false);
      };
    } else {
      setIsImageLoading(false);
    }
  }, [imageLink]);

  // 페이지 로딩 시 자동으로 시드 생성
  useEffect(() => {
    setImageSeed(Math.floor(Math.random() * 100000000));
  }, []);

  // Handlers for card hover and click effects
  const handleMouseEnter = (setBoxShadow) => {
    setBoxShadow(hoverBoxShadow);
  };

  const handleMouseLeave = (setBoxShadow) => {
    setBoxShadow(defaultBoxShadow);
  };

  const handleClick = (setBoxShadow) => {
    setBoxShadow(clickBoxShadow);
    setTimeout(() => setBoxShadow(defaultBoxShadow), 300); // Reset boxShadow after a short delay
  };

  const handleToggle = () => {
    setIsTTSSelected(!isTTSSelected);
    setSelectedContents(isTTSSelected ? "Image" : "TTS");
  };

  const generateImage = () => {
    // replace all spaces with '-' in the prompt
    const prompt = imagePrompt.replace(/ /g, "-");

    // set loading state
    setIsImageLoading(true);

    // generate image link: GET request to https://bff.ssafy.picel.net/api/v1/bff/admin/quiz?seed=12122112&prompt=a-snake-eating-cake
    fetch(`https://bff.ssafy.picel.net/api/v1/bff/admin/quiz?seed=${imageSeed}&prompt=${prompt}`)
      .then((response) => response.text())
      .then((data) => {
        setImageLink(data);
      });
  };

  const generateTTS = () => {
    // set loading state
    setIsTTSLoading(true);

    setIsSending(true);

    // generate TTS: POST request to https://bff.ssafy.picel.net/api/v1/bff/tts. put text and voice in form data
    const formData = new FormData();
    formData.append("text", ttsText);
    formData.append("voice", ttsVoice);

    fetch("https://bff.ssafy.picel.net/api/v1/bff/tts", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        let url = URL.createObjectURL(blob);
        setAudioFile(url);
        setIsSending(false);
      });
    
    setIsTTSLoading(false);
  }

  const registQuiz = () => {
    // POST request to https://bff.ssafy.picel.net/api/v1/bff/quiz/quizzes/regist
    // multipart/form-data that contains json text, voice, image1, image2, image3, image4
    // json text: {'quizQuestion': '문제', 'quizAnswer': '정답', 'quizType': 1234, 'quizCategory': 1234}

    // set loading state
    setIsSending(true);

    const formData = new FormData();
    formData.append("quizInfo", JSON.stringify({
      quizQuestion,
      quizAnswer,
      quizType,
      quizCategory,
    }));

    const promises = selectedFileList.map((file, index) => {
      return fetchImageAsBlob(file.content).then((blob) => {
        const newFileName = `image${index + 1}.jpg`; // 원하는 파일명 설정
        const fileWithFileName = new File([blob], newFileName, { type: blob.type });
        formData.append(`image${index + 1}`, fileWithFileName);
      });
    });
    
    promises.push(
      fetchImageAsBlob(selectedAudio).then((blob) => {
        const audioFileName = "voice.mp3"; // 원하는 파일명 설정
        const audioFileWithFileName = new File([blob], audioFileName, { type: blob.type });
        formData.append("voice", audioFileWithFileName);
      })
    );
    
    Promise.all(promises).then(() => {
      fetch("https://bff.ssafy.picel.net/api/v1/bff/quiz/quizzes/regist", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.status === 200) {
            // reset all states
            setQuizQuestion("");
            setQuizAnswer("");
            setSelectedFileList([]);
            setSelectedAudio(null);
            setSelectedAudioText("");
            setAudioFile(null);
            setIsTTSGenerated(false);
            setPlayingIndex(-1);
            setPlayingAudio(null);
            setTTSText("");
            setTTSVoice("A");
            setImageLink(null);
            setImagePrompt("");

            setIsSending(false);
          }
        }
      );
    });
  };

  const shuffleSeed = () => {
    setImageSeed(Math.floor(Math.random() * 100000000));
  };

  const fetchImageAsBlob = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  return (
    <div
      style={{
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#eceef9",
        userSelect: "none",
      }}>
      {isSending ?
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "999",
          }}>
          <div
            style={{
              width: "80vw",
              height: "80vh",
              backgroundColor: "white",
              borderRadius: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <div style={{ fontSize: "4vh", fontWeight: "bold", marginBottom: "5vh" }}>
              work in progress...
            </div>
            <div
              style={{
                width: "20vw",
                height: "20vw",
                borderRadius: "50%",
                border: "10px solid #9e8ed3",
                borderTop: "10px solid white",
                animation: "spin 1s linear infinite",
              }}></div>
          </div>
        </div> : null
      }
      <div
        style={{
          fontFamily: "Arial",
          display: "flex",
          flexDirection: "column",
          width: "80vw",
          marginTop: "4vh",
          marginBottom: "4vh",
        }}>
        <div style={{ fontSize: "8vh", marginBottom: "4vh", fontWeight: "bold" }}>
          Quiz Generate Page
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: "10vh",
          }}>
          <div
            style={{
              fontSize: "4vh",
              padding: "3%",
              width: "64%",
              borderRadius: "30px",
              background: "#eceef9",
              boxShadow: boxShadow1,
              transition: "box-shadow 0.3s",
            }}
            onMouseEnter={() => handleMouseEnter(setBoxShadow1)}
            onMouseLeave={() => handleMouseLeave(setBoxShadow1)}>
            <div style={{ fontSize: "3.3vh", fontWeight: "bold", marginBottom: "3%" }}>
              Quiz Informations
            </div>
            <div style={{ display: "flex", flexDirection: "row", marginBottom: "3%" }}>
              <select
                onChange={(e) => setQuizType(Number(e.target.value))}
                style={{
                  fontSize: "4vh",
                  marginRight: "3%",
                  marginBottom: "3%",
                  padding: "3%",
                  width: "100%",
                  borderRadius: "30px",
                  background: "#eceef9",
                }}>
                <option value="5001">그림 맞추기</option>
                <option value="5002">단어 말하기</option>
                <option value="5003">문장 말하기</option>
              </select>
              <select
                onChange={(e) => setQuizCategory(Number(e.target.value))}
                style={{
                  fontSize: "4vh",
                  padding: "3%",
                  marginBottom: "3%",
                  width: "100%",
                  borderRadius: "30px",
                  background: "#eceef9",
                }}>
                <option value="7001">disabled</option>
              </select>
            </div>

            <textarea
              style={{
                fontSize: "4vh",
                padding: "3%",
                width: "100%",
                height: "30vh", // You can adjust the height as needed
                borderRadius: "30px",
                background: "#eceef9",
                resize: "none",
                boxShadow: innerDefaultBoxShadow,
              }}
              placeholder="문제 입력"
              onChange={(e) => setQuizQuestion(e.target.value)}
            />
            <textarea
              style={{
                fontSize: "4vh",
                padding: "3%",
                width: "100%",
                height: "30vh", // You can adjust the height as needed
                borderRadius: "30px",
                background: "#eceef9",
                resize: "none", // Prevents resizing, you can remove this line if resizing should be allowed
                boxShadow: innerDefaultBoxShadow,
              }}
              placeholder="정답 입력"
              onChange={(e) => setQuizAnswer(e.target.value)}
            />
            {
              selectedAudio && (  
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <audio controls
                      style={{
                        width: "40vw",
                      }}
                    >
                      <source src={selectedAudio} type="audio/wav" />
                      Your browser does not support the audio tag.
                    </audio>
                    <div style={{ fontSize: "4vh", padding: "1vh 0" }}>
                      TTS text: {selectedAudioText}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAudio(null);
                      setSelectedAudioText("");
                    }}
                    style={{
                      fontSize: "4vh",
                      fontWeight: "bold",
                      padding: "1vh 0",
                      borderRadius: "30px",
                      color: "white",
                      marginLeft: "3vw",
                    }}
                  >
                    ❌
                  </button>
                </div>
              )
            }
          </div>
          <div
            style={{
              fontSize: "4vh",
              padding: "3%",
              width: "24%",
              borderRadius: "30px",
              background: "#eceef9",
              boxShadow: boxShadow2,
              transition: "all 0.3s",
            }}
            onMouseEnter={() => handleMouseEnter(setBoxShadow2)}
            onMouseLeave={() => handleMouseLeave(setBoxShadow2)}>
            <div style={{ fontSize: "3.3vh", fontWeight: "bold", marginBottom: "3%" }}>
              Selected Contents
            </div>
            {/* show selected file list contents, if image, show image preview. if audio, show player */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                marginBottom: "3%",
                width: "100%",
                height: "85vh",
                overflowY: "auto",
                scrollbarWidth: "none",
              }}>
              {selectedFileList.map((file, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "1vw",
                    }}>
                    {/* up and down button for reorder */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <button
                        onClick={
                          index === 0
                            ? () => {}
                            : () => {
                                const temp = selectedFileList[index];
                                selectedFileList[index] = selectedFileList[index - 1];
                                selectedFileList[index - 1] = temp;
                                setSelectedFileList([...selectedFileList]);
                              }
                        }
                        style={{
                          height: "8vh",
                          fontSize: "4vh",
                          fontWeight: "bold",
                          borderRadius: "30px",
                          color: "#9e8ed3",
                          marginRight: "1vw",
                        }}>
                        ⬆
                      </button>
                      <button
                        onClick={
                          index === selectedFileList.length - 1
                            ? () => {}
                            : () => {
                                const temp = selectedFileList[index];
                                selectedFileList[index] = selectedFileList[index + 1];
                                selectedFileList[index + 1] = temp;

                                setSelectedFileList([...selectedFileList]);
                              }
                        }
                        style={{
                          height: "8vh",
                          fontSize: "4vh",
                          fontWeight: "bold",
                          borderRadius: "30px",
                          color: "#9e8ed3",
                          marginRight: "1vw",
                        }}>
                        ⬇
                      </button>
                    </div>
                    {/* show file. if it's audio, show player. if image, preview image. both are blob */}
                    {file.type === "audio" ? (
                      // <audio controls style={{ width: "5vw" }}>
                      //   <source src={file.content} type="audio/mpeg" />
                      //   Your browser does not support the audio element.
                      // </audio>
                      // just play and stop button for audio file
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <audio controls
                          style={{
                            width: "50vw",
                            display: "none",
                          }}>
                          <source src={file.content} type="audio/wav" />
                          Your browser does not support the audio tag.
                        </audio>
                        <button
                          onClick={() => {
                            const audio = new Audio(file.content);
                            if (playingAudio) {
                              playingAudio.pause();
                            }
                            if (playingIndex === index) {
                              setPlayingIndex(-1);
                              setPlayingAudio(null);
                              audio.pause();
                              return;
                            }
                            setPlayingAudio(audio);
                            setPlayingIndex(index);
                            audio.play();
                            audio.onended = () => {
                              setPlayingIndex(-1);
                              setPlayingAudio(null);
                            }
                            // if (playingIndex === index) {
                            //   if (audio.paused) {
                            //     audio.play();
                            //   } else {
                            //     audio.pause();
                            //   }
                            // } else if (playingIndex === -1) {
                            //   setPlayingIndex(index);
                            //   audio.play();
                            //   // wait until the audio play and set playing index to -1
                            //   audio.onended = () => {
                            //     setPlayingIndex(-1);
                            //   };
                            // } else {
                            //   alert("Please stop the currently playing audio first!");
                            // }
                          }}
                          style={{
                            width: "8vh",
                            height: "8vh",
                            fontSize: "4vh",
                            fontWeight: "bold",
                            borderRadius: "30px",
                            color: (playingIndex === index) ? "red" : "green",
                          }}>
                          {(playingIndex === index) ? "■" : "▶"}
                        </button>
                      </div>
                    ) : (
                      <img src={file.content} style={{ width: "60%" }} />
                    )}
                    {/* show removal button */}
                    <button
                      onClick={() => {
                        setSelectedFileList(selectedFileList.filter((_, i) => i !== index));
                      }}
                      style={{
                        width: "8vh",
                        height: "8vh",
                        fontSize: "4vh",
                        fontWeight: "bold",
                        borderRadius: "30px",
                        color: "#9e8ed3",
                        marginLeft: "1vw",
                      }}>
                      ❌
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}>
          <div
            className="toggle-wrap"
            style={{
              fontSize: "4vh",
              padding: "3%",
              width: "94%",
              borderRadius: "30px",
              background: "#eceef9",
              boxShadow: boxShadow3,
              transition: "all 0.3s",
            }}
            onMouseEnter={() => handleMouseEnter(setBoxShadow3)}
            onMouseLeave={() => handleMouseLeave(setBoxShadow3)}>
            <div style={{ display: "flex", marginBottom: "3%" }}>
              {/* binary switch between tts and image */}
              <div
                onClick={handleToggle}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "#9e8ed3",
                  borderRadius: "50px",
                  padding: "1vh",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}>
                <div
                  style={{
                    fontSize: "3.3vh",
                    width: "7vw",
                    fontWeight: "bold",
                    color: isTTSSelected ? "#9e8ed3" : "#eceef9",
                    borderRadius: "50px",
                    padding: "1vh 3vh",
                    transition: "all 0.3s",
                  }}>
                  TTS
                </div>
                <div
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                    width: "7vw",
                    height: "7vh",
                    borderRadius: "50px",
                    transition: "all 0.3s",
                    transform: isTTSSelected ? "translateX(0)" : "translateX(100%)",
                  }}>
                  <div
                    style={{
                      fontSize: "3.3vh",
                      fontWeight: "bold",
                      padding: "1vh 3vh",
                      textAlign: "center",
                      transition: "all 0.3s",
                      color: "#9e8ed3",
                    }}>
                    {selectedContents}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "3.3vh",
                    width: "7vw",
                    fontWeight: "bold",
                    color: isTTSSelected ? "#eceef9" : "#9e8ed3",
                    padding: "1vh 3vh",
                    borderRadius: "50px",
                    transition: "all 0.3s",
                  }}>
                  Image
                </div>
              </div>
              <div style={{ fontSize: "3.3vh", fontWeight: "bold", padding: "2vh" }}>Generator</div>
            </div>
            <div className="tts-gen" style={{ display: isTTSSelected ? "block" : "none" }}>
              <select
                onChange={(e) => setTTSVoice(e.target.value)}
                style={{
                  fontSize: "4vh",
                  marginRight: "3%",
                  marginBottom: "3%",
                  padding: "3%",
                  width: "100%",
                  borderRadius: "30px",
                  background: "#eceef9",
                }}>
                <option value="A">Voice A</option>
                <option value="B">Voice B</option>
                <option value="C">Voice C</option>
                <option value="D">Voice D</option>
              </select>
              <textarea
                style={{
                  fontSize: "4vh",
                  padding: "3%",
                  marginBottom: "3%",
                  width: "100%",
                  height: "30vh", // You can adjust the height as needed
                  borderRadius: "30px",
                  background: "transparent",
                  resize: "none", // Prevents resizing, you can remove this line if resizing should be allowed
                  boxShadow: innerDefaultBoxShadow,
                }}
                placeholder="텍스트 입력"
                onChange={(e) => setTTSText(e.target.value)}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "3%",
                  marginBottom: "3%",
                }}>
                <button
                  onClick={() => {
                    if (!ttsText) {
                      alert("Please enter a text first!");
                      return;
                    }
                    generateTTS();
                    setIsTTSGenerated(true);
                  }}
                  style={{
                    width: "12vw",
                    fontSize: "4vh",
                    fontWeight: "bold",
                    padding: "1vh 0",
                    borderRadius: "30px",
                    background: "#9e8ed3",
                    color: "white",
                  }}>
                  Generate
                </button>
                <div
                  style={{
                    display: isTTSLoading ? "block" : "none",
                    fontSize: "4vh",
                    fontWeight: "bold",
                    color: "#9e8ed3",
                  }}>
                  Loading...
                </div>
                <div style={{ display: isTTSGenerated ? "flex" : "none", alignItems: "center" }}>
                {audioFile && (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                    <audio controls
                      style={{
                        width: "50vw",
                      }}>
                      <source src={audioFile} type="audio/wav" />
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                )}
                </div>
              </div>
                {
                  audioFile && (
                  <div style={
                    {
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <button
                        onClick={() => {
                          setSelectedAudio(audioFile);
                          setSelectedAudioText(ttsText);
                        }}
                        style={{
                          width: "12vw",
                          fontSize: "4vh",
                          fontWeight: "bold",
                          padding: "1vh 0",
                          borderRadius: "30px",
                          background: "#9e8ed3",
                          color: "white",
                        }}>
                        Add Audio
                      </button>
                    </div>
                  )
                }
            </div>

            <div className="image-gen" style={{ display: isTTSSelected ? "none" : "block" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "3%",
                }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "start",
                    width: "35vw",
                    height: "30vw",
                  }}>
                  <textarea
                    // placeholder centered
                    style={{
                      fontSize: "4vh",
                      padding: "3%",
                      width: "100%",
                      height: "22vw", // You can adjust the height as needed
                      borderRadius: "30px",
                      background: "#eceef9",
                      resize: "none", // Prevents resizing, you can remove this line if resizing should be allowed
                      boxShadow: innerDefaultBoxShadow,
                    }}
                    placeholder="Prompts (e.g. 'a cat sitting on a table')"
                    onChange={(e) => setImagePrompt(e.target.value)}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <button
                      onClick={() => {
                        if (!imagePrompt) {
                          alert("Please enter a prompt first!");
                          return;
                        }
                        generateImage();
                      }}
                      style={{
                        width: "12vw",
                        fontSize: "4vh",
                        fontWeight: "bold",
                        padding: "1vh 0",
                        borderRadius: "30px",
                        background: "#9e8ed3",
                        color: "white",
                      }}>
                      Generate
                    </button>
                    <div
                      style={{
                        borderRadius: "30px",
                        background: "#eceef9",
                        padding: "1vh",
                        fontSize: "4vh",
                        fontWeight: "bold",
                        color: "#9e8ed3",
                        marginLeft: "3vw",
                        boxShadow: innerDefaultBoxShadow,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                      <div style={{ width: "10vw", marginLeft: "3vw" }}>{imageSeed}</div>
                      <button
                        onClick={() => {
                          shuffleSeed();
                        }}
                        className="shuffle-seed"
                        style={{
                          width: "8vh",
                          height: "8vh",
                          marginLeft: "1vw",
                          fontSize: "4vh",
                          fontWeight: "bold",
                          borderRadius: "30px",
                          background: "#9e8ed3",
                          color: "white",
                        }}>
                        🎲
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "30vw",
                    height: "30vw",
                    background: "#9e8ed3",
                    boxShadow: imageLink && !isImageLoading ? "none" : innerDefaultBoxShadow,
                    textAlign: "center",
                    alignContent: "center",
                    color: "white",
                    fontSize: "6vh",
                    fontWeight: "bold",
                    backgroundImage: `url(${imageLink})`,
                    backgroundSize: "cover",
                    borderRadius: "30px",
                  }}>
                  {!imageLink ? "Image Preview" : isImageLoading ? "Loading..." : ""}
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <button
                onClick={() => {
                  // put image file into selectedFileList as an blob object
                  fetchImageAsBlob(imageLink).then((blob) => {
                    setSelectedFileList([
                      ...selectedFileList,
                      { type: "image", content: URL.createObjectURL(blob) },
                    ]);
                  });
                }}
                style={{
                  width: "12vw",
                  fontSize: "4vh",
                  fontWeight: "bold",
                  padding: "1vh 0",
                  borderRadius: "30px",
                  background: "#9e8ed3",
                  color: "white",
                  display: imageLink && !isImageLoading && !isTTSSelected ? "block" : "none",
                }}>
                Add Image
              </button>
            </div>
          </div>
        </div>
        {/* Submit button */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <button
            style={{
              width: "fit-content",
              borderRadius: "50px",
              marginTop: "10vh",
              marginBottom: "10vh",
              boxShadow: buttonBoxShadow,
              transition: "box-shadow 0.3s",
            }}
            onMouseEnter={() => handleMouseEnter(setButtonBoxShadow)}
            onMouseLeave={() => handleMouseLeave(setButtonBoxShadow)}
            // onClick={() => handleClick(setButtonBoxShadow)}>
            onClick={() => {
              registQuiz();
              handleClick(setButtonBoxShadow);
            } }
          >
            <div
              style={{
                fontSize: "4vh",
                color: "white",
                fontWeight: "bold",
                background: "#9e8ed3",
                borderRadius: "50px",
                padding: "5px 30px",
                margin: "10px",
              }}>
              Submit
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
