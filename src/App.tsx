import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

// import useAuthStore from "prehost_app/store/authStore";
// const test = lazy(() => import("prehost_app/store/useAuthStore") as any);
const fetchAuthStore = async (): Promise<{
  useAuthStateSelector: () => string | null;
} | null> => {
  try {
    const useAuthStore = (
      await import("prehost_app/store/useAuthStateSelector")
    ).default;
    console.log(useAuthStore, "result import");
    return useAuthStore;
  } catch {
    console.log("error with fetch");
    return null;
  }
};
const authStore = await fetchAuthStore();
const WssChat = () => {
  const [msgs, setMsgs] = useState<
    { value: string; timeStamp: any; clientId: string; clientName: string }[]
  >([]);
  const [inputValue, setInputValue] = useState<string>();
  const [socketState, setSocketState] = useState<WebSocket>();

  const userId = useRef<number | null>(null);
  const userName = useRef<string | null>(null);
  // console.log(test, " test load");
  const userNameStore = authStore?.useAuthStateSelector();
  console.log(userNameStore, " test load store");
  const chatRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    if (userNameStore && userName.current) {
      userName.current = userNameStore;
    }
  }, [userNameStore, userName.current]);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSocketState(socket);

    // socket.onopen = (e) => {
    //   console.log("connection ", e);
    //   const clientId = new Date().getMilliseconds();
    //   userId.current = clientId;
    // };

    socket.onmessage = (e) => {
      console.log(e, " msg event");
      if (e.data.includes("wsServer")) {
        const parseMsg: {
          wsServer: string;
          text: string;
          clientId: number;
        } = JSON.parse(e.data);
        userId.current = parseMsg.clientId;
        userName.current = userNameStore ?? "unknown";
        console.log(userNameStore, "userNameStore");
        const msg = parseMsg.text.split("//c:")[0];
        setMsgs((prev) => [
          ...prev,
          {
            value: msg,
            clientId: "WS",
            clientName: "Server",
            timeStamp: new Date().toLocaleTimeString(),
          },
        ]);
        return;
      }
      const msgData = String(e.data);
      const msg = msgData.split("//c:")[0];
      const clientId = msgData.split("//c:")[1];
      const clientName = msgData.split("//c:")[2];
      setMsgs((prev) => [
        ...prev,
        {
          value: msg,
          clientId,
          clientName,
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
        `${inputValue.replaceAll(/^\n+|\n|\r+$/g, "")}//c:${
          userId.current
        }//c:${userName.current}`
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
                  msg.clientId === String(userId.current) && styles.personMsg
                }`}
              >
                <p role="name">
                  {`${msg.clientName}[${msg.clientId ?? null}]`}/
                  {msg.timeStamp.slice(0, -3)}
                </p>
                <p>{msg.value}</p>
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
