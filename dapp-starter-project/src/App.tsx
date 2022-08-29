import "./App.css";

function App() {
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="hand-wave">
            👋
          </span>{" "}
          WELCOME!
        </div>

        <div className="bio">
          イーサリアムウォレットを接続して、メッセージを作成したら、
          <span role="img" aria-label="hand-wave">
            👋
          </span>
          を送ってください
          <span role="img" aria-label="shine">
            ✨
          </span>
        </div>

        {/* <button className="waveButton" onClick={wave}>
          Wave at Me
        </button> */}
        <button className="waveButton">Wave at Me</button>
      </div>
    </div>
  );
}

export default App;
