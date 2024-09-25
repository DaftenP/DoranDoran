"use client";

import { useState } from "react";

export default function Admin() {
  // Default boxShadow values
  const defaultBoxShadow = "20px 20px 40px #cad9e0, -20px -20px 40px #ffffff";
  const hoverBoxShadow = "30px 30px 50px #cad9e0, -30px -30px 50px #ffffff";
  const clickBoxShadow = "10px 10px 20px #cad9e0, -10px -10px 20px #ffffff";

  const innerDefaultBoxShadow = "inset 20px 20px 40px #cad9e0, inset -20px -20px 40px #ffffff";

  // State to track the current boxShadow of the card and the button
  const [boxShadow1, setBoxShadow1] = useState(defaultBoxShadow);
  const [boxShadow2, setBoxShadow2] = useState(defaultBoxShadow);
  const [boxShadow3, setBoxShadow3] = useState(defaultBoxShadow);
  const [buttonBoxShadow, setButtonBoxShadow] = useState(defaultBoxShadow);

  const [isTTSSelected, setIsTTSSelected] = useState(true);
  const [selectedContents, setSelectedContents] = useState("TTS");

  const [audioFile, setAudioFile] = useState(null);
  const [isTTSGenerated, setIsTTSGenerated] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

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
                style={{
                  fontSize: "4vh",
                  marginRight: "3%",
                  marginBottom: "3%",
                  padding: "3%",
                  width: "100%",
                  borderRadius: "30px",
                  background: "#eceef9",
                }}>
                <option value="1">유형 1</option>
                <option value="2">유형 2</option>
                <option value="3">유형 3</option>
                <option value="4">유형 4</option>
              </select>
              <select
                style={{
                  fontSize: "4vh",
                  padding: "3%",
                  marginBottom: "3%",
                  width: "100%",
                  borderRadius: "30px",
                  background: "#eceef9",
                }}>
                <option value="1">주제 1</option>
                <option value="2">주제 2</option>
                <option value="3">주제 3</option>
                <option value="4">주제 4</option>
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
            />
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
              height: '85vh',
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
                style={{
                  fontSize: "4vh",
                  marginRight: "3%",
                  marginBottom: "3%",
                  padding: "3%",
                  width: "100%",
                  borderRadius: "30px",
                  background: "#eceef9",
                }}>
                <option value="1">음성 1</option>
                <option value="2">음성 2</option>
                <option value="3">음성 3</option>
                <option value="4">음성 4</option>
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
                <div style={{ display: isTTSGenerated ? "flex" : "none", alignItems: "center" }}>
                  <audio controls style={{ width: "50vw" }}></audio>
                  <button
                    onClick={() => {
                      setIsSelected(true);
                    }}
                    style={{
                      width: "8vh",
                      height: "8vh",
                      fontSize: "4vh",
                      fontWeight: "bold",
                      borderRadius: "30px",
                      background: !isSelected ? "#9e8ed3" : "green",
                      color: "white",
                    }}>
                    {isSelected ? "✔" : "➕︎"}
                  </button>
                </div>
              </div>
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
                    style={{
                      fontSize: "4vh",
                      padding: "3%",
                      width: "100%",
                      height: "25vw", // You can adjust the height as needed
                      borderRadius: "30px",
                      background: "#eceef9",
                      resize: "none", // Prevents resizing, you can remove this line if resizing should be allowed
                      boxShadow: innerDefaultBoxShadow,
                    }}
                    placeholder="프롬프트 입력"
                  />
                  <button
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
                </div>
                <div
                  style={{
                    width: "30vw",
                    height: "30vw",
                    background: "#9e8ed3",
                    boxShadow: innerDefaultBoxShadow,
                    textAlign: "center",
                    alignContent: "center",
                    color: "white",
                    fontSize: "6vh",
                    fontWeight: "bold",
                  }}>
                  Image Preview
                  </div>
              </div>
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
            onClick={() => handleClick(setButtonBoxShadow)}>
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
