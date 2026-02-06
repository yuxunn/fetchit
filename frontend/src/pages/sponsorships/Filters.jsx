import {
  HStack,
  Field,
  Input,
  Select,
  Button,
  createListCollection,
} from "@chakra-ui/react";

const STATUS_OPTIONS = createListCollection({
  items: [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
  ],
});

const TYPE_OPTIONS = createListCollection({
  items: [
    { label: "All", value: "all" },
    { label: "General", value: "general" },
    { label: "Medical", value: "medical" },
    { label: "Food", value: "food" },
    { label: "Shelter", value: "shelter" },
  ],
});

export default function Filters({
  searchKeyword,
  setSearchKeyword,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}) {
  return (
    <HStack gap={4} align="flex-end">
      <Field.Root flex={1}>
        <Field.Label>Search</Field.Label>
        <Input
          placeholder="Search by sponsor name or contact..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          size="md"
          bg="bg.panel"
        />
      </Field.Root>

      <Field.Root w="200px">
        <Field.Label>Status</Field.Label>
        <Select.Root
          collection={STATUS_OPTIONS}
          size="md"
          value={statusFilter}
          onValueChange={(e) => setStatusFilter(e.value)}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger bg="bg.panel">
              <Select.ValueText placeholder="Select status" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content bg="bg.panel">
              <Select.ItemGroup>
                {STATUS_OPTIONS.items.map((option) => (
                  <Select.Item key={option.value} item={option}>
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Field.Root>

      <Field.Root w="200px">
        <Field.Label>Type</Field.Label>
        <Select.Root
          collection={TYPE_OPTIONS}
          size="md"
          value={typeFilter}
          onValueChange={(e) => setTypeFilter(e.value)}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger bg="bg.panel">
              <Select.ValueText placeholder="Select type" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content bg="bg.panel">
              <Select.ItemGroup>
                {TYPE_OPTIONS.items.map((option) => (
                  <Select.Item key={option.value} item={option}>
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Field.Root>

      <Button colorPalette="orange" size="md">
        Apply Filters
      </Button>
    </HStack>
  );
}