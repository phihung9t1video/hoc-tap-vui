import { useEffect, useState } from "react";

/** Nhân vật đứng yên một lúc thì thỉnh thoảng vẫy tay hoặc vươn vai */
export function useIdlePose(moving: boolean): "wave" | "stretch" | null {
  const [pose, setPose] = useState<"wave" | "stretch" | null>(null);
  useEffect(() => {
    if (moving) {
      setPose(null);
      return;
    }
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t1 = setTimeout(() => {
        setPose(Math.random() < 0.5 ? "wave" : "stretch");
        t2 = setTimeout(() => {
          setPose(null);
          schedule();
        }, 2400);
      }, 4000 + Math.random() * 5000);
    };
    schedule();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [moving]);
  return pose;
}
