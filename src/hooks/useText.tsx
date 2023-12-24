"use client";

import { createContext, useContext, useEffect, useState } from "react";

type TextContext = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

const TextContext = createContext<TextContext>({
  text: "",
  setText: () => undefined
})

export const TextProvider = ({ children }: any) => {
  const [text, setText] = useState("");

  const fetchText = async () => {
    const text = await fetch("/api/text")
      .then((response) => response.text())
      .then((data) => data);
    return text;
  };

  useEffect(() => {
    fetchText().then((text) => setText(text));
  }, []);

  return (
    <TextContext.Provider
      value={{ text, setText }}
    >
      {children}
    </TextContext.Provider>
  );
};

export const useText = () => {
  return useContext(TextContext);
};
