import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Grid,
  Card,
  Input,
  Select,
  Flex,
} from '@chakra-ui/react'
import StatsCards from './StatsCards'
import MonthlyOccupancyChart from './MonthlyOccupancyChart'
import HealthOverviewChart from './HealthOverviewChart'
import MonthlyVetCostsChart from './MonthlyVetCostsChart'
import SponsorshipCoverage from './SponsorshipCoverage'
import ArchivedDogsTable from './ArchivedDogsTable'

const Dashboard = () => {

  return (
    <Box maxW="1400px" mx="auto" px={8} py={8} bg="bg" minH="100vh">
      <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="3xl" color="fg.default">
            Shelter Overview
          </Heading>
          <Text color="fg.muted">Welcome back, Admin.</Text>
        </Box>

        {/* Stats Cards */}
        <StatsCards />

        {/* Bar Charts Row */}
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={6}>
          <MonthlyOccupancyChart />
          <HealthOverviewChart />
          <MonthlyVetCostsChart />
        </Grid>        {/* Sponsorship Coverage and Archived Dogs */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
          <SponsorshipCoverage />
          <ArchivedDogsTable />
        </Grid>
      </VStack>
    </Box>
  )
}

export default Dashboard