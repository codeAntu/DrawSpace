"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
}

export const Button = ({ children, className }: ButtonProps) => {
  return (
    <button
      className="text-4xl bg-red-300 "
      onClick={() => alert(`Hello from  app!`)}
    >
      {children}
    </button>
  );
};
