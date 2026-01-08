import React from 'react';

export interface NairaProps extends React.ComponentPropsWithRef<'svg'> {
  size?: string | number;
  strokeWidth?: string | number;
  color?: string;
}

export const Naira = ({
  size = 24,
  strokeWidth = 2,
  color = 'currentColor',
  ref, // Ref is accessed directly like any other prop
  ...props
}: NairaProps) => {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* The letter N */}
      <path d="M6 3v18" />
      <path d="M6 3l12 18" />
      <path d="M18 3v18" />
      {/* The two horizontal bars characteristic of the Naira sign */}
      <path d="M4 10h16" />
      <path d="M4 14h16" />
    </svg>
  );
};

Naira.displayName = 'Naira';

export default Naira;