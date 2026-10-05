import {
  computeGrid,
  LAYOUTS,
  MIN_SQUARE,
  renderLines,
  TEXT_PADDING,
  type Grid,
} from './letter-grid'

const bounds = (cells: Set<string>) => {
  const points = [...cells].map((cell) => cell.split(',').map(Number))
  return {
    width: Math.max(...points.map(([, c]) => c)) + 1,
    height: Math.max(...points.map(([r]) => r)) + 1,
  }
}

const expectTextInside = (grid: Grid, width: number, height: number) => {
  const size = width / grid.columns
  const visibleRows = Math.floor(height / size + 1e-6)
  const text = bounds(grid.cells)

  expect(grid.left).toBeGreaterThanOrEqual(TEXT_PADDING)
  expect(grid.left + text.width).toBeLessThanOrEqual(grid.columns - TEXT_PADDING)
  expect(grid.top).toBeGreaterThanOrEqual(TEXT_PADDING)
  expect(grid.top + text.height).toBeLessThanOrEqual(visibleRows - TEXT_PADDING)
}

describe('renderLines', () => {
  it('measures a single line of 3-wide glyphs with 1 column gaps', () => {
    const text = renderLines(['THE'])
    expect(text.width).toBe(11)
    expect(text.height).toBe(5)
  })

  it('draws the top bar of T but not its sides', () => {
    const { cells } = renderLines(['THE'])
    expect(cells.has('0,0')).toBe(true)
    expect(cells.has('1,0')).toBe(false)
    expect(cells.has('1,1')).toBe(true)
  })

  it('stacks lines with a 1 row gap and centres shorter lines', () => {
    const text = renderLines(['THE', 'SHOP'])
    expect(text.width).toBe(15)
    expect(text.height).toBe(11)
    expect(text.cells.has('0,0')).toBe(false)
    expect(text.cells.has('0,2')).toBe(true)
  })
})

describe('computeGrid', () => {
  it('uses the single line layout with 48-60px squares on a very wide screen', () => {
    const grid = computeGrid(3840, 1000)
    const size = 3840 / grid.columns

    expect(size).toBeGreaterThanOrEqual(MIN_SQUARE)
    expect(size).toBeLessThanOrEqual(60)
    expect(grid.cells).toEqual(renderLines(LAYOUTS[0]).cells)
    expectTextInside(grid, 3840, 1000)
  })

  it('falls back to two lines when one line does not fit', () => {
    const grid = computeGrid(2800, 800)

    expect(2800 / grid.columns).toBeGreaterThanOrEqual(MIN_SQUARE)
    expect(grid.cells).toEqual(renderLines(LAYOUTS[1]).cells)
    expectTextInside(grid, 2800, 800)
  })

  it('shrinks squares below 48px on a phone so the full text still fits', () => {
    const grid = computeGrid(375, 700)

    expect(375 / grid.columns).toBeLessThan(MIN_SQUARE)
    expect(grid.cells).toEqual(renderLines(LAYOUTS[2]).cells)
    expectTextInside(grid, 375, 700)
  })

  it.each([
    [1920, 1027],
    [1440, 847],
    [1366, 715],
    [768, 1000],
  ])('fits the text and fills the height at %ix%i', (width, height) => {
    const grid = computeGrid(width, height)

    expectTextInside(grid, width, height)
    expect(grid.rows * (width / grid.columns)).toBeGreaterThanOrEqual(height)
  })
})
