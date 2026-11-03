import "./style.css";

export default function Loader({ text = "A carregar…" }: { text?: string }) {
  return <div className="loader" role="status"><span className="loader__dot" />{text}</div>;
}
