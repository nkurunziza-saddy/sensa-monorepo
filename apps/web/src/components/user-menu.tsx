"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu"; // I need to create this Chakra v3 snippet-like component
import { authClient } from "@/lib/auth-client";
import { Button, Skeleton, Text } from "@chakra-ui/react";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton h="9" w="24" rounded="md" />;
  }

  if (!session) {
    return (
      <NextLink href="/login">
        <Button variant="outline">Sign In</Button>
      </NextLink>
    );
  }

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline" rounded="md">
          {session.user.name}
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="email" disabled>
          <Text fontSize="sm" color="fg.muted">
            {session.user.email}
          </Text>
        </MenuItem>
        <MenuItem
          value="sign-out"
          color="red.600"
          _hover={{ bg: "red.50" }}
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/");
                },
              },
            });
          }}
        >
          Sign Out
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
