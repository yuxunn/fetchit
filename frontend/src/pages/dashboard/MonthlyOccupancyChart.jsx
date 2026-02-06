import { useQuery } from '@tanstack/react-query'
import { Card, VStack, Heading, Box } from '@chakra-ui/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import supabase from '../../supabaseClient'

const MonthlyOccupancyChart = () => {
  const { data: monthlyOccupancy = [] } = useQuery({
    queryKey: ['monthly-occupancy'],
    queryFn: async () => {
      const { data: dogData } = await supabase
        .from('dogs')
        .select('created_at, status')

      const shelterCapacity = 50
      const monthlyData = []

      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthName = date.toLocaleString('default', { month: 'short' })
        const monthDogs = dogData?.filter(d => {
          const dogDate = new Date(d.created_at)
          return dogDate.getMonth() === date.getMonth() &&
                 dogDate.getFullYear() === date.getFullYear() &&
                 d.status !== 'Deceased'
        }).length || 0
        const occupancy = shelterCapacity > 0 ? Math.round((monthDogs / shelterCapacity) * 100) : 0
        monthlyData.push({ month: monthName, occupancy })
      }

      return monthlyData
    }
  })

  return (
    <Card.Root bg="bg.panel">
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <Heading size="md" color="fg.default">
            Monthly Occupancy
          </Heading>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyOccupancy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="occupancy" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

export default MonthlyOccupancyChart