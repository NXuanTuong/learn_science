import { getUrlImage } from "../../config/utilities";
import ConstantStrings from "../../constants/ConstantStrings";
var imageCache = {};

// const parseImage = async (key) => {
//   key[0] = encodeURIComponent(key[0]);
//   if (imageCache[key]) {
//     return imageCache[key];
//   }
//   const { result } = await getUrlImage(key);
//   imageCache[key] = result;
//   return result;
// };
// export default parseImage;
export const getCacheImage = (key) => {
  var url = ConstantStrings.IMAGE_URL + encodeURIComponent(key);
  url = url.replace(/\(/g, "%28").replace(/\)/g, "%29");
  const result = imageCache[url];
  if (result?.length > 0) {
    return result;
  }
};

export const getImageUrl = (key) => {
  if (key !== null && key?.length > 0) {
    var url = ConstantStrings.IMAGE_URL + encodeURIComponent(key);
    url = url.replace(/\(/g, "%28").replace(/\)/g, "%29");
    if (imageCache[url]) {
      return imageCache[url];
    }
    imageCache[url] = url;
    return url;
  }
};

export const cacheImage = (key) => {
  if (imageCache[key]) {
    return imageCache[key];
  }
  imageCache[key] = key;
};
