"use client";

import hljs from "highlight.js";
import { useEffect } from "react";
import "highlight.js/styles/androidstudio.css";

export function SyntaxHighlight() {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return <></>;
}
