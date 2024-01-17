import Image from "next/image";

export default function Page(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-r from-slate-800 to-cyan-900 p-12">
      <div className="relative flex place-items-center ">
        <div className="relative z-0 flex w-auto flex-col items-center justify-between gap-8 pb-16 pt-[48px] font-sans md:pb-24 md:pt-16 lg:pb-32 lg:pt-20">
          <div className="z-50 flex w-full items-center justify-center">
            <div className="z-50 w-full">
              <Image alt="" height={630} priority src="placeholder.svg" width={1296} />
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
