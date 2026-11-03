import { ReactNode } from "react";
import "./style.css";

interface Props { title: string; text?: string; children?: ReactNode }

export default function EmptyState({ title, text, children }: Props) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
