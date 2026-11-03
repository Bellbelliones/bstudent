import { daysLeft } from "../../utils/format";
import "./style.css";

export default function DeadlineTag({ date }: { date: string }) {
  const d = daysLeft(date);
  const label = d < 0 ? "Encerrada" : d === 0 ? "Termina hoje" : d === 1 ? "Falta 1 dia" : `Faltam ${d} dias`;
  return <span className={`deadline ${d <= 14 ? "deadline--soon" : ""}`}>{label}</span>;
}
