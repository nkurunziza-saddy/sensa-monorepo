"use client";

import * as React from "react";
import { Box, Container, VStack, HStack, Text, Heading, Spinner, Center } from "@chakra-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Video, VideoOff, Wifi, WifiOff, ArrowRight } from "lucide-react";
import {
  SmoothButton,
  ScrambleText,
} from "@sensa-monorepo/ui";
import { createGestureDetector } from "@sensa-monorepo/communication";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const MotionBox = motion(Box);

export default function BridgePage() {
  const [isActive, setIsActive] = React.useState(false);
  const [detectedGesture, setDetectedGesture] = React.useState<{
    gesture: string;
    phrase: string;
    confidence: number;
  } | null>(null);
  const [conversationId, setConversationId] = React.useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const detectorRef = React.useRef<any>(null);

  const createConversation = useMutation(trpc.communication.createConversation.mutationOptions());
  const addMessage = useMutation(trpc.communication.addMessage.mutationOptions());

  // Initialize conversation on mount
  React.useEffect(() => {
    const init = async () => {
      try {
        const conv = await createConversation.mutateAsync({ title: "Bridge Session" });
        if (conv) setConversationId(conv.id);
      } catch (err) {
        console.error("Failed to create conversation:", err);
        toast.error("Bridge connection failed. System in offline mode.");
      }
    };
    init();
  }, []);

  const toggleBridge = async () => {
    if (isActive) {
      detectorRef.current?.stop();
      setIsActive(false);
      setDetectedGesture(null);
      return;
    }

    if (!videoRef.current || !canvasRef.current) return;

    try {
      const detector = createGestureDetector({
        videoElement: videoRef.current,
        canvasElement: canvasRef.current,
      });

      detector.onGesture((gesture, phrase, confidence) => {
        setDetectedGesture({ gesture, phrase, confidence });
      });

      detector.onError((err) => {
        toast.error(`Detector Error: ${err.message}`);
        setIsActive(false);
      });

      await detector.start();
      detectorRef.current = detector;
      setIsActive(true);
      toast.success("Bridge Active: Gesture Modality Engaged");
    } catch (err: any) {
      toast.error(`Failed to start bridge: ${err.message}`);
    }
  };

  const publishIntent = async () => {
    if (!detectedGesture || !conversationId) return;

    try {
      await addMessage.mutateAsync({
        conversationId,
        inputModality: "gesture",
        outputModality: "text",
        content: detectedGesture.phrase,
        confidence: detectedGesture.confidence,
      });
      toast.success(`Published: "${detectedGesture.phrase}"`);
      setDetectedGesture(null);
    } catch (err: any) {
      toast.error(`Publish failed: ${err.message}`);
    }
  };

  return (
    <Box bg="canvas" minH="100vh" color="ink" py={{ base: 12, md: 20 }} position="relative" overflow="hidden">
      {/* Subtle background element consistent with landing */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="500px"
        h="500px"
        bg="radial-gradient(circle, rgba(255, 77, 139, 0.03), transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="640px" position="relative" zIndex={1}>
        {/* Header */}
        <VStack align="start" gap={8} mb={12}>
          <HStack gap={3} opacity={0.5}>
            <Text
              fontSize="10px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.2em"
            >
              Multimodal Bridge • Gesture V1
            </Text>
          </HStack>

          <VStack align="start" gap={4} w="full">
            <Heading fontSize={{ base: "2rem", md: "2.8rem" }} fontWeight="500" letterSpacing="-0.04em" lineHeight="1.1">
              <ScrambleText text="Sensa Bridge" />
            </Heading>
            <HStack justify="space-between" w="full" align="flex-end">
              <Text fontSize="15px" color="muted" maxW="400px" lineHeight="1.5">
                Real-time gesture detection bridged to the Sensa communication layer.
              </Text>
              
              <HStack
                gap={2}
                px={3}
                py={1}
                rounded="full"
                bg="surface-soft"
                border="1px solid"
                borderColor="hairline-soft"
              >
                {conversationId ? (
                  <Wifi size={10} color="var(--color-brand-teal)" />
                ) : (
                  <WifiOff size={10} color="var(--color-brand-pink)" />
                )}
                <Text fontSize="9px" fontWeight="800" opacity={0.6} letterSpacing="0.05em">
                  {conversationId ? "LIVE" : "OFFLINE"}
                </Text>
              </HStack>
            </HStack>
          </VStack>

          <SmoothButton
            variant={isActive ? "destructive" : "default"}
            h="12"
            px={8}
            rounded="clay-md"
            onClick={toggleBridge}
          >
            <HStack gap={2}>
              {isActive ? <VideoOff size={18} /> : <Video size={18} />}
              <Text>{isActive ? "Terminate Bridge" : "Initialize Bridge"}</Text>
            </HStack>
          </SmoothButton>
        </VStack>

        {/* Camera Feed Container */}
        <Box
          position="relative"
          w="full"
          aspectRatio={4 / 3}
          bg="ink"
          rounded="clay-lg"
          overflow="hidden"
          border="1px solid"
          borderColor="hairline"
          mb={8}
          shadow="sm"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />

          <AnimatePresence>
            {!isActive && (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                position="absolute"
                inset={0}
                justifyContent="center"
                display="flex"
                alignItems="center"
                bg="rgba(10, 10, 10, 0.4)"
                backdropFilter="blur(12px)"
                color="white/40"
              >
                <VStack gap={3}>
                  <Center w="16" h="16" rounded="full" border="1px solid" borderColor="white/20">
                    <Video size={24} strokeWidth={1.5} />
                  </Center>
                  <Text fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="0.1em">
                    Bridge Ready
                  </Text>
                </VStack>
              </MotionBox>
            )}
          </AnimatePresence>

          {isActive && !detectedGesture && (
            <Box position="absolute" top={4} left={4}>
              <HStack gap={2} bg="rgba(10, 10, 10, 0.4)" backdropFilter="blur(8px)" px={3} py={1.5} rounded="full" border="1px solid" borderColor="white/10">
                <Spinner size="xs" color="brand-pink" borderWidth="2px" />
                <Text fontSize="9px" fontWeight="800" color="white/90" letterSpacing="0.05em">
                  SCANNING GESTURES
                </Text>
              </HStack>
            </Box>
          )}

          <AnimatePresence>
            {detectedGesture && (
              <MotionBox
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                position="absolute"
                bottom={6}
                left={6}
                right={6}
                zIndex={10}
              >
                <Box
                  bg="rgba(255, 255, 255, 0.95)"
                  backdropFilter="blur(20px)"
                  p={6}
                  rounded="clay-md"
                  shadow="2xl"
                  border="1px solid"
                  borderColor="brand-pink/20"
                >
                  <VStack gap={5} align="start">
                    <VStack gap={1} align="start">
                      <Text fontSize="10px" fontWeight="800" color="brand-pink" letterSpacing="0.2em" textTransform="uppercase">
                        Intent Detected
                      </Text>
                      <Heading fontSize="32px" fontWeight="500" letterSpacing="-0.02em">
                        {detectedGesture.phrase}
                      </Heading>
                    </VStack>
                    <SmoothButton
                      w="full"
                      h="12"
                      bg="brand-pink"
                      color="white"
                      rounded="clay-sm"
                      onClick={publishIntent}
                      loading={addMessage.isPending}
                    >
                      <HStack gap={2}>
                        <Text>Publish Intent</Text>
                        <ArrowRight size={16} />
                      </HStack>
                    </SmoothButton>
                  </VStack>
                </Box>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>

        {/* System Status - More Refined */}
        <Box
          p={6}
          bg="surface-soft"
          border="1px solid"
          borderColor="hairline-soft"
          rounded="clay-md"
        >
          <HStack gap={2} mb={4} opacity={0.3}>
            <Terminal size={12} />
            <Text fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing="0.1em">
              System Diagnostics
            </Text>
          </HStack>
          <VStack align="start" gap={3}>
             <HStack w="full" justify="space-between">
                <Text fontSize="11px" fontWeight="600" color="muted">Modality Status</Text>
                <Text fontSize="11px" fontWeight="700">GESTURE_V1 (Active)</Text>
             </HStack>
             <HStack w="full" justify="space-between">
                <Text fontSize="11px" fontWeight="600" color="muted">Encryption</Text>
                <Text fontSize="11px" fontWeight="700">AES-GCM-256</Text>
             </HStack>
             {detectedGesture && (
               <HStack w="full" justify="space-between" pt={1} borderTop="1px solid" borderColor="hairline-soft">
                  <Text fontSize="11px" fontWeight="600" color="brand-pink">Confidence Score</Text>
                  <Text fontSize="11px" fontWeight="800" color="brand-pink">
                    {Math.round(detectedGesture.confidence * 100)}%
                  </Text>
               </HStack>
             )}
          </VStack>
        </Box>

        {/* Minimal Footer */}
        <HStack
          pt={12}
          justify="space-between"
          opacity={0.3}
          fontSize="9px"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          <Text>MIT LICENSE / STABLE</Text>
          <Text>© 2026 SENSA CLAY REFINED</Text>
        </HStack>
      </Container>
    </Box>
  );
}
