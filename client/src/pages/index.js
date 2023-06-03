import React, { useState, useEffect } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [value, setValue] = useState("");
  useEffect(() => {
    fetch(`/text`)
      .then((response) => response.text())
      .then((data) => setValue(data));
  }, []);

  const handleChange = (event) => setValue(event.target.value);

  const handleBlur = (event) => {
    const { value } = event.target;
    fetch(`/text`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: value,
    });
    setValue(value);
  };

  return (
    <>
      <Head>
        <title>Delen</title>
        <meta name="description" content="Delen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <TextareaAutosize
        onBlur={handleBlur}
        className={styles.dialog}
        id="textArea"
        minRows={30}
        value={value}
        onChange={handleChange}
      />
    </>
  );
};

export default HomePage;
