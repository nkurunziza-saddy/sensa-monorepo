"use client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { Container, Box, Heading, Text, Flex, Center, VStack } from "@chakra-ui/react";

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <Container maxW="3xl" px="4" py="8">
      <Box
        as="pre"
        overflowX="auto"
        fontFamily="mono"
        fontSize="xs"
        mb="8"
        color="indigo.600"
        _dark={{ color: "indigo.400" }}
      >
        {TITLE_TEXT}
      </Box>

      <VStack gap="6" align="stretch">
        <Box borderWidth="1px" p="6" rounded="2xl" bg="bg.panel" boxShadow="sm">
          <Heading size="md" mb="4">
            API Status
          </Heading>
          <Flex align="center" gap="3">
            <Box
              h="3"
              w="3"
              rounded="full"
              bg={healthCheck.data ? "green.500" : "red.500"}
              boxShadow={healthCheck.data ? "0 0 8px var(--chakra-colors-green-500)" : "none"}
            />
            <Text fontSize="lg" fontWeight="medium">
              {healthCheck.isLoading
                ? "Checking..."
                : healthCheck.data
                  ? "Connected to Alchemy Backend"
                  : "Disconnected"}
            </Text>
          </Flex>
        </Box>

        <Center
          p="12"
          borderWidth="1px"
          borderStyle="dashed"
          rounded="3xl"
          flexDirection="column"
          gap="4"
        >
          <Heading size="lg" textAlign="center">
            Ready to Communicate?
          </Heading>
          <Text color="fg.muted" textAlign="center">
            Navigate to Talk, Reply, or Gesture using the header above.
          </Text>
        </Center>
      </VStack>
    </Container>
  );
}
