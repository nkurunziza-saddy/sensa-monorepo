"use client";

import NextLink from "next/link";
import {
  Box,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Grid,
  Divider,
  Center,
  Badge,
} from "@chakra-ui/react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Eye,
  Mic,
  Volume2,
  Code2,
  Layers,
  Zap,
  Terminal,
  ChevronRight,
} from "lucide-react";
import {
  ScrambleText,
  SmoothButton,
  getConditionColors,
  type Condition,
} from "@sensa-monorepo/ui";
import dynamic from "next/dynamic";

const Orb = dynamic(() => import("@sensa-monorepo/ui").then((mod) => mod.Orb), {
  ssr: false,
  loading: () => <Box w="40px" h="40px" bg="surface-soft/20" rounded="full" />,
});

const MotionBox = motion(Box);

export default function LandingClientPage() {
  return (
    <Box 
      bg="canvas" 
      minH="calc(100vh - 64px)" 
      display="flex" 
      flexDirection="column"
      position="relative" 
      overflowX="hidden"
      pb={20}
    >
      {/* Subtle background element */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="600px"
        h="600px"
        bg="radial-gradient(circle, rgba(255, 77, 139, 0.04), transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="1100px" pt={{ base: 12, md: 24 }} flex="1">
        <VStack align="start" gap={{ base: 16, md: 32 }} w="full">
          
          {/* Hero Section */}
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            w="full"
          >
            <VStack align="start" gap={8} maxW="800px">
              <HStack gap={3} opacity={0.6}>
                <Badge colorPalette="gray" variant="subtle" px={3} py={0.5} rounded="full" fontSize="9px" fontWeight="800" letterSpacing="0.1em">
                  v1.2.0 STABLE
                </Badge>
                <Text
                  fontSize="10px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.2em"
                  color="muted"
                >
                  Sensa • Multimodal Communication Bridge
                </Text>
              </HStack>

              <VStack align="start" gap={6}>
                <Heading
                  fontSize={{ base: "3.5rem", md: "5.5rem" }}
                  fontWeight="500"
                  letterSpacing="-0.05em"
                  lineHeight="0.9"
                >
                  <ScrambleText text="The bridge between how we speak and how we see." />
                </Heading>
                <Text maxW="600px" fontSize="xl" lineHeight="1.6" color="muted" fontWeight="400">
                  A high-fidelity translation layer connecting Speech, Sign Language, and Text. 
                  Sensa adapts the interface to the person, removing interaction barriers through surgical intent matching.
                </Text>
              </VStack>

              <HStack gap={4} pt={4}>
                <NextLink href="/">
                  <SmoothButton variant="default" h="14" px={10} rounded="clay-md" fontSize="md">
                    Launch Bridge <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                  </SmoothButton>
                </NextLink>
                <NextLink href="/communicate?a=none&b=auditory">
                  <SmoothButton variant="outline" h="14" px={8} color="muted">
                    Preview Experience
                  </SmoothButton>
                </NextLink>
              </HStack>
            </VStack>
          </MotionBox>

          {/* Modality Paths */}
          <VStack align="start" gap={10} w="full">
            <VStack align="start" gap={3}>
                <Text fontSize="10px" fontWeight="800" color="brand-pink" textTransform="uppercase" letterSpacing="0.2em">
                    The Modalities
                </Text>
                <Heading fontSize="32px" fontWeight="500" letterSpacing="-0.02em">
                    Adaptive access paths.
                </Heading>
            </VStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} w="full">
                <ModePreview 
                condition="visual" 
                icon={<Eye size={20} strokeWidth={1.5} />} 
                title="Aural Focus" 
                desc="Voice-forward interaction with clear spoken guidance for those with limited vision." 
                />
                <ModePreview 
                condition="vocal" 
                icon={<Mic size={20} strokeWidth={1.5} />} 
                title="Gesture Bridge" 
                desc="Real-time sign language and hand gesture detection for non-vocal communication." 
                />
                <ModePreview 
                condition="auditory" 
                icon={<Volume2 size={20} strokeWidth={1.5} />} 
                title="Visual Stream" 
                desc="High-legibility text and visual prompts for those with hearing accessibility needs." 
                />
            </Grid>
          </VStack>

          {/* Developer Section / NPM Package */}
          <Box 
            w="full" 
            bg="surface-soft/50" 
            rounded="clay-xl" 
            p={{ base: 8, md: 16 }} 
            border="1px solid" 
            borderColor="hairline-soft"
            position="relative"
            overflow="hidden"
          >
            <Box
                position="absolute"
                bottom="-10%"
                right="-5%"
                w="300px"
                h="300px"
                bg="radial-gradient(circle, rgba(26, 58, 58, 0.03), transparent 70%)"
                pointerEvents="none"
            />

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="start">
                <VStack align="start" gap={8}>
                    <VStack align="start" gap={4}>
                        <HStack gap={3}>
                            <Center w="10" h="10" bg="primary" color="white" rounded="clay-sm">
                                <Terminal size={20} />
                            </Center>
                            <Badge colorPalette="teal" variant="outline" fontSize="10px" px={2}>NPM PACKAGE</Badge>
                        </HStack>
                        <Heading fontSize="36px" fontWeight="500" letterSpacing="-0.03em">
                            Built for developers.
                        </Heading>
                        <Text fontSize="lg" color="muted" lineHeight="1.6">
                            The Sensa communication engine is available as a standalone package. 
                            Integrate gesture detection, STT, and TTS into your own accessibility-first applications.
                        </Text>
                    </VStack>

                    <VStack align="start" gap={4} w="full">
                        <FeatureItem 
                            icon={<Zap size={16} />} 
                            title="Zero-Latency Intent Matching" 
                            desc="Optimized MediaPipe implementation for instant gesture recognition." 
                        />
                        <FeatureItem 
                            icon={<Layers size={16} />} 
                            title="Modality Isolation" 
                            desc="Robust provider patterns ensure clean separation between input channels." 
                        />
                        <FeatureItem 
                            icon={<Code2 size={16} />} 
                            title="TypeScript First" 
                            desc="Fully typed interfaces for all communication providers and results." 
                        />
                    </VStack>

                    <Box w="full" pt={4}>
                        <Text fontSize="11px" fontWeight="800" mb={3} color="muted" letterSpacing="0.1em" textTransform="uppercase">
                            Installation
                        </Text>
                        <Box 
                            bg="ink" 
                            color="white" 
                            p={4} 
                            rounded="clay-md" 
                            fontFamily="monospace" 
                            fontSize="13px"
                            border="1px solid"
                            borderColor="white/10"
                        >
                            <Text color="brand-pink" as="span">$</Text> npm install @sensa-monorepo/communication
                        </Box>
                    </Box>
                </VStack>

                <VStack align="start" gap={6} w="full">
                    <Text fontSize="11px" fontWeight="800" color="muted" letterSpacing="0.1em" textTransform="uppercase">
                        Quick Start Example
                    </Text>
                    <Box 
                        w="full"
                        bg="ink" 
                        color="white/90" 
                        p={6} 
                        rounded="clay-lg" 
                        fontFamily="monospace" 
                        fontSize="12px"
                        lineHeight="1.7"
                        border="1px solid"
                        borderColor="white/10"
                        overflowX="auto"
                    >
                        <pre style={{ margin: 0 }}>
                            <Text as="span" color="brand-lavender">import</Text> {"{ createGestureDetector }"} <Text as="span" color="brand-lavender">from</Text> <Text as="span" color="brand-pink">"@sensa/communication"</Text>;{"\n\n"}
                            <Text as="span" color="muted">{"// Initialize detector"}</Text>{"\n"}
                            <Text as="span" color="brand-lavender">const</Text> detector = <Text as="span" color="brand-teal">createGestureDetector</Text>({"{"}{"\n"}
                            {"  videoElement: video,"}{"\n"}
                            {"  canvasElement: canvas"}{"\n"}
                            {"});"}{"\n\n"}
                            <Text as="span" color="muted">{"// Listen for intents"}</Text>{"\n"}
                            {"detector."}<Text as="span" color="brand-teal">onGesture</Text>((gesture, phrase) {"=> {"}{"\n"}
                            {"  console."}<Text as="span" color="brand-teal">log</Text>(<Text as="span" color="brand-pink">`Detected: ${phrase}`</Text>);{"\n"}
                            {"});"}{"\n\n"}
                            <Text as="span" color="brand-lavender">await</Text> detector.<Text as="span" color="brand-teal">start</Text>();
                        </pre>
                    </Box>
                    <Text fontSize="xs" color="muted">
                        * Peer dependencies: @mediapipe/hands, @mediapipe/camera_utils.
                    </Text>
                </VStack>
            </Grid>
          </Box>

          {/* Core Values */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={12} w="full" py={12}>
             <ValueItem 
                title="Single Modality Focus"
                desc="Every interaction is isolated and perfected before being bridged, ensuring high-fidelity understanding."
             />
             <ValueItem 
                title="Clay Refined Design"
                desc="A minimal, organic design system built to reduce cognitive load and provide a calm experience."
             />
             <ValueItem 
                title="Surgical Integrity"
                desc="Technical precision in every landmark and phoneme. We don't guess intent, we calculate it."
             />
          </Grid>

        </VStack>
      </Container>

      {/* Footer */}
      <Box py={12} mt={12} borderTop="1px solid" borderColor="hairline-soft">
        <Container maxW="1100px">
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={8}>
            <VStack align="start" gap={1}>
                <Heading fontSize="20px" fontWeight="600" letterSpacing="-0.02em">Sensa</Heading>
                <Text fontSize="12px" color="muted">A calm bridge for modern accessibility.</Text>
            </VStack>
            
            <HStack gap={10} opacity={0.6} fontSize="11px" fontWeight="700" letterSpacing="0.1em">
                <Text _hover={{ color: "primary", cursor: "pointer" }}>DOCUMENTATION</Text>
                <Text _hover={{ color: "primary", cursor: "pointer" }}>GITHUB</Text>
                <Text _hover={{ color: "primary", cursor: "pointer" }}>NPM</Text>
                <Text>© 2026 SENSA CLAY REFINED</Text>
            </HStack>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}

function ModePreview({ 
  condition, 
  icon, 
  title, 
  desc 
}: { 
  condition: Condition; 
  icon: React.ReactNode; 
  title: string; 
  desc: string;
}) {
  return (
    <Box
      p={8}
      bg="canvas"
      border="1px solid"
      borderColor="hairline-soft"
      rounded="clay-lg"
      display="flex"
      flexDirection="column"
      gap={6}
      transition="all 0.3s ease"
      _hover={{ borderColor: "primary", shadow: "sm" }}
    >
      <HStack gap={4} justify="space-between">
        <Box
          p={3}
          rounded="clay-sm"
          bg="surface-soft"
          color="primary"
          border="1px solid"
          borderColor="hairline-soft"
        >
          {icon}
        </Box>
        <Box w="40px" h="40px">
          <Orb agentState={null} colors={getConditionColors(condition)} />
        </Box>
      </HStack>
      <VStack align="start" gap={2}>
        <Heading fontSize="18px" fontWeight="600">
          {title}
        </Heading>
        <Text color="muted" fontSize="sm" lineHeight="1.5">
          {desc}
        </Text>
      </VStack>
    </Box>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <HStack gap={4} align="start">
            <Center w="8" h="8" rounded="full" bg="white" color="brand-pink" border="1px solid" borderColor="hairline-soft" flexShrink={0}>
                {icon}
            </Center>
            <VStack align="start" gap={0}>
                <Text fontSize="14px" fontWeight="700">{title}</Text>
                <Text fontSize="13px" color="muted">{desc}</Text>
            </VStack>
        </HStack>
    );
}

function ValueItem({ title, desc }: { title: string; desc: string }) {
    return (
        <VStack align="start" gap={4}>
            <Heading fontSize="14px" fontWeight="800" textTransform="uppercase" letterSpacing="0.1em" color="primary">
                {title}
            </Heading>
            <Divider w="40px" borderColor="brand-pink" borderBottomWidth="2px" />
            <Text fontSize="14px" color="muted" lineHeight="1.6">
                {desc}
            </Text>
        </VStack>
    );
}
