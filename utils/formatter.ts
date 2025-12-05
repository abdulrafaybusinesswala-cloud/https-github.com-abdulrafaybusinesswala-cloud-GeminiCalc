export const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

export const formatOperand = (operand: string | null): string => {
  if (operand == null) return "";
  
  // Handle exponential notation if strictly necessary, but for basic usage:
  const [integer, decimal] = operand.split(".");
  if (decimal == null) {
    return INTEGER_FORMATTER.format(BigInt(integer) as any); // Type cast for older TS libs if needed, usually fine in modern envs
  }
  return `${INTEGER_FORMATTER.format(BigInt(integer) as any)}.${decimal}`;
};