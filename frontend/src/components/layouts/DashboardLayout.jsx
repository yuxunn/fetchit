import { Box, Flex, VStack, HStack, Icon, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiList } from 'react-icons/fi';

const navItems = [
	{ label: 'Home', path: '/', icon: FiHome },
	{ label: 'Browse Pets', path: '/pets', icon: FiList },
	{ label: 'Dashboard', path: '/dashboard', icon: FiGrid },
];

export default function DashboardLayout({ children }) {
	const location = useLocation();
	return (
		<Flex minH="100vh" bg="gray.50">
			<Box w={{ base: '60', md: '60' }} bg="white" borderRightWidth="1px" p={4}>
				<HStack mb={8} spacing={2} alignItems="center">
					<Box bg="indigo.600" color="white" p={2} borderRadius="lg" fontSize="2xl">🐶</Box>
					<Text fontWeight="bold" fontSize="xl" color="gray.800">FetchIt</Text>
				</HStack>
				<VStack align="stretch" spacing={1}>
					{navItems.map(({ label, path, icon }) => (
						<ChakraLink
							as={Link}
							to={path}
							key={path}
							display="flex"
							alignItems="center"
							px={3}
							py={2}
							borderRadius="md"
							fontWeight="medium"
							fontSize="md"
							bg={location.pathname === path ? 'purple.100' : 'transparent'}
							color={location.pathname === path ? 'purple.700' : 'gray.600'}
							_hover={{ bg: 'purple.50', color: 'purple.700', textDecoration: 'none' }}
							gap={2}
						>
							<Icon as={icon} boxSize={5} />
							{label}
						</ChakraLink>
					))}
				</VStack>
			</Box>
			<Box flex={1} p={8}>
				{children}
			</Box>
		</Flex>
	);
}
