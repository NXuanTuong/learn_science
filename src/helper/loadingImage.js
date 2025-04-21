export const loadWidthImage = (url, callBack) => {
  const img = new Image();
  img.src = url;
  img.onload = () => callBack(null, img);
  img.onerror = (err) => callBack(err, null);
};
