export const formattedDate = (d = new Date()) => {
  d = new Date(d);
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()]
    .map((n) => (n < 10 ? `0${n}` : `${n}`))
    .join("-");
};
