import { VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import supabase from "../../supabaseClient";
import Header from "./Header";
import MedicalHistory from "./MedicalHistory";

export default function DogDetails() {
  // For now, fetch dog with ID 1. This should be updated to use URL params when routing is fixed
  const dogId = 1;

  // Fetch dog details from Supabase
  const { data: dog = {}, isLoading: dogLoading, error: dogError } = useQuery({
    queryKey: ["dog-details", dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dogs")
        .select("*")
        .eq("id", dogId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch medical history from Supabase
  const { data: medicalHistory = [], isLoading: medicalLoading, error: medicalError } = useQuery({
    queryKey: ["medical-history", dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medical_history")
        .select("*")
        .eq("dog_id", dogId)
        .order("date_archived", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (dogLoading || medicalLoading) {
    return <div>Loading...</div>;
  }

  if (dogError || medicalError) {
    return <div>Error loading dog details</div>;
  }

  return (
    <VStack align="stretch" gap={8} p={6}>
      <Header dog={dog} />
      <MedicalHistory medicalHistory={medicalHistory} />
    </VStack>
  );
}