export type SizeDefinition = `${number}px` | `${number}fr`;

export function isPx(value: string): value is `${number}px` {
  if (!value.endsWith("px")) return false;

  const num = value.slice(0, -2);
  if (num.length === 0) return false;

  const n = Number(num);
  return Number.isFinite(n);
}

export function isFr(value: string): value is `${number}fr` {
  if (!value.endsWith("fr")) return false;

  const num = value.slice(0, -2);
  if (num.length === 0) return false;

  const n = Number(num);
  return Number.isFinite(n);
}
