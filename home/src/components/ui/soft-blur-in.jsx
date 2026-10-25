import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const DURATION_SECONDS = 0.9;
const MILLISECONDS = 1000;
const EASE = [0.22, 1, 0.36, 1];

export default function SoftBlurIn({
  children,
  className = "",
  delay = 0,
  stagger = 18,
  triggerOnView = false,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;

  return (
    <span ref={ref} className={className} aria-label={children}>
      {Array.from(children).map((char, index) => (
        <motion.span
          key={`${index}-${char}`}
          aria-hidden="true"
          initial={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, filter: "blur(12px)" }
          }
          animate={play ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: DURATION_SECONDS,
                  delay: delay / MILLISECONDS + (index * stagger) / MILLISECONDS,
                  ease: EASE,
                }
          }
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char === " " ? "\u00a0" : char}
        </motion.span>
      ))}
    </span>
  );
}
