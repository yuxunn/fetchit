import { VStack, Text, Table, Badge } from "@chakra-ui/react";

export default function MedicalHistory({ medicalHistory }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "orange";
      case "inactive":
        return "yellow";
      case "disabled":
        return "gray";
      default:
        return "gray";
    }
  };

  return (
    <VStack align="stretch" gap={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Medical History
      </Text>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>#</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Date Archived</Table.ColumnHeader>
            <Table.ColumnHeader>Shelter</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {medicalHistory.map((record, index) => (
            <Table.Row key={record.id}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{record.name}</Table.Cell>
              <Table.Cell>{record.dateArchived}</Table.Cell>
              <Table.Cell>{record.shelter}</Table.Cell>
              <Table.Cell>
                <Badge colorPalette={getStatusColor(record.status)} variant="solid">
                  {record.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}