export function sanitize(input: string, condition: RegExp): string {
  return Array.from(input)
    .filter(char => condition.test(char))
    .join("")
    .trim();
}
