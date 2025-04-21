import React, { memo, useEffect, useState, useRef } from "react";
import { getImageUrl } from "./parseImage";

const ImageFromUrl = ({
  objectId,
  style,
  className,
  setImgWidth,
  handleSetIsLoading,
  isAchievement = false,
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  const imageUrl = getImageUrl(objectId);

  useEffect(() => {
    if (objectId && objectId.length > 0) {
      setIsLoading(true);
    }
  }, [objectId]);

  const handleImageLoad = () => {
    setIsLoading(false);
    if (handleSetIsLoading) handleSetIsLoading(false);
    if (setImgWidth && imgRef.current) {
      setImgWidth(imgRef.current.naturalWidth);
    }
  };

  const handleImageError = () => {
    setIsLoading(false);
    if (handleSetIsLoading) handleSetIsLoading(false);
  };

  console.log(imageUrl);

  return (
    <div className={className} onClick={onClick}>
      {isLoading && <div>Loading...</div>}
      <img
        ref={imgRef}
        src={imageUrl}
        alt="resource"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: isLoading ? "none" : "block" }}
      />
    </div>
  );
};

export default ImageFromUrl;
