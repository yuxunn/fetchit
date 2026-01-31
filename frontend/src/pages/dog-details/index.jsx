import { VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { dogDetails } from "./dummy-data";
import Header from "./Header";
import MedicalHistory from "./MedicalHistory";

export default function DogDetails() {
  // Fetch dog's dummy data with useQuery
  const { data: dog = {} } = useQuery({
    queryKey: ["dog-details"],
    queryFn: () => dogDetails, // Dummy return for now
  });

  return (
    <VStack align="stretch" gap={8} p={6}>
      <Header dog={dog} />
      <MedicalHistory medicalHistory={dog.medicalHistory || []} />
    </VStack>
  );
}