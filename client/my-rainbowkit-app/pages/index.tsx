import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState,useEffect } from "react";
import { usePublicClient, useWalletClient} from 'wagmi'

const Home: NextPage = () => {
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [addr3, setAddr3] = useState("");
  const [approval, setApproval] = useState("");
  console.log(approval);

  const defaultSnapOrigin = `local:http://localhost:8080`;
  const [formData, setFormData] = useState({});
  // channel private key

  const provider = usePublicClient();
  const { data: signer } = useWalletClient();
  console.log(signer);

  const connectSnap = async (snapId = defaultSnapOrigin, params = {}) => {
    await (window as any).ethereum?.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: params,
      },
    });
  };

  const callSnap = async () => {
    await (window as any).ethereum?.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: defaultSnapOrigin,
        request: {
          method: "split",
        },
      },
    });
  };


  return (
    <div className={styles.container}>
      <Head></Head>

      <nav className="bg-white">
        <div className="max-w-7xl mx-auto mt-4 rounded-lg shadow-lg px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8"
                  src="/client/my-rainbowkit-app/keyring.png"
                  alt="Logo"
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button
                   
                    className="text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => connectSnap()}
                  >
                    Install
                  </button>
                  <button
                   
                    className="text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => callSnap()}
                  >
                    Call Snap
                  </button>
                  <a
                    href="#"
                    className="text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Services
                  </a>
                  <a
                    href="#"
                    className="text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className="flex flex-col items-center justify-center p-6  bg-white bg-opacity-80 rounded-lg shadow-lg">
          <input
            className="w-full px-4 py-3 mb-4 text-black bg-transparent border-b border-black placeholder-gray focus:outline-none"
            type="text"
            placeholder="Guardian Wallet 1"
          />
          <input
            className="w-full px-4 py-3 mb-4 text-black bg-transparent border-b border-black placeholder-gray focus:outline-none"
            type="text"
            placeholder="Guardian Wallet 2"
          />
          <input
            className="w-full px-4 py-3 mb-4 text-black bg-transparent border-b border-black placeholder-gray focus:outline-none"
            type="text"
            placeholder="Guardian Wallet 3"
          />
          <div className="relative group">
            <button className="bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 border border-gray-400 rounded shadow">
              Submit
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by Ruthu
        </a>
      </footer>
    </div>
  );
};

export default Home;
