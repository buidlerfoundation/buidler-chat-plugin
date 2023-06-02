import React from "react";

type IconMoreProps = {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
};

const IconMore = ({ width = 30, height = 30, style }: IconMoreProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.0437 13.043C20.9614 13.043 20.0858 13.9186 20.0858 14.9993C20.0858 16.0612 20.9333 16.9267 21.9913 16.9548H22.0961C23.1525 16.9267 24 16.0612 24 14.9993C24 13.9186 23.1236 13.043 22.0437 13.043ZM14.9999 13.043C13.9184 13.043 13.0436 13.9186 13.0436 14.9993C13.0436 16.0612 13.8903 16.9267 14.9475 16.9548H15.0523C16.1095 16.9267 16.9562 16.0612 16.9562 14.9993C16.9562 13.9186 16.0813 13.043 14.9999 13.043ZM7.95633 13.043C6.87565 13.043 6 13.9186 6 14.9993C6 16.0612 6.84748 16.9267 7.9039 16.9548H8.00875C9.06674 16.9267 9.915 16.0612 9.915 14.9993C9.915 13.9186 9.03778 13.043 7.95633 13.043Z"
        fill="#727272"
      />
    </svg>
  );
};

export default IconMore;
