import { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import "./style.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  to?: string;
  children: ReactNode;
};

export default function Button({ variant = "primary", size = "md", to, children, className = "", ...rest }: Props) {
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim();
  return to ? <Link to={to} className={cls}>{children}</Link> : <button className={cls} {...rest}>{children}</button>;
}
