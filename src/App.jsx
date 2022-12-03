import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import {
  HuddleClientProvider,
  getHuddleClient,
  useRootStore,
} from "@huddle01/huddle01-client";
import PeerVideoAudioElem from "./components/PeerVideoAudioElem";
import { ethers } from "ethers";

function App() {
  const huddleClient = getHuddleClient("db4e20e2145d9113445924d230ebd5e8c260ab3380177bc1f9dbe0dd10876c05");
  const stream = useRootStore((state) => state.stream);
  const enableStream = useRootStore((state) => state.enableStream);
  const pauseTracks = useRootStore((state) => state.pauseTracks);
  const isCamPaused = useRootStore((state) => state.isCamPaused);
  const peers = useRootStore((state) => state.peers);
  const peerId = useRootStore((state) => state.peerId);
  const lobbyPeers = useRootStore((state) => state.lobbyPeers);
  const roomState = useRootStore((state) => state.roomState);
  const [walletAddress, setWalletAddress] = useState("");

  const handleJoin = async () => {
    try {
      await huddleClient.join("shantanu12345", {
        address: "0x5c76080541945376ba10e72350e41dbb7786CB13",
        wallet: "",
        ens: "axit.eth",
      });

      console.log("joined");
    } catch (error) {
      console.log({ error });
    }
  };

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    console.log({ peers: Object.values(peers), peerId, isCamPaused });
  }, [peers, peerId, isCamPaused]);

  async function requestAccount() {
    console.log("Requesting account...");

    // Check if metamask exists
    if(window.ethereum){
      console.log('detected');

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting...');
      }
    } else {
      console.log('Metamask not detected');
    }
  }

  async function connectWallet() {
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  return (
    <HuddleClientProvider value={huddleClient}>
      <div className="App grid grid-cols-2">
        <div>
          <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src="/vite.svg" className="logo" alt="Vite logo" />
            </a>
            <a href="https://reactjs.org" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>

          <h2 className={`text-${!roomState.joined ? "red" : "green"}`}>
            Room Joined:&nbsp;{roomState.joined.toString()}
          </h2>
          <h2>Instructions</h2>
          <ol className="w-fit mx-auto text-left">
            <li>
              Click on <b>Enable Stream</b>
            </li>
            <li>
              Then Click on <b>Join room</b>, <i>"Room Joined"</i> should be
              changed to true
            </li>
            <li>
              Open the app in a <b>new tab</b> and repeat <b>steps 1 & 2</b>
            </li>
            <li>Return to 1st tab, now you'll see peers in the peer list,</li>
            <li>
              Click on <b>allowAllLobbyPeersToJoinRoom</b> to accept peers into
              the room.
            </li>
          </ol>
        </div>

        <div>
          <div className="card">
            <button onClick={requestAccount}>Connect Wallet</button>
            <h3>Wallet Address: {walletAddress}</h3>
            <button onClick={handleJoin}>Join Room</button>
            <button onClick={() => enableStream()}>Enable Stream</button>
            <button onClick={() => pauseTracks()}>Disable Stream</button>
            <button onClick={() => huddleClient.enableWebcam()}>
              Enable Webcam
            </button>
            <button onClick={() => huddleClient.disableWebcam()}>
              Disable Webcam
            </button>
            <button onClick={() => huddleClient.allowAllLobbyPeersToJoinRoom()}>
              allowAllLobbyPeersToJoinRoom()
            </button>
          </div>
          {!isCamPaused && (
            <video
              style={{ width: "50%" }}
              ref={videoRef}
              autoPlay
              muted
            ></video>
          )}

          {lobbyPeers[0] && <h2>Lobby Peers</h2>}
          <div>
            {lobbyPeers.map((peer) => (
              <div>{peer.peerId}</div>
            ))}
          </div>

          {Object.values(peers)[0] && <h2>Peers</h2>}

          <div className="peers-grid">
            {Object.values(peers).map((peer) => (
              <PeerVideoAudioElem peerIdAtIndex={peer.peerId} />
            ))}
          </div>
        </div>
      </div>
    </HuddleClientProvider>
  );
}

export default App;
