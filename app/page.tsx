import Ribbons from './Ribbons';
import ClickSpark from './ClickSpark';
import RotatingText from './RotatingText';

export default function Home() {
  return (
    <main className="font-sans">
      <ClickSpark
        sparkColor="#000000"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <div className="ribbons-container">
          <Ribbons
            baseThickness={20}
            colors={["#5227FF","#feecca"]}
            speedMultiplier={0.5}
            maxAge={500}
            enableFade={false}
            enableShaderEffect={false}
          />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
            aria-hidden
          >
            <div className="flex items-center gap-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold">Trade</h1>
            <RotatingText
              texts={['code', 'math', 'music', '<your skill here>']}
              mainClassName="inline-flex px-4 sm:px-5 md:px-6 bg-teal-600 text-black overflow-hidden py-2 sm:py-3 md:py-4 justify-center rounded-lg text-4xl sm:text-5xl md:text-6xl font-semibold w-max"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={1700}
            />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold">.</h1>
            </div>
            <p className="text-gray-600 text-lg max-w-md text-center">
            Description here.
          </p>
          </div>
        </div>
      </ClickSpark>
    </main>
  );
}
