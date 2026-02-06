import { Flex, Box } from "@chakra-ui/react";
import { Navbar } from "./Navbar";
import Sidebar from "./Sidebar";

export { Sidebar, Navbar };

export default function DashboardLayout({ children }) {
  return (
    <Flex height="100vh" overflow="hidden">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column">
        <Navbar />
        <Box flex={1} overflowY="auto">
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
