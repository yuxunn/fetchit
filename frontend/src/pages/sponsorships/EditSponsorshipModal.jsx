import {
  VStack,
  HStack,
  Input,
  Textarea,
  Select,
  Button,
  Field,
  createListCollection,
  Portal,
  Dialog,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabaseClient";

const typeOptions = createListCollection({
  items: [
    { label: "General", value: "general" },
    { label: "Medical", value: "medical" },
    { label: "Food", value: "food" },
    { label: "Shelter", value: "shelter" },
  ],
});

const statusOptions = createListCollection({
  items: [
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
  ],
});

export default function EditSponsorshipModal({ isOpen, onClose, sponsorship }) {
  const [formData, setFormData] = useState({
    sponsor_name: "",
    sponsor_contact: "",
    type: "",
    amount: "",
    start_date: "",
    end_date: "",
    status: "",
  });

  const queryClient = useQueryClient();
  const isCreating = !sponsorship;

  const saveSponsorshipMutation = useMutation({
    mutationFn: async (data) => {
      if (isCreating) {
        // Create new sponsorship
        const { data: result, error } = await supabase
          .from("sponsorships")
          .insert({
            sponsor_name: data.sponsor_name,
            sponsor_contact: data.sponsor_contact,
            type: data.type,
            amount: parseFloat(data.amount),
            start_date: data.start_date,
            end_date: data.end_date || null,
            status: data.status,
          })
          .select();

        if (error) throw error;
        return result;
      } else {
        // Update existing sponsorship
        const { data: result, error } = await supabase
          .from("sponsorships")
          .update({
            sponsor_name: data.sponsor_name,
            sponsor_contact: data.sponsor_contact,
            type: data.type,
            amount: parseFloat(data.amount),
            start_date: data.start_date,
            end_date: data.end_date || null,
            status: data.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", sponsorship.id)
          .select();

        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsorships"] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      sponsor_name: getFormValue("sponsor_name"),
      sponsor_contact: getFormValue("sponsor_contact"),
      type: getFormValue("type"),
      amount: getFormValue("amount"),
      start_date: getFormValue("start_date"),
      end_date: getFormValue("end_date"),
      status: getFormValue("status"),
    };
    saveSponsorshipMutation.mutate(submitData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get current form values (merge sponsorship data with any changes)
  const getFormValue = (field) => {
    return formData[field] !== undefined && formData[field] !== "" 
      ? formData[field] 
      : sponsorship?.[field] || "";
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} size="lg">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{isCreating ? "Create Sponsor" : "Edit Sponsorship"}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
          <form onSubmit={handleSubmit}>
            <VStack gap={4} align="stretch">
              <Field.Root>
                <Field.Label>Sponsor Name *</Field.Label>
                <Input
                  value={getFormValue("sponsor_name")}
                  onChange={(e) => handleInputChange("sponsor_name", e.target.value)}
                  required
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Contact Information</Field.Label>
                <Textarea
                  value={getFormValue("sponsor_contact")}
                  onChange={(e) => handleInputChange("sponsor_contact", e.target.value)}
                  placeholder="Email, phone, or other contact details"
                />
              </Field.Root>

              <HStack gap={4}>
                <Field.Root flex={1}>
                  <Field.Label>Type *</Field.Label>
                  <Select.Root
                    collection={typeOptions}
                    value={[getFormValue("type")]}
                    onValueChange={(details) => handleInputChange("type", details.value[0])}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select type" />
                      </Select.Trigger>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {typeOptions.items.map((option) => (
                          <Select.Item key={option.value} item={option}>
                            {option.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field.Root>

                <Field.Root flex={1}>
                  <Field.Label>Amount ($) *</Field.Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={getFormValue("amount")}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    required
                  />
                </Field.Root>
              </HStack>

              <HStack gap={4}>
                <Field.Root flex={1}>
                  <Field.Label>Start Date *</Field.Label>
                  <Input
                    type="date"
                    value={getFormValue("start_date")}
                    onChange={(e) => handleInputChange("start_date", e.target.value)}
                    required
                  />
                </Field.Root>

                <Field.Root flex={1}>
                  <Field.Label>End Date</Field.Label>
                  <Input
                    type="date"
                    value={getFormValue("end_date")}
                    onChange={(e) => handleInputChange("end_date", e.target.value)}
                  />
                </Field.Root>
              </HStack>

              <Field.Root>
                <Field.Label>Status *</Field.Label>
                <Select.Root
                  collection={statusOptions}
                  value={[getFormValue("status")]}
                  onValueChange={(details) => handleInputChange("status", details.value[0])}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select status" />
                    </Select.Trigger>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {statusOptions.items.map((option) => (
                        <Select.Item key={option.value} item={option}>
                          {option.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Field.Root>
            </VStack>
          </form>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={3}>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  loading={saveSponsorshipMutation.isPending}
                  colorPalette="blue"
                >
                  {isCreating ? "Create Sponsor" : "Save Changes"}
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}