import { importShared } from './__federation_fn_import.js';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

const contentWrap = "_contentWrap_1qbng_1";
const chatContainer = "_chatContainer_1qbng_9";
const chatHeader = "_chatHeader_1qbng_19";
const chatWindow = "_chatWindow_1qbng_25";
const chatMsg = "_chatMsg_1qbng_37";
const personMsg = "_personMsg_1qbng_40";
const chatFooter = "_chatFooter_1qbng_44";
const styles = {
	contentWrap: contentWrap,
	chatContainer: chatContainer,
	chatHeader: chatHeader,
	chatWindow: chatWindow,
	chatMsg: chatMsg,
	personMsg: personMsg,
	chatFooter: chatFooter
};

const {useCallback,useEffect,useRef,useState} = await importShared('react');
const WssChat = () => {
  const [msgs, setMsgs] = useState([]);
  const [inputValue, setInputValue] = useState();
  const [socketState, setSocketState] = useState();
  const userId = useRef(null);
  const chatRef = useRef(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSocketState(socket);
    socket.onopen = (e) => {
      console.log("connection ", e);
      const clientId = (/* @__PURE__ */ new Date()).getMilliseconds();
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
          timeStamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
        }
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
    msgs.length !== 0 && chatRef?.current?.scrollTo(0, chatRef?.current?.scrollHeight);
  }, [chatRef, msgs]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: styles.contentWrap, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.chatContainer, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.chatHeader, children: "Room" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: styles.chatWindow, ref: chatRef, children: msgs.map((msg) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: `${styles.chatMsg} ${msg.client === String(userId.current) && styles.personMsg}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: msg.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: msg.timeStamp.slice(0, -3) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: msg.client })
          ]
        },
        msg.timeStamp
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.chatFooter, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          onChange: (e) => setInputValue(e.currentTarget.value),
          value: inputValue
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSendMsg, children: "Send" })
    ] })
  ] }) });
};

export { WssChat as default, jsxRuntimeExports as j };
