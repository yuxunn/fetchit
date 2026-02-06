import { useQuery } from '@tanstack/react-query'
import { Card, VStack, Heading, Box, Grid, Table, HStack, Text } from '@chakra-ui/react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import supabase from '../../supabaseClient'

const SponsorshipCoverage = () => {
  const { data: sponsorshipData = [] } = useQuery({
    queryKey: ['sponsorship-coverage'],
    queryFn: async () => {
      const { data: dogData } = await supabase
        .from('dogs')
        .select('*')

      const { data: sponsoredDogs } = await supabase
        .from('sponsored_dogs')
        .select('dog_id')

      const totalActiveDogs = dogData?.filter(d => d.status !== 'Deceased').length || 0
      const totalSponsoredDogs = new Set(sponsoredDogs?.map(sd => sd.dog_id) || []).size

      const fullySponsored = Math.min(totalActiveDogs, totalSponsoredDogs)
      const partiallySponsored = Math.max(0, totalSponsoredDogs - fullySponsored)
      const unsponsored = Math.max(0, totalActiveDogs - totalSponsoredDogs)

      return [
        { name: 'Fully Sponsored', value: fullySponsored, color: '#10B981' },
        { name: 'Partially Sponsored', value: partiallySponsored, color: '#F59E0B' },
        { name: 'Unsponsored', value: unsponsored, color: '#EF4444' }
      ].filter(item => item.value > 0)
    }
  })

  const { data: totalActiveDogs = 0 } = useQuery({
    queryKey: ['total-active-dogs'],
    queryFn: async () => {
      const { data: dogData } = await supabase
        .from('dogs')
        .select('status')
      return dogData?.filter(d => d.status !== 'Deceased').length || 0
    }
  })

  return (
    <Card.Root bg="bg.panel">
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <Heading size="lg" color="fg.default">
            Sponsorship Coverage
          </Heading>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
            {/* Pie Chart */}
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sponsorshipData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {sponsorshipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Sponsorship Table */}
            <Box>
              <Table.Root size="sm" variant="line">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Count</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Percentage</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sponsorshipData.map((item) => {
                    const percentage = totalActiveDogs > 0
                      ? Math.round((item.value / totalActiveDogs) * 100)
                      : 0
                    return (
                      <Table.Row key={item.name}>
                        <Table.Cell>
                          <HStack gap={2}>
                            <Box
                              w="12px"
                              h="12px"
                              borderRadius="full"
                              bg={item.color}
                            />
                            <Text fontSize="sm">{item.name}</Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell textAlign="right" fontWeight="semibold">
                          {item.value}
                        </Table.Cell>
                        <Table.Cell textAlign="right" color="fg.muted">
                          {percentage}%
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          </Grid>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

export default SponsorshipCoverage