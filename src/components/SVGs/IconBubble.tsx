import React from "react";

type IconBubbleProps = {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
};

const IconBubble = ({ width = 70, height = 70, style }: IconBubbleProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M35 70C54.33 70 70 54.33 70 35C70 15.67 54.33 0 35 0C15.67 0 0 15.67 0 35C0 54.33 15.67 70 35 70Z"
        fill="black"
      />
      <path
        d="M23.6803 37.043H46.3257C47.1453 37.043 47.9314 37.3686 48.511 37.9481C49.0905 38.5277 49.4161 39.3138 49.4161 40.1334V50.4489C49.4161 51.2685 49.0905 52.0546 48.511 52.6341C47.9314 53.2137 47.1453 53.5393 46.3257 53.5393H20.5899V40.151C20.5876 39.7437 20.6658 39.3399 20.8201 38.963C20.9743 38.586 21.2016 38.2432 21.4888 37.9544C21.776 37.6655 22.1175 37.4363 22.4936 37.2799C22.8697 37.1235 23.273 37.043 23.6803 37.043Z"
        fill="white"
      />
      <path
        d="M23.6803 18.5273H40.1484C40.5542 18.5273 40.9561 18.6073 41.331 18.7626C41.7059 18.9179 42.0466 19.1455 42.3336 19.4325C42.6206 19.7195 42.8482 20.0602 43.0035 20.4351C43.1588 20.8101 43.2388 21.2119 43.2388 21.6178V27.7915C43.2388 28.1974 43.1588 28.5992 43.0035 28.9742C42.8482 29.3491 42.6206 29.6898 42.3336 29.9768C42.0466 30.2638 41.7059 30.4914 41.331 30.6467C40.9561 30.802 40.5542 30.8819 40.1484 30.8819H20.5898V21.6178C20.5898 21.2119 20.6698 20.8101 20.8251 20.4351C20.9804 20.0602 21.208 19.7195 21.495 19.4325C21.782 19.1455 22.1227 18.9179 22.4976 18.7626C22.8726 18.6073 23.2744 18.5273 23.6803 18.5273Z"
        fill="white"
      />
    </svg>
  );
};

export default IconBubble;