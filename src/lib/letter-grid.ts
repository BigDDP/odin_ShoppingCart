export const MIN_SQUARE = 48;
export const TEXT_PADDING = 1;

const FONT: Record<string, string[]> = {
  T: ["###", ".#.", ".#.", ".#.", ".#."],
  H: ["#.#", "#.#", "###", "#.#", "#.#"],
  E: ["###", "#..", "###", "#..", "###"],
  S: ["###", "#..", "###", "..#", "###"],
  A: ["###", "#.#", "###", "#.#", "#.#"],
  I: ["###", ".#.", ".#.", ".#.", "###"],
  O: ["###", "#.#", "#.#", "#.#", "###"],
  N: ["##.", "#.#", "#.#", "#.#", "#.#"],
  R: ["##.", "#.#", "##.", "#.#", "#.#"],
  Y: ["#.#", "#.#", ".#.", ".#.", ".#."],
  P: ["###", "#.#", "###", "#..", "#.."],
  " ": ["..", "..", "..", "..", ".."],
};
const GLYPH_HEIGHT = 5;

export const LAYOUTS = [
  ["THE STATIONARY SHOP"],
  ["THE STATIONARY", "SHOP"],
  ["THE", "STATIONARY", "SHOP"],
];

export type Text = { width: number; height: number; cells: Set<string> };

const lineWidth = (line: string) =>
  [...line].reduce((width, char) => width + FONT[char][0].length + 1, -1);

export const renderLines = (lines: string[]): Text => {
  const widths = lines.map(lineWidth);
  const width = Math.max(...widths);
  const cells = new Set<string>();

  lines.forEach((line, lineIndex) => {
    const top = lineIndex * (GLYPH_HEIGHT + 1);
    let left = Math.floor((width - widths[lineIndex]) / 2);

    for (const char of line) {
      FONT[char].forEach((row, r) =>
        [...row].forEach((pixel, c) => {
          if (pixel === "#") cells.add(`${top + r},${left + c}`);
        }),
      );
      left += FONT[char][0].length + 1;
    }
  });

  return { width, height: lines.length * (GLYPH_HEIGHT + 1) - 1, cells };
};

const TEXTS = LAYOUTS.map(renderLines);

export type Grid = {
  columns: number;
  rows: number;
  top: number;
  left: number;
  cells: Set<string>;
};

const fullRows = (height: number, size: number) =>
  Math.floor(height / size + 1e-6);

export const computeGrid = (width: number, height: number): Grid => {
  const preferredColumns = Math.max(1, Math.floor(width / MIN_SQUARE));
  const preferredSize = width / preferredColumns;

  const fitting = TEXTS.find(
    (text) =>
      preferredColumns >= text.width + 2 * TEXT_PADDING &&
      fullRows(height, preferredSize) >= text.height + 2 * TEXT_PADDING,
  );

  const { text, columns } = fitting
    ? { text: fitting, columns: preferredColumns }
    : TEXTS.map((text) => {
        const size = Math.min(
          width / (text.width + 2 * TEXT_PADDING),
          height / (text.height + 2 * TEXT_PADDING),
        );
        return { text, size, columns: Math.ceil(width / size - 1e-6) };
      }).reduce((best, option) => (option.size > best.size ? option : best));

  const size = width / columns;

  return {
    columns,
    rows: Math.ceil(height / size),
    top: Math.floor((fullRows(height, size) - text.height) / 2),
    left: Math.floor((columns - text.width) / 2),
    cells: text.cells,
  };
};
