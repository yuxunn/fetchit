import {
  VStack,
  Heading,
  Collapsible,
  Text,
  Icon,
  Box,
  Fieldset,
  Checkbox,
  CheckboxGroup,
  Stack,
  Select,
  Portal,
  Switch,
  Slider,
  Button,
  createListCollection,
  HStack,
} from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

const KENNEL_OPTIONS = [
  "Happy Tabs Shelter",
  "Paws & Hearts Rescue",
  "Golden Years Sanctuary",
  "Second Chance Dogs",
];

const STATUS_OPTIONS = ["Available", "Foster Care", "Adopted", "Urgent"];

const BREED_OPTIONS = createListCollection({
  items: [
    { label: "Labrador Retriever", value: "labrador" },
    { label: "Golden Retriever", value: "golden" },
    { label: "Poodle", value: "poodle" },
    { label: "Shiba Inu", value: "shiba" },
    { label: "Mixed Breed", value: "mixed" },
    { label: "German Shepherd", value: "german_shepherd" },
    { label: "Corgi", value: "corgi" },
    { label: "Beagle", value: "beagle" },
  ],
});

const MEDICAL_PRIORITY_OPTIONS = [
  "Special Needs",
  "Senior Care",
  "Medication Required",
  "Behavioural Support",
];

export default function Filters({
  kennel,
  setKennel,
  breed,
  setBreed,
  status,
  setStatus,
  hdbApproved,
  setHdbApproved,
  ageRange,
  setAgeRange,
  medicalPriority,
  setMedicalPriority,
  handleResetFilters,
  onSearch,
}) {
  return (
    <VStack align="stretch" spacing={6} minW="xs">
      <Heading as="h2" size="md" mb={2}>
        Filters
      </Heading>
      {/* Kennel Filter */}
      <Collapsible.Root>
        <Collapsible.Trigger
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w="full"
          py={2}
        >
          <Text>Kennel</Text>
          <Collapsible.Indicator
            transition="transform 0.2s"
            _open={{ transform: "rotate(90deg)" }}
          >
            <Icon as={LuChevronRight} />
          </Collapsible.Indicator>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Box px={2} py={2}>
            <Fieldset.Root>
              <CheckboxGroup
                name="kennel"
                value={kennel}
                onValueChange={setKennel}
              >
                <Fieldset.Legend fontSize="sm" mb="2" srOnly>
                  Select Kennel
                </Fieldset.Legend>
                <Fieldset.Content>
                  <Stack align="flex-start" spacing={2}>
                    {KENNEL_OPTIONS.map((option) => (
                      <Checkbox.Root key={option} value={option}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{option}</Checkbox.Label>
                      </Checkbox.Root>
                    ))}
                  </Stack>
                </Fieldset.Content>
              </CheckboxGroup>
            </Fieldset.Root>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>

      {/* Breed Filter */}
      <Collapsible.Root>
        <Collapsible.Trigger
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w="full"
          py={2}
        >
          <Text>Breed</Text>
          <Collapsible.Indicator
            transition="transform 0.2s"
            _open={{ transform: "rotate(90deg)" }}
          >
            <Icon as={LuChevronRight} />
          </Collapsible.Indicator>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Box px={2} py={2}>
            <Select.Root
              collection={BREED_OPTIONS}
              size="sm"
              width="full"
              value={breed ? [breed] : []}
              onValueChange={(e) => setBreed(e.value?.[0] || "")}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select breed" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {BREED_OPTIONS.items.map((breed) => (
                      <Select.Item item={breed} key={breed.value}>
                        {breed.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>

      {/* Status Filter */}
      <Collapsible.Root>
        <Collapsible.Trigger
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w="full"
          py={2}
        >
          <Text>Status</Text>
          <Collapsible.Indicator
            transition="transform 0.2s"
            _open={{ transform: "rotate(90deg)" }}
          >
            <Icon as={LuChevronRight} />
          </Collapsible.Indicator>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Box px={2} py={2}>
            <Fieldset.Root>
              <CheckboxGroup
                name="status"
                value={status}
                onValueChange={setStatus}
              >
                <Fieldset.Legend fontSize="sm" mb="2" srOnly>
                  Select Status
                </Fieldset.Legend>
                <Fieldset.Content>
                  <Stack align="flex-start" spacing={2}>
                    {STATUS_OPTIONS.map((option) => (
                      <Checkbox.Root key={option} value={option}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{option}</Checkbox.Label>
                      </Checkbox.Root>
                    ))}
                  </Stack>
                </Fieldset.Content>
              </CheckboxGroup>
            </Fieldset.Root>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>

      {/* HDB Approved Switch */}
      <HStack justify="space-between" py={2}>
        <Text>HDB Approved</Text>
        <Switch.Root
          checked={hdbApproved}
          onCheckedChange={(e) => setHdbApproved(!!e.checked)}
          size="md"
        >
          <Switch.HiddenInput />
          <Switch.Control />
        </Switch.Root>
      </HStack>

      {/* Age Range Slider */}
      <Box py={2}>
        <Text mb={2}>Age Range</Text>
        <Slider.Root
          min={0}
          max={100}
          value={ageRange}
          onValueChange={(e) => setAgeRange(e.value)}
          width="full"
          size="md"
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.HiddenInput />
            </Slider.Thumb>
            <Slider.Thumb index={1}>
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
        <HStack justify="space-between" mt={1} fontSize="sm" color="fg.muted">
          <Text>{Math.round(ageRange[0])} yrs</Text>
          <Text>{Math.round(ageRange[1])} yrs</Text>
        </HStack>
      </Box>
      {/* Medical Priority (Collapsible) */}
      <Collapsible.Root>
        <Collapsible.Trigger
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w="full"
          py={2}
        >
          <Text>Medical Priority</Text>
          <Collapsible.Indicator
            transition="transform 0.2s"
            _open={{ transform: "rotate(90deg)" }}
          >
            <Icon as={LuChevronRight} />
          </Collapsible.Indicator>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Box px={2} py={2}>
            <Fieldset.Root>
              <CheckboxGroup
                name="medical-priority"
                value={medicalPriority}
                onValueChange={setMedicalPriority}
              >
                <Fieldset.Legend fontSize="sm" mb="2" srOnly>
                  Select Medical Priority
                </Fieldset.Legend>
                <Fieldset.Content>
                  <Stack align="flex-start" spacing={2}>
                    {MEDICAL_PRIORITY_OPTIONS.map((option) => (
                      <Checkbox.Root key={option} value={option}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{option}</Checkbox.Label>
                      </Checkbox.Root>
                    ))}
                  </Stack>
                </Fieldset.Content>
              </CheckboxGroup>
            </Fieldset.Root>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>

      <Button mt={4} colorPalette="blue" w="full" onClick={onSearch}>
        Apply Filters
      </Button>

      <Button mt={2} variant="outline" w="full" onClick={handleResetFilters}>
        Reset Filters
      </Button>
    </VStack>
  );
}
