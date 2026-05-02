"use client";

import { useState, useEffect } from "react";
import { Box, Container, VStack, HStack, Grid, Heading, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { Orb } from "@/components/ui/orb";
import type { AgentState } from "@/components/ui/orb";
import { ScrambleText } from "@/components/ui/scramble-text";
import SmoothButton from "@/components/ui/smoothui/smooth-button";
import { Eye, Mic, Volume2, ArrowRight, User } from "lucide-react";
import { useRouter } from "next/navigation";

type Condition = "visual" | "vocal" | "auditory" | "none";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [personA, setPersonA] = useState<Condition | null>(null);
  const [personB, setPersonB] = useState<Condition | null>(null);
  const [agentState, setAgentState] = useState<AgentState>(null);

  useEffect(() => {
    if (personA && step === 2) {
      setAgentState("listening");
      const timer = setTimeout(() => setAgentState("thinking"), 1000);
      return () => clearTimeout(timer);
    }
    setAgentState(null);
  }, [personA, step]);

  const handleStart = () => {
    if (personA && personB) {
      router.push(`/communicate?a=${personA}&b=${personB}`);
    }
  };

  const conditions = [
    {
      id: "visual",
      icon: <Eye strokeWidth={1.5} />,
      title: "Not Seeing",
      desc: "Audio & Voice focus",
    },
    {
      id: "vocal",
      icon: <Mic strokeWidth={1.5} />,
      title: "Not Speaking",
      desc: "Gesture & Text focus",
    },
    {
      id: "auditory",
      icon: <Volume2 strokeWidth={1.5} />,
      title: "Not Hearing",
      desc: "Visual & Haptic focus",
    },
    {
      id: "none",
      icon: <User strokeWidth={1.5} />,
      title: "Standard",
      desc: "Full multimodal access",
    },
  ];

  return (
    <Box
      bg="canvas"
      minH="calc(100vh - 64px)"
      display="flex"
      alignItems="center"
      position="relative"
      overflow="hidden"
    >
      <Container maxW="1000px" py={12} zIndex={1}>
        <AnimatePresence mode="wait">
          <MotionVStack
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            gap={12}
            align="start"
            w="full"
          >
            <VStack gap={6} align="start" w="full">
              <HStack w="full" justify="space-between" align="start">
                <VStack gap={4} align="start">
                  <HStack gap={3} opacity={0.5}>
                    <Text
                      fontSize="10px"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.2em"
                    >
                      Bridge Setup • {step}/2
                    </Text>
                  </HStack>
                  <Heading
                    fontSize={{ base: "2.5rem", md: "3.5rem" }}
                    fontWeight="500"
                    letterSpacing="-0.04em"
                    lineHeight="1"
                  >
                    {step === 1 ? (
                      <ScrambleText text="Define Person A" />
                    ) : (
                      <ScrambleText text="Define Person B" />
                    )}
                  </Heading>
                  <Text fontSize="md" color="muted" maxW="440px">
                    {step === 1
                      ? "Select the primary interaction needs for the first participant."
                      : "Configure the profile for their communication partner."}
                  </Text>
                </VStack>

                {/* SMALLER ORB PREVIEW */}
                <Box w="140px" h="140px" opacity={step === 2 ? 1 : 0.4} transition="opacity 0.5s">
                  <Orb
                    agentState={agentState}
                    colors={getConditionColors(step === 1 ? personA || "none" : personB || "none")}
                  />
                </Box>
              </HStack>
            </VStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3} w="full">
              {conditions.map((c) => (
                <ConditionCard
                  key={c.id}
                  active={(step === 1 ? personA : personB) === c.id}
                  icon={c.icon}
                  title={c.title}
                  description={c.desc}
                  onClick={() => {
                    if (step === 1) {
                      setPersonA(c.id as Condition);
                      setTimeout(() => setStep(2), 400);
                    } else {
                      setPersonB(c.id as Condition);
                    }
                  }}
                />
              ))}
            </Grid>

            <HStack w="full" justify="space-between" pt={4}>
              {step === 2 ? (
                <>
                  <SmoothButton
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="text-muted text-xs uppercase tracking-widest"
                  >
                    Back to Person A
                  </SmoothButton>
                  <SmoothButton
                    variant="default"
                    h="12"
                    px={8}
                    rounded="clay-md"
                    onClick={handleStart}
                    disabled={!personB}
                  >
                    Start Bridge <ArrowRight size={16} style={{ marginLeft: "8px" }} />
                  </SmoothButton>
                </>
              ) : (
                <Box h="12" />
              )}
            </HStack>
          </MotionVStack>
        </AnimatePresence>
      </Container>
    </Box>
  );
}

function ConditionCard({
  icon,
  title,
  description,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <MotionBox
      as="button"
      onClick={onClick}
      textAlign="left"
      p={6}
      bg={active ? "surface-soft" : "canvas"}
      border="1px solid"
      borderColor={active ? "primary" : "hairline-soft"}
      rounded="clay-md"
      transition={{ duration: 0.3 }}
      whileHover={{ borderColor: "primary" }}
      display="flex"
      alignItems="center"
      gap={5}
      role="group"
    >
      <Box
        p={3}
        rounded="clay-sm"
        bg={active ? "primary" : "surface-soft"}
        color={active ? "white" : "primary"}
        transition="all 0.3s ease"
      >
        {icon}
      </Box>
      <VStack align="start" gap={0}>
        <Heading fontSize="16px" fontWeight="600">
          {title}
        </Heading>
        <Text color="muted" fontSize="xs" opacity={0.7}>
          {description}
        </Text>
      </VStack>

      {active && <Box ml="auto" w={1.5} h={1.5} rounded="full" bg="brand-pink" />}
    </MotionBox>
  );
}

function getConditionColors(condition: Condition): [string, string] {
  switch (condition) {
    case "visual":
      return ["#ff4d8b", "#ffb084"];
    case "vocal":
      return ["#1a3a3a", "#a4d4c5"];
    case "auditory":
      return ["#b8a4ed", "#e8b94a"];
    default:
      return ["#0a0a0a", "#6a6a6a"];
  }
}
