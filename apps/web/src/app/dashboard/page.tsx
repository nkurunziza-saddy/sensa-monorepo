import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Dashboard from "./dashboard";
import { Box, Container, Heading, Text, VStack, Flex, Center } from "@chakra-ui/react";
import { LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Container maxW="6xl" py="10">
      <VStack gap="8" align="stretch">
        <Flex align="center" gap="4" pb="4" borderBottomWidth="1px">
          <Center w="14" h="14" bg="indigo.600" rounded="2xl" color="white" boxShadow="md">
            <LayoutDashboard size={28} />
          </Center>
          <Box>
            <Heading size="3xl" fontWeight="bold" letterSpacing="tight">
              Welcome back, {session.user.name} 👋
            </Heading>
            <Text color="fg.muted" fontSize="lg">
              {session.user.email}
            </Text>
          </Box>
        </Flex>
        <Dashboard />
      </VStack>
    </Container>
  );
}
