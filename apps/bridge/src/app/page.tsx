"use client";

import { Box, Container, VStack, HStack, Text, Heading } from "@chakra-ui/react";
import { Terminal, Package } from "lucide-react";
import SmoothButton from "@/components/ui/smoothui/smooth-button";

export default function UltraSimpleBridge() {
  return (
    <Box bg="canvas" minH="100vh" color="ink" py={12}>
      <Container maxW="600px">
        {/* Header */}
        <VStack align="start" gap={6} mb={12}>
          <HStack gap={2} opacity={0.5}>
            <Package size={14} />
            <Text fontWeight="800" fontSize="10px" letterSpacing="0.1em" textTransform="uppercase">
              @sensa/communication
            </Text>
          </HStack>
          
          <Box>
            <Heading fontSize="22px" fontWeight="600" letterSpacing="-0.01em" mb={2}>
              Sensa Bridge
            </Heading>
            <Text fontSize="14px" color="muted" lineHeight="1.5">
              A high-performance bridge for multimodal intent. Distilled into a portable ESM package for gesture, speech, and synthesis logic.
            </Text>
          </Box>

          <HStack gap={3}>
            <SmoothButton h="9" px={4} rounded="clay-md" bg="ink" color="white" fontSize="13px">
              Install
            </SmoothButton>
            <Text fontSize="12px" fontWeight="700" color="muted" cursor="pointer" textTransform="uppercase" letterSpacing="0.05em">
              Documentation
            </Text>
          </HStack>
        </VStack>

        {/* Features List */}
        <VStack align="start" gap={4} py={8} borderY="1px solid" borderColor="hairline-soft" mb={12}>
          <SimpleFeature title="Gesture Detection" desc="Real-time sign recognition via MediaPipe." />
          <SimpleFeature title="Speech-to-Text" desc="High-accuracy voice capture streams." />
          <SimpleFeature title="Text-to-Speech" desc="Unified vocal synthesis interfaces." />
          <SimpleFeature title="External Ready" desc="Zero-bloat ESM with CDN-loaded WASM." />
        </VStack>

        {/* Usage Snippet */}
        <Box p={6} bg="surface-soft/50" border="1px solid" borderColor="hairline-soft" rounded="clay-md">
          <HStack gap={2} mb={4} opacity={0.3}>
            <Terminal size={12} />
            <Text fontSize="9px" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">quick_start.ts</Text>
          </HStack>
          <Box fontFamily="monospace" fontSize="12px" color="ink/80" lineHeight="1.6">
            <Text color="brand-pink">import <Text as="span" color="ink">{"{ createBridge }"}</Text> from <Text as="span" color="brand-teal">'@sensa/bridge'</Text>;</Text>
            <Text mt={3}>const bridge = createBridge({'{'} modality: 'gesture' {'}'});</Text>
            <Text>bridge.on('intent', d =&gt; console.log(d));</Text>
            <Text mt={2} color="brand-pink">await bridge.start();</Text>
          </Box>
        </Box>

        {/* Minimal Footer */}
        <HStack pt={12} justify="space-between" opacity={0.3} fontSize="10px" fontWeight="700" letterSpacing="0.05em">
          <Text>MIT / VERSION 1.2.0</Text>
          <Text>© 2026 SENSA</Text>
        </HStack>
      </Container>
    </Box>
  );
}

function SimpleFeature({ title, desc }: { title: string, desc: string }) {
  return (
    <HStack w="full" justify="space-between" align="baseline">
      <Text fontSize="13px" fontWeight="700" whiteSpace="nowrap">{title}</Text>
      <Box flex={1} borderBottom="1px dotted" borderColor="hairline" mx={4} />
      <Text fontSize="13px" color="muted" textAlign="right">{desc}</Text>
    </HStack>
  );
}
