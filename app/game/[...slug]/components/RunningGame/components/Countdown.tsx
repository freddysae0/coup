import { useEffect, useState } from "react";
import { Progress } from "@heroui/react";

/** Time left to answer a challenge/block window (auto-pass when it ends). */
export default function Countdown({
  deadline,
  total = 30_000,
}: {
  deadline: number | null;
  total?: number;
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!deadline) return;
    const id = setInterval(() => setNow(Date.now()), 250);

    return () => clearInterval(id);
  }, [deadline]);

  if (!deadline) return null;
  const left = Math.max(0, deadline - now);

  return (
    <Progress
      aria-label="Time left to respond"
      color={left < 8000 ? "danger" : "warning"}
      label={`Auto-pass in ${Math.ceil(left / 1000)}s`}
      size="sm"
      value={(left / total) * 100}
    />
  );
}
