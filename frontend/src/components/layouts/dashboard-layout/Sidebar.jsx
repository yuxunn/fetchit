import {
  Box,
  VStack,
  HStack,
  Icon,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiList,
  FiCalendar,
  FiUsers,
  FiHeart,
  FiFileText,
  FiArchive,
  FiUpload,
} from "react-icons/fi";

const navItems = [
  { label: "Home", path: "/", icon: FiHome },
  { label: "Dog Directory", path: "/dog-directory", icon: FiGrid },
  { label: "Dog Details", path: "/dog-details", icon: FiList },
  { label: "Events", path: "/events", icon: FiCalendar },
  { label: "Users", path: "/users", icon: FiUsers },
  { label: "Sponsorships", path: "/sponsorships", icon: FiHeart },
  { label: "Vet Bills", path: "/vet-bills", icon: FiFileText },
  { label: "Archived Dogs", path: "/archived-dogs", icon: FiArchive },
  { label: "Upload Files", path: "/upload-files", icon: FiUpload },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <Box w={{ base: "60", md: "60" }} borderRightWidth="1px" bg="bg.subtle">
      <HStack
        mb={8}
        spacing={2}
        alignItems="center"
        h="12"
        px="2"
        borderBottomWidth="1px"
        borderColor="border"
      >
        <Box fontSize="2xl">🐶</Box>
        <Text>FetchIt</Text>
      </HStack>
      <VStack as="nav" alignItems="stretch" spacing={0} flex="1" p={2}>
        {navItems.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;
          return (
            <ChakraLink
              as={Link}
              to={path}
              key={path}
              display="flex"
              alignItems="center"
              gap={2}
              bg={isActive ? "bg.emphasized" : "transparent"}
              _hover={isActive ? undefined : { bg: "bg.muted" }}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon as={icon} />
              {label}
            </ChakraLink>
          );
        })}
      </VStack>
    </Box>
  );
}
