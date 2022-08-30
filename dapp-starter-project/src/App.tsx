import React from "react";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import abi from "./utils/WavePortal.json";
import "./App.css";

type WaveProps = {
  waver: string;
  message: string;
  timestamp: {
    _hex: string;
  };
};

function App() {
  // ユーザーのpublic wallet
  const [currentAccount, setCurrentAccount] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [allWaves, setAllWaves] = useState<WaveProps[]>([]);
  console.log("currentAccount: ", currentAccount);
  console.log("allWaves", allWaves);

  const contractAddress = "0x129e3a25884c5495C0b0a8E09b9FD5c3B8F8681a";
  const contractABI = abi.abi;

  const getAllWaves = useCallback(async () => {
    const { ethereum } = window;

    try {
      if (!ethereum) return console.log("Ethereum object doesn't exist!");
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const waves = await wavePortalContract.getAllWaves();
      const wavesCleaned = waves.map((wave: WaveProps) => ({
        waver: wave.waver,
        timestamp: wave.timestamp,
        message: wave.message,
      }));
      setAllWaves(wavesCleaned);
    } catch (err) {
      console.log(err);
    }
  }, [contractABI]);

  useEffect(() => {
    let wavePortalContract: ethers.Contract;

    const onNewWave = (waver: string, timestamp: any, message: string) => {
      console.log("NewWave", waver, timestamp, message);
      setAllWaves((prev) => [
        ...prev,
        {
          waver,
          timestamp,
          message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      // イベントリスナー
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, [contractABI]);

  /** window.ethereumにアクセス可能か確認 */
  const checkIfWalletIsConnected = useCallback(async () => {
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
        getAllWaves();
      } else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.log(err);
    }
  }, [getAllWaves]);

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

  /** waveの回数をカウント */
  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          // signer(read & write) or provider(read only)
          signer
        );
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count._hex);

        const waveTxn = await wavePortalContract.wave(messageValue, {
          gasLimit: 300000,
        });
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count._hex);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

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

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        <button className="waveButton" onClick={connectWallet}>
          {currentAccount ? "Wallet Connected" : "Connect Wallet"}
        </button>

        {currentAccount && (
          <textarea
            name="messageArea"
            placeholder="メッセージはこちら"
            id="message"
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
          />
        )}

        {currentAccount &&
          allWaves
            .slice(0)
            .reverse()
            .map((wave, index) => {
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#F8F8FF",
                    marginTop: "16px",
                    padding: "8px",
                  }}
                >
                  <div>Address: {wave.waver}</div>
                  <div>timestamp: {JSON.stringify(wave.timestamp)}</div>
                  <div>Message: {wave.message}</div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default App;
