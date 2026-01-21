import {
  Group,
  Input,
  Button,
  HStack,
  Text,
  Spacer,
  Switch,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { LuList, LuLayoutGrid } from "react-icons/lu";

const SORT_OPTIONS = createListCollection({
  items: [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
    { label: "Age (Youngest)", value: "age_young" },
    { label: "Age (Oldest)", value: "age_old" },
  ],
});

export default function Header({
  searchValue,
  setSearchValue,
  onSearch,
  dogCount = 0,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
}) {
  return (
    <>
      {/* Search Bar */}
      <Group attached w="full" maxW="full" mb={2}>
        <Input
          flex="1"
          placeholder="Search dogs..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch?.();
          }}
          size="md"
        />
        <Button bg="bg.subtle" variant="outline" onClick={onSearch}>
          Search
        </Button>
      </Group>

      {/* Results/controls bar */}
      <HStack w="full" mb={2}>
        <Text fontSize="sm" color="fg.muted">
          Showing {dogCount} dogs
        </Text>
        <Spacer />
        <Switch.Root
          checked={viewMode === "grid"}
          onCheckedChange={(e) => setViewMode(e.checked ? "grid" : "list")}
          size="md"
          colorPalette="gray"
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
            <Switch.Indicator fallback={<LuList />}>
              <LuLayoutGrid />
            </Switch.Indicator>
          </Switch.Control>
        </Switch.Root>
        <Select.Root
          collection={SORT_OPTIONS}
          size="sm"
          width="auto"
          minW="120px"
          ml={2}
          value={[sortBy]}
          onValueChange={(e) => setSortBy(e.value)}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Sort by" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {SORT_OPTIONS.items.map((opt) => (
                  <Select.Item item={opt} key={opt.value}>
                    {opt.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </HStack>
    </>
  );
}
