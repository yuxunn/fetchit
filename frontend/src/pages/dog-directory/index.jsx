const STATUS_OPTIONS = [
  'Available',
  'Foster Care',
  'Adopted',
  'Urgent',
];
import { Box, VStack, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dogs } from './dummy-data';
import Filters from './Filters';
import Header from './Header';
import CardGrid from './CardGrid';

export default function DogDirectory() {
  // State for filters
  const [kennel, setKennel] = useState([]);
  const [breed, setBreed] = useState('');
  const [status, setStatus] = useState([]);
  const [hdbApproved, setHdbApproved] = useState(false);
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [medicalPriority, setMedicalPriority] = useState([]);

  // State for header controls
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  // Reset handler
  function handleResetFilters() {
    setKennel([]);
    setBreed("");
    setStatus([]);
    setHdbApproved(false);
    setAgeRange([0, 100]);
    setMedicalPriority([]);
  }

  // Dummy onSearch handler
  function handleSearch() {
    // Implement search logic here
  }


  const { data: dogList = [] } = useQuery({
    queryKey: [
      'dogs',
      { kennel, breed, status, hdbApproved, ageRange, medicalPriority, searchValue, sortBy }
    ],
    queryFn: () => dogs // Dummy return for now
  });

  const dogCount = dogList.length;

  return (
    <HStack align="flex-start" minH="100vh" p={2} gap={6}>
      <Filters
        kennel={kennel} setKennel={setKennel}
        breed={breed} setBreed={setBreed}
        status={status} setStatus={setStatus}
        hdbApproved={hdbApproved} setHdbApproved={setHdbApproved}
        ageRange={ageRange} setAgeRange={setAgeRange}
        medicalPriority={medicalPriority} setMedicalPriority={setMedicalPriority}
        handleResetFilters={handleResetFilters}
      />
      <VStack flex={1} gap={4} align="stretch">
      <Header
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={handleSearch}
        dogCount={dogCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <CardGrid dogs={dogList} />
      </VStack>
    </HStack>
  );
}
