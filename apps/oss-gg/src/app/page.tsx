import Image from "next/image";

export default function Page(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 bg-gradient-to-r from-slate-800 to-cyan-900">
      <div className="relative flex place-items-center ">
        <div className="font-sans w-auto pb-16 pt-[48px] md:pb-24 lg:pb-32 md:pt-16 lg:pt-20 flex justify-between gap-8 items-center flex-col relative z-0">
          <div className="z-50 flex items-center justify-center w-full">
            <div className="w-full z-50">
              <Image
                alt=""
                height={630}
                priority
                src="placeholder.svg"
                width={1296}
              />
            </div>
          </div>
        </div>
      </div>
      <span className="inline-flex items-center rounded-md bg-cyan-600/10 px-2 py-1 text-lg font-medium text-cyan-400 ring-1 ring-inset ring-indigo-400/30">
        coming soon
      </span>
    </main>
  );
}
