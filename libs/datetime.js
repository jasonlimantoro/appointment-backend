const pad = n => (n < 10 ? `0${n}` : n);

export const humanFormat = obj => {
  const y = obj.getFullYear();
  const mon = pad(obj.getMonth());
  const d = pad(obj.getDate());
  const h = pad(obj.getHours());
  const min = pad(obj.getMinutes());
  const s = pad(obj.getSeconds());
  return `${y}-${mon}-${d} ${h}:${min}:${s}`;
};
