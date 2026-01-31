import { Flex, Box } from "@chakra-ui/react";
import { Navbar } from "./Navbar";
import Sidebar from "./Sidebar";

export { Sidebar, Navbar };

export default function DashboardLayout({ children }) {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex={1} p={4}>
        <Navbar mb={6} />
        {children}
      </Box>
    </Flex>
  );
}
