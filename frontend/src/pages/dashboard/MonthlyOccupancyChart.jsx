import { useQuery } from '@tanstack/react-query'
import { Card, VStack, Heading, Box } from '@chakra-ui/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import supabase from '../../supabaseClient'

const MonthlyOccupancyChart = () => {
  const { data: monthlyOccupancy = [] } = useQuery({
    queryKey: ['monthly-occupancy'],
    queryFn: async () => {
      let { data: dogData, error } = await supabase
        .from('dogs')
        .select('created_at, status, adopted_at, date_archived, deleted_at')

      if (error) {
        console.error('monthly occupancy supabase error:', error)
        const res = await supabase.from('dogs').select('created_at, status')
        dogData = res.data
      }

          const shelterCapacity = 50
          const monthlyData = []

          // Compute occupancy for each month by counting dogs that were present
          // at the end of the month. A dog is considered present in a month if:
          // - created_at <= last day of the month
          // - AND (no archive date) OR (archive date > last day of the month)
          // We prefer archive dates from `adopted_at`, fallback to `date_archived`.
          for (let i = 5; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const monthName = date.toLocaleString('default', { month: 'short' })

            // last millisecond of the month
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

            const archivedStatuses = ['Deceased', 'Adopted', 'Archived']
            const monthDogs = (dogData || []).filter(d => {
              const createdAt = d.created_at ? new Date(d.created_at) : null
              const archiveDateRaw = d.adopted_at || d.date_archived || d.deleted_at || null
              const archivedAt = archiveDateRaw ? new Date(archiveDateRaw) : null

              // If we have a createdAt timestamp, require it to be on/before lastDay.
              // If createdAt is missing, assume the dog arrived earlier (include it)
              if (createdAt && createdAt > lastDay) return false

              // if archived at or before lastDay, they were not present at month end
              if (archivedAt && archivedAt <= lastDay) return false

              // fallback: if we don't have an archive date but the status indicates
              // the dog is archived, treat it as archived
              if (!archivedAt && archivedStatuses.includes(d.status)) return false

              return true
            }).length

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
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="occupancy" fill="#3B82F6">
                  <LabelList dataKey="occupancy" position="top" formatter={(val) => `${val}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

export default MonthlyOccupancyChart