"use client";

import { HStack } from "@chakra-ui/react";
import { motion } from "motion/react";

interface LiveWaveformProps {
  active?: boolean;
  processing?: boolean;
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
  height?: number;
  className?: string;
}

export function LiveWaveform({
  active = false,
  processing = false,
  barWidth = 3,
  barGap = 2,
  barRadius = 2,
  height = 24,
  className,
}: LiveWaveformProps) {
  const bars = Array.from({ length: 12 });

  return (
    <HStack gap={`${barGap}px`} height={`${height}px`} alignItems="center" className={className}>
      {bars.map((_, i) => (
        <motion.div
          key={i}
          animate={
            active
              ? {
                  height: [
                    "20%",
                    `${Math.random() * 60 + 40}%`,
                    "30%",
                    `${Math.random() * 50 + 50}%`,
                    "20%",
                  ],
                }
              : processing
                ? {
                    height: ["20%", "40%", "20%"],
                    opacity: [0.3, 1, 0.3],
                  }
                : {
                    height: "10%",
                    opacity: 0.2,
                  }
          }
          transition={
            active
              ? {
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : processing
                ? {
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }
                : { duration: 0.3 }
          }
          style={{
            width: `${barWidth}px`,
            backgroundColor: "currentColor",
            borderRadius: `${barRadius}px`,
          }}
        />
      ))}
    </HStack>
  );
}
