import { useQuery } from '@tanstack/react-query'
import { Card, VStack, HStack, Heading, Text, Box, Grid } from '@chakra-ui/react'
import supabase from '../../supabaseClient'

const StatsCards = () => {
  const { data: stats = {
    totalActiveDogs: 0,
    shelterOccupancy: 0,
    highPriorityDogs: 0,
    outstandingVetBills: 0,
    sponsoredDogs: 0
  } } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: dogData } = await supabase
        .from('dogs')
        .select('*')

      const { data: billData } = await supabase
        .from('vet_bills')
        .select('amount')

      const { data: sponsoredDogs } = await supabase
        .from('sponsored_dogs')
        .select('dog_id')

      const totalActiveDogs = dogData?.filter(d => d.status !== 'Deceased').length || 0
      const shelterCapacity = 50
      const shelterOccupancy = Math.round((totalActiveDogs / shelterCapacity) * 100)
      const highPriorityDogs = dogData?.filter(d =>
        d.medical_priority === 'High' ||
        d.medical_priority === 'Urgent' ||
        d.status === 'Urgent'
      ).length || 0
      const outstandingVetBills = billData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
      const totalSponsoredDogs = new Set(sponsoredDogs?.map(sd => sd.dog_id) || []).size

      return {
        totalActiveDogs,
        shelterOccupancy,
        highPriorityDogs,
        outstandingVetBills,
        sponsoredDogs: totalSponsoredDogs
      }
    }
  })

  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }} gap={6}>
      <StatCard
        title="Total Active Dogs"
        value={stats.totalActiveDogs}
        icon="🐕"
        colorPalette="blue"
      />
      <StatCard
        title="Shelter Occupancy"
        value={`${stats.shelterOccupancy}%`}
        icon="🏠"
        colorPalette="green"
      />
      <StatCard
        title="High Priority Dogs"
        value={stats.highPriorityDogs}
        icon="⚠️"
        colorPalette="red"
      />
      <StatCard
        title="Outstanding Vet Bills"
        value={`$${stats.outstandingVetBills.toLocaleString()}`}
        icon="🏥"
        colorPalette="orange"
      />
      <StatCard
        title="Sponsored Dogs"
        value={stats.sponsoredDogs}
        icon="💝"
        colorPalette="purple"
      />
    </Grid>
  )
}

const StatCard = ({ title, value, icon, colorPalette, subtext }) => (
  <Card.Root bg="bg.panel" shadow="sm">
    <Card.Body>
      <HStack gap={4}>
        <Box
          w="48px"
          h="48px"
          borderRadius="full"
          bg={`${colorPalette}.50`}
          color={`${colorPalette}.600`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="2xl"
        >
          {icon}
        </Box>
        <Box>
          <Text color="fg.muted" fontSize="sm" fontWeight="medium">
            {title}
          </Text>
          <Heading size="2xl" color="fg.default">
            {value}
          </Heading>
          {subtext && (
            <Text color="fg.subtle" fontSize="xs" mt={1}>
              {subtext}
            </Text>
          )}
        </Box>
      </HStack>
    </Card.Body>
  </Card.Root>
)

export default StatsCards