"use client";

import * as React from "react";
import { Box, Container, VStack, HStack, Text, Heading, Spinner } from "@chakra-ui/react";
import { Terminal, Package, Video, VideoOff, Wifi, WifiOff } from "lucide-react";
import { SmoothButton } from "@sensa-monorepo/ui";
import { createGestureDetector } from "@sensa-monorepo/communication";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
    <Box bg="canvas" minH="100vh" color="ink" py={12}>
      <Container maxW="600px">
        {/* Header */}
        <VStack align="start" gap={6} mb={12}>
          <HStack gap={2} opacity={0.5}>
            <Package size={14} />
            <Text fontWeight="800" fontSize="10px" letterSpacing="0.1em" textTransform="uppercase">
              @sensa-monorepo/communication
            </Text>
          </HStack>

          <Box>
            <Heading fontSize="22px" fontWeight="600" letterSpacing="-0.01em" mb={2}>
              Sensa Bridge
            </Heading>
            <Text fontSize="14px" color="muted" lineHeight="1.5">
              Multimodal intent publisher. Real-time gesture detection bridged to the Sensa backend.
            </Text>
          </Box>

          <HStack gap={3}>
            <SmoothButton
              h="10"
              px={5}
              rounded="clay-md"
              bg={isActive ? "red.500" : "ink"}
              color="white"
              fontSize="13px"
              onClick={toggleBridge}
            >
              <HStack gap={2}>
                {isActive ? <VideoOff size={16} /> : <Video size={16} />}
                <Text>{isActive ? "Stop Bridge" : "Start Bridge"}</Text>
              </HStack>
            </SmoothButton>

            <HStack
              gap={2}
              px={3}
              py={1}
              rounded="full"
              bg="surface-soft"
              border="1px solid"
              borderColor="hairline"
            >
              {conversationId ? (
                <Wifi size={12} className="text-green-500" />
              ) : (
                <WifiOff size={12} className="text-red-500" />
              )}
              <Text fontSize="10px" fontWeight="800" opacity={0.6}>
                {conversationId ? "CONNECTED" : "OFFLINE"}
              </Text>
            </HStack>
          </HStack>
        </VStack>

        {/* Camera Feed */}
        <Box
          position="relative"
          w="full"
          aspectRatio={4 / 3}
          bg="black"
          rounded="clay-lg"
          overflow="hidden"
          border="1px solid"
          borderColor="hairline-soft"
          mb={8}
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

          {!isActive && (
            <VStack
              position="absolute"
              inset={0}
              justify="center"
              bg="black/40"
              backdropFilter="blur(8px)"
              color="white/60"
            >
              <Video size={48} strokeWidth={1} />
              <Text fontSize="13px" fontWeight="600">
                Camera Inactive
              </Text>
            </VStack>
          )}

          {isActive && !detectedGesture && (
            <Box position="absolute" top={4} left={4}>
              <HStack gap={2} bg="black/40" backdropFilter="blur(4px)" px={3} py={1} rounded="full">
                <Spinner size="xs" color="brand-pink" />
                <Text fontSize="10px" fontWeight="bold" color="white/80">
                  WAITING FOR GESTURE
                </Text>
              </HStack>
            </Box>
          )}

          {detectedGesture && (
            <Box position="absolute" bottom={6} left="50%" transform="translateX(-50%)" w="80%">
              <VStack
                bg="white/95"
                p={4}
                rounded="clay-md"
                shadow="xl"
                gap={4}
                border="1px solid"
                borderColor="brand-pink/20"
              >
                <VStack gap={0}>
                  <Text fontSize="10px" fontWeight="800" color="brand-pink" letterSpacing="widest">
                    INTENT DETECTED
                  </Text>
                  <Heading fontSize="32px" fontWeight="800">
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
                  Publish to Sensa
                </SmoothButton>{" "}
              </VStack>
            </Box>
          )}
        </Box>

        {/* Status / Log */}
        <Box
          p={6}
          bg="surface-soft/50"
          border="1px solid"
          borderColor="hairline-soft"
          rounded="clay-md"
        >
          <HStack gap={2} mb={4} opacity={0.3}>
            <Terminal size={12} />
            <Text fontSize="9px" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
              bridge_status.log
            </Text>
          </HStack>
          <VStack align="start" gap={2} fontFamily="monospace" fontSize="12px" color="ink/80">
            <Text>MODALITY: GESTURE_DETECTION_V1</Text>
            <Text>BACKEND: {conversationId ? `CONNECTED (${conversationId})` : "READY"}</Text>
            <Text>ENCRYPTION: AES-GCM-256</Text>
            {detectedGesture && (
              <Text color="brand-pink" fontWeight="bold">
                LAST_MATCH: {detectedGesture.gesture} (
                {Math.round(detectedGesture.confidence * 100)}%)
              </Text>
            )}
          </VStack>
        </Box>

        {/* Minimal Footer */}
        <HStack
          pt={12}
          justify="space-between"
          opacity={0.3}
          fontSize="10px"
          fontWeight="700"
          letterSpacing="0.05em"
        >
          <Text>MIT / VERSION 1.2.0</Text>
          <Text>© 2026 SENSA</Text>
        </HStack>
      </Container>
    </Box>
  );
}
