export const formattedDate = (d = new Date()) => {
  d = new Date(d);
  return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
    .map((n) => (n < 10 ? `0${n}` : `${n}`))
    .join("-");
};
