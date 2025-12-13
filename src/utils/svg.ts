
export const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees) * Math.PI) / 180.0;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
};

export const describeArc = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", cx, cy,
    "Z"
  ].join(" ");
};

export const generateColors = (n: number) =>
  Array.from({ length: n }, (_, i) => {
    return `hsl(${(i * 360) / n}, 75%, 60%)`;
  });