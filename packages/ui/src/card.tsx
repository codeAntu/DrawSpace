"use client";
import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <a
      className="bg-amber-300 text-xl p-4 rounded-lg font-medium "
      href="#"
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2 className="text-lg font-semibold bg-blue-800">
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
}
