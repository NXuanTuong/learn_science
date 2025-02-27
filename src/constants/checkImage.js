var imageTail = [
  ".svg",
  ".apng",
  ".avif",
  ".gif",
  ".jpg",
  ".jpeg",
  ".jfif",
  ".pjpeg",
  ".pjp",
  ".png",
  ".webp",
  ".bmp",
  ".ico",
  ".cur",
  ".tif",
  ".tiff",
];
export const checkImage = (val) => {
  var check = true;
  for (let index = 0; index < imageTail.length; index++) {
    if (
      val &&
      val.includes(imageTail[index]) &&
      !val.slice(0, 2).includes("@@")
    ) {
      check = true;
      break;
    } else {
      check = false;
    }
  }
  return check;
};
