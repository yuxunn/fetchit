import { useQuery } from '@tanstack/react-query'
import { Card, VStack, Heading, Box } from '@chakra-ui/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import supabase from '../../supabaseClient'

const HealthOverviewChart = () => {
  const { data: healthOverview = [] } = useQuery({
    queryKey: ['health-overview'],
    queryFn: async () => {
      const { data: dogData } = await supabase
        .from('dogs')
        .select('medical_priority')

      const healthConditions = dogData?.reduce((acc, dog) => {
        const condition = dog.medical_priority || 'Normal'
        acc[condition] = (acc[condition] || 0) + 1
        return acc
      }, {}) || {}

      return Object.entries(healthConditions).map(([condition, count]) => ({
        condition: condition.replace('_', ' '),
        count
      }))
    }
  })

  return (
    <Card.Root bg="bg.panel">
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <Heading size="md" color="fg.default">
            Health Overview
          </Heading>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthOverview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="condition" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count">
                  {healthOverview.map((entry, index) => {
                    const cond = (entry.condition || '').toLowerCase()
                    let fill = '#10B981' // green for normal
                    if (cond.includes('urgent')) fill = '#EF4444' // red
                    else if (cond.includes('high')) fill = '#F97316' // orange
                    else if (cond.includes('critical')) fill = '#DC2626'
                    return <Cell key={`cell-${index}`} fill={fill} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

export default HealthOverviewChart