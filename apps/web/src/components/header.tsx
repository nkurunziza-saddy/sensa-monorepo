"use client";

import NextLink from "next/link";
import { Flex, Box, Center, Text, HStack } from "@chakra-ui/react";
import { MessageSquare, Settings } from "lucide-react";

export default function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="50"
      w="full"
      bg="canvas"
      borderBottom="1px solid"
      borderColor="hairline-soft"
    >
      <Flex
        maxW="1280px"
        mx="auto"
        h="16"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 8 }}
      >
        <NextLink
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <Center w="8" h="8" bg="brand-pink" rounded="clay-md" color="white">
            <MessageSquare size={16} strokeWidth={2.5} />
          </Center>
          <Text fontWeight="600" fontSize="18px" letterSpacing="-0.03em" color="primary">
            Sensa
          </Text>
        </NextLink>

        <HStack gap={6} align="center">
          <Box w="1px" h="4" bg="hairline" />
        </HStack>      </Flex>
    </Box>
  );
}
