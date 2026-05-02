"use client";

import { useRef, useEffect } from "react";
import { useGestureDetection } from "@/hooks/use-gesture-detection";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { LargeButton } from "@/components/ui/large-button";
import { Camera, CameraOff, AlertCircle, Hand, Volume2 } from "lucide-react";
import { Container, Grid, GridItem, AspectRatio, Box, VStack, Heading, Text, Flex, SimpleGrid, Button, Center } from "@chakra-ui/react";

export default function GesturePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isDetecting, detectedGesture, error, start, stop, simulateGesture, availableGestures } = useGestureDetection(videoRef);
  const { speak, isSpeaking } = useSpeechSynthesis();



  const handleSpeakGesture = () => {
    if (detectedGesture?.phrase) {
      speak(detectedGesture.phrase);
    }
  };

  return (
    <Container maxW="6xl" py="8" h="full">
      <Grid templateColumns={{ base: "1fr", lg: "1fr 350px" }} gap="8" h="full">
        <GridItem>
          <VStack gap="8" align="stretch">
            <VStack gap="4" textAlign="left" align="start">
              <Heading size="4xl" fontWeight="bold" letterSpacing="tight">Gesture Detection</Heading>
              <Text fontSize="xl" color="fg.muted">Show a hand gesture to the camera</Text>
            </VStack>

            {error && (
              <Flex 
                bg="red.100" 
                color="red.700" 
                _dark={{ bg: "red.900/30", color: "red.400" }} 
                p="4" 
                rounded="xl" 
                align="center" 
                gap="3"
              >
                <AlertCircle size={24} />
                <Text fontSize="lg">{error}</Text>
              </Flex>
            )}

            <Box position="relative">
              <AspectRatio ratio={16 / 9}>
                <Box 
                  bg="black" 
                  rounded="3xl" 
                  overflow="hidden" 
                  borderWidth="4px" 
                  borderColor={isDetecting ? "indigo.500" : "gray.700"}
                  boxShadow="2xl"
                >
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay 
                    playsInline 
                    muted
                  />
                  {!isDetecting && !error && (
                    <Flex 
                      position="absolute"
                      inset="0"
                      direction="column" 
                      align="center" 
                      justify="center" 
                      gap="4" 
                      bg="black/80"
                      color="white/50"
                    >
                      <Camera size={64} />
                      <LargeButton onClick={start}>Start Camera</LargeButton>
                    </Flex>
                  )}
                </Box>
              </AspectRatio>

              {isDetecting && detectedGesture && (
                <Box 
                  position="absolute" 
                  bottom="6" 
                  left="6"
                  right="6"
                  bg="bg.panel" 
                  borderWidth="1px"
                  p="6" 
                  rounded="2xl" 
                  boxShadow="2xl" 
                  animation="slide-in-from-bottom-4 0.3s ease-out"
                >
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap="4">
                      <Text fontSize="5xl">{availableGestures.find(g => g.gesture === detectedGesture.gesture)?.icon}</Text>
                      <VStack align="start" gap="0">
                        <Text fontSize="3xl" fontWeight="bold">{detectedGesture.phrase}</Text>
                        <Text fontSize="sm" color="green.500" fontWeight="medium">
                          {(detectedGesture.confidence * 100).toFixed(0)}% Match
                        </Text>
                      </VStack>
                    </Flex>
                    <LargeButton 
                      variant="accent"
                      onClick={handleSpeakGesture}
                      disabled={isSpeaking}
                      gap="2"
                    >
                      <Volume2 size={24} />
                      Speak
                    </LargeButton>
                  </Flex>
                </Box>
              )}
            </Box>

            <Box bg="bg.panel" p="6" rounded="2xl" borderWidth="1px">
              <VStack align="start" gap="4">
                <Heading size="md" display="flex" alignItems="center" gap="2">
                  <Hand size={20} />
                  Manual Override (Mock Gestures)
                </Heading>
                <Flex flexWrap="wrap" gap="3">
                  {availableGestures.map(g => (
                    <Button
                      key={g.gesture}
                      onClick={() => simulateGesture(g.gesture)}
                      variant="subtle"
                      rounded="full"
                      size="sm"
                    >
                      {g.icon} {g.phrase}
                    </Button>
                  ))}
                </Flex>
              </VStack>
            </Box>
          </VStack>
        </GridItem>

        <GridItem>
          <Box bg="bg.panel" p="6" rounded="3xl" borderWidth="1px" boxShadow="lg" h="fit-content">
            <VStack gap="6" align="stretch">
              <Heading size="lg">Gesture Guide</Heading>
              <VStack gap="4" align="stretch">
                {availableGestures.map(g => (
                  <Flex key={g.gesture} align="center" gap="4" p="3" rounded="xl" _hover={{ bg: "bg.muted" }} transition="colors">
                    <Center w="12" h="12" rounded="full" bg="bg.muted" fontSize="2xl" flexShrink="0">
                      {g.icon}
                    </Center>
                    <Box>
                      <Text fontWeight="medium" fontSize="lg">{g.phrase}</Text>
                      <Text fontSize="sm" color="fg.muted" textTransform="capitalize">{g.gesture.replace('_', ' ')}</Text>
                    </Box>
                  </Flex>
                ))}
              </VStack>
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
}
