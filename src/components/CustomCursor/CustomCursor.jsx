import React, { useState, useEffect } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [textInput, setTextInput] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);
    const handleHover = () => setHovered(true);
    const handleUnhover = () => setHovered(false);
    const handleTextFocus = () => setTextInput(true);
    const handleTextBlur = () => setTextInput(false);

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleUnhover);
    });

    document.querySelectorAll("input, textarea").forEach((el) => {
      el.addEventListener("focus", handleTextFocus);
      el.addEventListener("blur", handleTextBlur);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        className={`cursor-outer ${hovered ? "hovered" : ""} ${textInput ? "text-mode" : ""}`}
        style={{ left: `${position.x}px`, top: `${position.y}px`, opacity: visible ? 1 : 0 }}
      ></div>
      <div
        className={`cursor-inner ${hovered ? "hovered" : ""} ${textInput ? "text-mode" : ""}`}
        style={{ left: `${position.x}px`, top: `${position.y}px`, opacity: visible ? 1 : 0 }}
      ></div>
    </>
  );
};

export default CustomCursor;
