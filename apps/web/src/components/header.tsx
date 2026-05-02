"use client";

import NextLink from "next/link";
import { Flex, Box, Text, HStack } from "@chakra-ui/react";

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
          <Text fontWeight="600" fontSize="18px" letterSpacing="-0.03em" color="primary">
            Sensa
          </Text>
        </NextLink>

        <HStack gap={6} align="center">
          <NextLink href="/landing" style={{ textDecoration: "none" }}>
            <Text
              fontSize="12px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.18em"
              color="muted"
              transition="color 0.2s ease"
            >
              Landing
            </Text>
          </NextLink>
          <NextLink href="/" style={{ textDecoration: "none" }}>
            <Text
              fontSize="12px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.18em"
              color="muted"
              transition="color 0.2s ease"
            >
              App
            </Text>
          </NextLink>
          <Box w="1px" h="4" bg="hairline" />
        </HStack>
      </Flex>
    </Box>
  );
}
