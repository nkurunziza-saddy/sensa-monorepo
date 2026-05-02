import { Center, Spinner } from "@chakra-ui/react";

export default function Loader() {
  return (
    <Center h="full" pt="8">
      <Spinner size="xl" color="indigo.500" />
    </Center>
  );
}
