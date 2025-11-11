import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

const WssChat = () => {
  const [msgs, setMsgs] = useState<
    { value: string; timeStamp: any; client: string }[]
  >([]);
  const [inputValue, setInputValue] = useState<string>();
  const [socketState, setSocketState] = useState<WebSocket>();

  const userId = useRef<number | null>(null);

  const chatRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSocketState(socket);

    socket.onopen = (e) => {
      console.log("connection ", e);
      const clientId = new Date().getMilliseconds();
      userId.current = clientId;
    };

    socket.onmessage = (e) => {
      console.log(e, " msg event");
      const msgData = String(e.data);
      const msg = msgData.split("//c:")[0];
      const client = msgData.split("//c:")[1];
      setMsgs((prev) => [
        ...prev,
        {
          value: msg,
          client,
          timeStamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    socket.onclose = (e) => {
      console.log("closed ", e);
    };

    socket.onerror = (err) => {
      console.log("socket error ", err);
    };
    return () => {
      socket.close();
    };
  }, []);

  const onSendMsg = useCallback(() => {
    if (!inputValue) return;
    if (socketState && socketState.readyState === WebSocket.OPEN) {
      socketState.send(
        `${inputValue.replaceAll(/^\n+|\n|\r+$/g, "")}//c:${userId.current}`
      );
      setInputValue("");
    }
  }, [inputValue, socketState, userId]);
  console.log(msgs, " msgs", socketState);

  useEffect(() => {
    msgs.length !== 0 &&
      chatRef?.current?.scrollTo(0, chatRef?.current?.scrollHeight);
  }, [chatRef, msgs]);
  return (
    <main className={styles.contentWrap}>
      <section className={styles.chatContainer}>
        <div className={styles.chatHeader}>Room</div>
        <ul className={styles.chatWindow} ref={chatRef}>
          {msgs.map((msg) => {
            return (
              <li
                key={msg.timeStamp}
                className={`${styles.chatMsg} ${
                  msg.client === String(userId.current) && styles.personMsg
                }`}
              >
                <p>{msg.value}</p>
                <p>{msg.timeStamp.slice(0, -3)}</p>
                <p>{msg.client}</p>
              </li>
            );
          })}
        </ul>
        <div className={styles.chatFooter}>
          <textarea
            onChange={(e) => setInputValue(e.currentTarget.value)}
            value={inputValue}
          />
          <button onClick={onSendMsg}>Send</button>
        </div>
      </section>
    </main>
  );
};
export default WssChat;
