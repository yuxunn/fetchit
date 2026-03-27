import { useQuery } from '@tanstack/react-query'
import { Card, VStack, Heading, Box, Table, Badge } from '@chakra-ui/react'
import supabase from '../../supabaseClient'

const ArchivedDogsTable = () => {
  const { data: archivedDogs = [] } = useQuery({
    queryKey: ['archivedDogs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('dogs')
        .select('*')
        .in('status', ['Deceased', 'Adopted'])
        .order('adopted_at', { ascending: false })
      return data || []
    }
  })

  return (
    <Card.Root bg="bg.panel">
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <Heading size="lg" color="fg.default">
            Archived Dogs
          </Heading>
          <Box overflowX="auto">
            <Table.Root size="md" variant="line">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Breed</Table.ColumnHeader>
                  <Table.ColumnHeader>Date Archived</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {archivedDogs.slice(0, 5).map((dog) => (
                  <Table.Row key={dog.id}>
                    <Table.Cell fontWeight="semibold">{dog.name}</Table.Cell>
                    <Table.Cell>{dog.breed}</Table.Cell>
                    <Table.Cell color="fg.muted" fontSize="sm">
                      {/* Use adopted_at (archived date) when available, fall back to created_at */}
                      {new Date(dog.adopted_at || dog.created_at).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette="gray"
                        variant="solid"
                        textTransform="uppercase"
                        fontSize="xs"
                      >
                        {dog.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {archivedDogs.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={4} textAlign="center" color="fg.muted">
                      No archived dogs
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

export default ArchivedDogsTable