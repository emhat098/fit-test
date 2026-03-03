import { ComponentProps, FC } from "react";

import { cn } from "@/lib/utils";

const Plus: FC<ComponentProps<"svg">> = ({ className }) => {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-gray-dark w-4 h-4", className)}
    >
      <ellipse cx="6" cy="6.31824" rx="6" ry="6.31824" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 5.2651V3.15898H5V5.2651H3V7.37118H5V9.47722H7V7.37118H9V5.2651H7Z"
        fill="white"
      />
    </svg>
  );
};

export default Plus;
