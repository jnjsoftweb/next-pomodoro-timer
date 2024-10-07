"use client";

import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularTimer: React.FC<{ time: number; totalTime: number }> = ({ time, totalTime }) => {
  const percentage = ((totalTime - time) / totalTime) * 100;

  return (
    <div className={styles.circularTimer}>
      <CircularProgressbar
        value={percentage}
        text={`${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, "0")}`}
        styles={buildStyles({
          textSize: "16px",
          pathTransitionDuration: 0.5,
          pathColor: `rgba(128, 0, 128, 1)`, // 보라색
          textColor: "#333",
          trailColor: "#d6d6d6",
          backgroundColor: "#e0e5ec",
        })}
      />
    </div>
  );
};

const Home: React.FC = () => {
  const [time, setTime] = useState(1500); // 25분 (1500초)
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTime(1500);
    setIsActive(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Pomodoro Timer</title>
        <meta name="description" content="A simple Pomodoro Timer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Pomodoro Timer</h1>
        <p className={styles.description}>
          With Pomodoro Timer Online, you will achieve your goals by staying focused and painless in the process. With Background Music, Custom Timer, and To Do
          List.
        </p>
        <CircularTimer time={time} totalTime={1500} />
        <div className={styles.buttons}>
          <button className={styles.button} onClick={toggleTimer}>
            {isActive ? "Pause" : "Start"}
          </button>
          <button className={styles.button} onClick={resetTimer}>
            Reset
          </button>
        </div>
        <div className={styles.features}>
          <h2>Features</h2>
          <ul>
            <li>Background Music</li>
            <li>Custom Timer</li>
            <li>To Do List</li>
            <li>Desktop Notifications</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
