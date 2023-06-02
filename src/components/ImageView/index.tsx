import images from "common/images";
import React, { memo, ImgHTMLAttributes, useState, useCallback } from "react";

const ImageView = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  const [isError, setError] = useState(false);
  const handleError = useCallback(() => {
    setError(true);
  }, []);
  return (
    <img
      alt=""
      {...props}
      src={isError ? images.defaultImage : props.src}
      onError={handleError}
    />
  );
};

export default memo(ImageView);
