import { useQuery } from '@tanstack/react-query'
import { Card, VStack, Heading, Box } from '@chakra-ui/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import supabase from '../../supabaseClient'

const MonthlyVetCostsChart = () => {
  const { data: monthlyVetCosts = [] } = useQuery({
    queryKey: ['monthly-vet-costs'],
    queryFn: async () => {
      const { data: billData } = await supabase
        .from('vet_bills')
        .select('amount, created_at')

      const monthlyCosts = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthName = date.toLocaleString('default', { month: 'short' })
        const monthBills = billData?.filter(bill => {
          const billDate = new Date(bill.created_at)
          return billDate.getMonth() === date.getMonth() &&
                 billDate.getFullYear() === date.getFullYear()
        }) || []
        const totalCost = monthBills.reduce((sum, bill) => sum + (bill.amount || 0), 0)
        monthlyCosts.push({ month: monthName, cost: totalCost })
      }

      return monthlyCosts
    }
  })

  return (
    <Card.Root bg="bg.panel">
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <Heading size="md" color="fg.default">
            Monthly Vet Costs
          </Heading>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyVetCosts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                <Line type="monotone" dataKey="cost" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

export default MonthlyVetCostsChart