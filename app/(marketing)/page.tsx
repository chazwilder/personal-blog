export default function Home() {
  return (
    <div className="w-full h-full flex flex-col flex-grow flex-1 items-center justify-center gap-4 z-50">
      <div className="flex flex-col items-center justify-center gap-4 max-w-4xl">
        <div className="text-4xl text-white font-bold uppercase tracking-tighter text-center">
          Hello, I'm Chaz...
        </div>
        <div className="text-9xl text-white font-bold uppercase tracking-tighter text-center">
          A Full Stack{" "}
        </div>
        <span className="text-9xl text-main font-bold uppercase tracking-tighter text-center">
          Problem Solver
        </span>
        {/*<BentoGridThirdDemo />*/}
      </div>
    </div>
  );
}
