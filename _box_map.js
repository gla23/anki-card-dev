export const boxOf = (x, y, h = 5, w = 2) =>
  w * h * Math.floor(x / w) + w * y + (x % w) + 1;

export const boxXY = (i, h = 5, w = 2) => ({
  x: ((i - 1) % w) + (Math.ceil(i / (w * h)) - 1) * w,
  y: Math.ceil((((i - 1) % (w * h)) + 1) / w) - 1,
});

export const inAGroup =
  (group) =>
  (x, y, h = 5, w = 2) => {
    const { start, end } = group;
    const block = boxOf(x, y, h, w);
    return block >= start && block <= end;
  };
