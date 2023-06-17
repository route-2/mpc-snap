import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-gradient-radial  before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:dark:opacity-40 before:lg:h-[360px]">
        <div className="relative flex place-items-center justify-center ">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert  -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-500 mt-[20%] rounded-lg   "
            src="/lock.png"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className="flex flex-col items-center justify-center p-6 mt-8 bg-gradient-to-b from-transparent to-black bg-opacity-80 rounded-lg shadow-lg">
          <input
            className="w-full px-4 py-3 mb-4 text-white bg-transparent border-b border-white placeholder-white focus:outline-none"
            type="text"
            placeholder="Input 1"
          />
          <input
            className="w-full px-4 py-3 mb-4 text-white bg-transparent border-b border-white placeholder-white focus:outline-none"
            type="text"
            placeholder="Input 2"
          />
          <input
            className="w-full px-4 py-3 mb-4 text-white bg-transparent border-b border-white placeholder-white focus:outline-none"
            type="text"
            placeholder="Input 3"
          />
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <button className="   relative text-white mt-2 mb-2 px-4 py-3 bg-regal-red rounded-full leading-none flex items-center  inline-flex items-center">
              <span className=" pl-4 pr-4 font-causten ">
                {" "}
                <strong> SUBMIT </strong>{" "}
              </span>{" "}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
