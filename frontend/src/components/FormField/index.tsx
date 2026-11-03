import { ReactNode } from "react";
import "./style.css";

interface Props { label: string; hint?: string; error?: string; children: ReactNode }

export default function FormField({ label, hint, error, children }: Props) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
      {hint && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error" role="alert">{error}</span>}
    </label>
  );
}
