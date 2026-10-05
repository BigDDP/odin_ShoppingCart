import { useEffect, useRef, useState } from "react";

import { computeGrid, type Grid } from "@/lib/letter-grid";

const TEXT_COLOUR = "hsl(222 47% 11%)";

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomColour = () =>
  `hsl(${randomBetween(0, 359)} ${randomBetween(55, 80)}% ${randomBetween(50, 65)}%)`;

const useGrid = () => {
  const ref = useRef<HTMLElement>(null);
  const [grid, setGrid] = useState<Grid | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setGrid(computeGrid(width, height));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, grid };
};

const ColourSquare = ({ initialColour }: { initialColour?: string }) => {
  const [colour, setColour] = useState(() => initialColour ?? randomColour());

  return (
    <div
      className="aspect-square transition-colors duration-2000"
      style={{ backgroundColor: colour }}
      onMouseEnter={() => setColour(randomColour())}
    />
  );
};

const Home = () => {
  const { ref, grid } = useGrid();

  return (
    <section
      ref={ref}
      className="grid h-full w-full content-start overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${grid?.columns ?? 0}, minmax(0, 1fr))`,
      }}
    >
      {grid &&
        Array.from({ length: grid.columns * grid.rows }, (_, i) => {
          const row = Math.floor(i / grid.columns) - grid.top;
          const column = (i % grid.columns) - grid.left;
          const isText = grid.cells.has(`${row},${column}`);

          return (
            <ColourSquare
              key={`${grid.columns}-${i}`}
              initialColour={isText ? TEXT_COLOUR : undefined}
            />
          );
        })}
    </section>
  );
};

export default Home;
