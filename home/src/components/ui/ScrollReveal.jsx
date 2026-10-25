import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export default function ScrollReveal({
  as = "div",
  children,
  className,
  delay = 0,
  ...props
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      {...props}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={
        inView || shouldReduceMotion
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : undefined
      }
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
