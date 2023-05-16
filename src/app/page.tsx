"use client";

import Image from 'next/image'
import { useEffect, useState } from 'react';
import moment from "moment";
import { useRouter, usePathname } from 'next/navigation';


const placeholderSrc = "https://fakeimg.pl/144x144/ebebeb/909090?text=QR+CODE";

export default function Home() {
  const [QRCode, setQRCode] = useState(placeholderSrc);
  const [lastUpdateTime, setLastUpdateTime] = useState<any>(null);
  const [staff, setStaff] = useState({ name: "", no: "" })
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  //StaffNo Change, generate QR Code according to the staffNo, Scan then entry in
  const initQRCode = async (staffNo: string, staffName: string) => {
    try {
      if (!(staffNo && staffName)) return;

      setIsLoading(true);

      const hostname = window?.location.origin;
      const result = await fetch(`${hostname}/api/qrcode?staffNo=${staffNo}&staffName=${staffName}`);

      if (!result.ok) return null;

      const data = await result.json();
      console.log("result ", data.qrCode);
      setQRCode(data.qrCode);
    } finally {
      setTimeout(() => setIsLoading(false), 700);
    }
  }

  const getStaffNo = async (staffNo: string) => {
    if (!staffNo) return;
    let data = null;

    try {
      setIsLoading(true);
      const hostname = window?.location.origin;
      const result = await fetch(`${hostname}/api/staff?staffNo=${staffNo}`);

      if (!result.ok) return null;
      data = await result.json();
      console.log("result ", data);

      if (data.staff) setStaff({ ...staff, name: data.staff.name });
      else setQRCode(placeholderSrc);

    } finally {
      if (!data.staff) setTimeout(() => setIsLoading(false), 700);
    }
  }

  useEffect(() => {
    setQRCode(placeholderSrc);

    // Clear previous timeout if exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout for 1 second
    const newTimeoutId = setTimeout(() => {
      // Make the request here using the latest input value
      getStaffNo(staff.no);
    }, 300);

    // Store the new timeout ID
    setTimeoutId(newTimeoutId);

  }, [staff.no]);

  useEffect(() => {
    initQRCode(staff.no, staff.name);
  }, [staff.name]);

  useEffect(() => {
    setLastUpdateTime(new Date());
  }, [QRCode])

  const handleImageError = () => {}

  console.log("QRCode ", QRCode);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/*
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore the Next.js 13 playground.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
      */}

      {/* Clock-in-out session */}
      <div className="my-8 max-w-lg grid lg:grid-cols-1 sm:grid-cols-1 gap-8">
        <div className="grid-cols-1">
          <div className={`bg-white rounded-md flex items-center justify-center p-4 ${isLoading ? 'opacity-50' : ''}`}>
            {QRCode && <img className="w-36 h-36" src={QRCode} alt="QR Code" onError={handleImageError} />}
          </div>
          {lastUpdateTime && <div className="text-xs text-gray-400 mt-1 w-full text-center">last update time: {moment(lastUpdateTime).format("YYYY-MM-DD HH:mm")}</div>}
        </div>
        <div className="grid-cols-1">
          <div className='flex h-full items-center grow-0'>
            <div>
              <input
                className="px-2 py-2 rounded-md text-center"
                type="text"
                placeholder="MB0021"
                onChange={(e) => setStaff({ ...staff, no: e.target.value })}
              />
              <div className="text-xs text-gray-400 mt-1 w-full text-center">Staff No</div>
            </div>
          </div>
        </div>
        {isLoading &&
          <div className="grid-cols-1">
            <div className="w-full flex items-center justify-center">
              <svg className="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        }
      </div>
    </main>
  )
}
