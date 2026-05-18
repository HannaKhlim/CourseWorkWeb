const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SPECIALS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

const randomFrom = (str, count = 1) => {
  const arr = [];
  const bytes = new Uint32Array(count);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < count; i++) arr.push(str[bytes[i] % str.length]);
  return arr;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const [j] = randomFrom(Array.from({ length: i + 1 }, (_, k) => k));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const generatePassword = () => {
  const len =
    10 + (new Uint8Array(1), crypto.getRandomValues(new Uint8Array(1))[0] % 5);
  const pool = LOWER + UPPER + DIGITS + SPECIALS;
  const chars = [
    ...randomFrom(LOWER),
    ...randomFrom(UPPER),
    ...randomFrom(DIGITS),
    ...randomFrom(SPECIALS),
    ...randomFrom(pool, len - 4),
  ];
  return shuffle(chars).join("");
};

const ADJECTIVES = [
  "swift",
  "bold",
  "cool",
  "dark",
  "epic",
  "free",
  "grand",
  "iron",
  "keen",
  "lone",
  "neon",
  "prime",
  "sharp",
  "wild",
];
const NOUNS = [
  "wolf",
  "hawk",
  "bear",
  "fox",
  "lion",
  "storm",
  "blade",
  "stone",
  "fire",
  "wind",
  "star",
  "tide",
  "ghost",
  "nova",
];

export const generateNickname = () => {
  const [adj] = randomFrom(ADJECTIVES);
  const [noun] = randomFrom(NOUNS);
  const digits = randomFrom(DIGITS, 3).join("");
  return `${adj}_${noun}_${digits}`;
};
