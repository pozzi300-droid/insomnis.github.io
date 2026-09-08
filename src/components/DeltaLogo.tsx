import React from 'react';

interface DeltaLogoProps {
  size?: number;
  className?: string;
}

export const DeltaLogo: React.FC<DeltaLogoProps> = ({ size = 28, className = '' }) => {
  const width = size;
  const height = Math.round((size * 27) / 32);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
    >
      <path
        d="M4.17952 26.4325H8.35914L9.53467 24.2121L7.31418 20.6855L4.17952 26.4325Z"
        fill="url(#paint0_radial_delta)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.35914 26.4325L9.53467 24.2121L7.31418 20.6855L4.17952 26.4325H8.35914Z"
        fill="url(#paint1_radial_delta)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.8898 26.3018H19.3306C24.0924 26.0804 29.8871 22.9483 31.5402 16.6667C31.8368 15.5395 32 14.3109 32 12.9795C32 12.8415 31.997 12.7034 31.9912 12.5657C31.8262 8.69503 29.373 4.9249 26.2676 2.67498C24.4606 1.36576 22.4327 0.571259 20.5061 0.571259H0L14.8898 26.3018ZM13.7143 17.0284L18.9388 7.88554H14.7591L11.6245 13.2407L6.13876 4.09784H19.7224C22.7967 4.09784 27.3694 6.8808 28.2082 11.6716C28.296 12.173 28.3429 12.6962 28.3429 13.2407C28.3429 17.9427 24.2938 22.6447 19.7224 22.6447H16.8489L13.7143 17.0284Z"
        fill="url(#paint2_radial_delta)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_delta"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(16 13.5019) scale(16 12.9306)"
        >
          <stop stopColor="#0ABAB5" />
          <stop offset="1" stopColor="#077A76" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_delta"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(16 13.5019) scale(16 12.9306)"
        >
          <stop stopColor="#0ABAB5" />
          <stop offset="1" stopColor="#077A76" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_delta"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(16 13.5019) scale(16 12.9306)"
        >
          <stop stopColor="#0ABAB5" />
          <stop offset="1" stopColor="#077A76" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export const InsomnisLogo = DeltaLogo;
