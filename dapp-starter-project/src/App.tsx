import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // ユーザーのpublic wallet
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount: ", currentAccount);

  /** window.ethereumにアクセス可能か確認 */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return console.log("Make sure you have MetaMask!");
      console.log("We have the ethereum object", ethereum);

      /** ユーザーのwalletへアクセスが許可されているかどうか */
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  /** walletの接続 */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return alert("Get MetaMask!");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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

        <button className="waveButton" onClick={() => null}>
          Wave at Me
        </button>

        <button className="waveButton" onClick={connectWallet}>
          {currentAccount ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
}

export default App;
