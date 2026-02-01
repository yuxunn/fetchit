import {
  Box,
  VStack,
  HStack,
  Button,
  Textarea,
  createListCollection,
  Select,
  Field,
} from "@chakra-ui/react";

const CATEGORY_OPTIONS = createListCollection({
  items: [
    { label: "Medical Records", value: "medical" },
    { label: "Vet Bills", value: "vet-bills" },
    { label: "Adoption Papers", value: "adoption" },
    { label: "Training Certificates", value: "training" },
    { label: "General Documents", value: "general" },
  ],
});

const VISIBILITY_OPTIONS = createListCollection({
  items: [
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
    { label: "Admins Only", value: "admins-only" },
  ],
});

export default function FileMetadataForm({
  category,
  setCategory,
  visibility,
  setVisibility,
  remarks,
  setRemarks,
  onSubmit,
  disabled,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      border="1px solid"
      borderColor="border.default"
      borderRadius="md"
      p={6}
      bg="bg.panel"
    >
      <VStack gap={4} align="stretch">
        <HStack gap={4} align="flex-start">
          {/* Category Select */}
          <Field.Root flex="1">
            <Field.Label color="fg.default" fontWeight="medium">
              Category *
            </Field.Label>
            <Select.Root
              collection={CATEGORY_OPTIONS}
              size="md"
              value={category}
              onValueChange={(e) => setCategory(e.value)}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger bg="bg.panel" borderColor="border.default">
                  <Select.ValueText placeholder="Select category" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content bg="bg.panel" borderColor="border.default">
                  <Select.ItemGroup>
                    {CATEGORY_OPTIONS.items.map((option) => (
                      <Select.Item
                        key={option.value}
                        item={option}
                        _hover={{ bg: "bg.muted" }}
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Field.Root>

          {/* Visibility Select */}
          <Field.Root flex="1">
            <Field.Label color="fg.default" fontWeight="medium">
              Who can see this *
            </Field.Label>
            <Select.Root
              collection={VISIBILITY_OPTIONS}
              size="md"
              value={visibility}
              onValueChange={(e) => setVisibility(e.value)}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger bg="bg.panel" borderColor="border.default">
                  <Select.ValueText placeholder="Select visibility" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content bg="bg.panel" borderColor="border.default">
                  <Select.ItemGroup>
                    {VISIBILITY_OPTIONS.items.map((option) => (
                      <Select.Item
                        key={option.value}
                        item={option}
                        _hover={{ bg: "bg.muted" }}
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Field.Root>
        </HStack>

        {/* Remarks Textarea */}
        <Field.Root>
          <Field.Label color="fg.default" fontWeight="medium">
            Remarks (Optional)
          </Field.Label>
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add any additional notes about this file..."
            size="md"
            rows={4}
            bg="bg.panel"
            borderColor="border.default"
            _focus={{ borderColor: "border.emphasized" }}
          />
        </Field.Root>

        {/* Submit Button */}
        <Button
          type="submit"
          colorPalette="orange"
          size="lg"
          disabled={disabled}
          w="full"
        >
          Submit File
        </Button>
      </VStack>
    </Box>
  );
}
