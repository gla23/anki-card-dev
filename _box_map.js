export const boxOf = (x, y, h = 5, w = 2) =>
  w * h * Math.floor(x / w) + w * y + (x % w) + 1;

export const boxXY = (i, h = 5, w = 2) => ({
  x: ((i - 1) % w) + (Math.ceil(i / (w * h)) - 1) * w,
  y: Math.ceil((((i - 1) % (w * h)) + 1) / w) - 1,
});

export const inAGrouping =
  (grouping) =>
  (x, y, h = 500, w = 2) => {
    const box = boxOf(x, y, h, w);
    return grouping.blocks.some(
      (block) => box >= block.start && box <= block.end
    );
  };
