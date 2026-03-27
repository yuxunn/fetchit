const STATUS_OPTIONS = ["Available", "Foster Care", "Adopted", "Urgent"];
import { Box, VStack, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import supabase from "../../supabaseClient";
import Filters from "./Filters";
import Header from "./Header";
import CardGrid from "./CardGrid";

export default function DogDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch unique breed values from database
  const { data: breedOptions = [] } = useQuery({
    queryKey: ["breeds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dogs")
        .select("breed")
        .not("breed", "is", null);

      if (error) throw error;

      // Get unique breed values and sort them
      const uniqueBreeds = [...new Set(data.map(d => d.breed))].sort();
      return uniqueBreeds;
    },
  });

  // Helper function to get initial values from URL params
  const getInitialValue = (param, defaultValue, isArray = false) => {
    const value = searchParams.get(param);
    if (!value) return defaultValue;
    if (isArray) return value.split(",");
    if (typeof defaultValue === "boolean") return value === "true";
    if (typeof defaultValue === "number") return parseInt(value);
    return value;
  };

  // State for filters (pending - not yet applied)
  const [kennel, setKennel] = useState(() => getInitialValue("kennel", [], true));
  const [breed, setBreed] = useState(() => getInitialValue("breed", [], true));
  const [status, setStatus] = useState(() => getInitialValue("status", [], true));
  const [hdbApproved, setHdbApproved] = useState(() => getInitialValue("hdbApproved", false));
  const [ageRange, setAgeRange] = useState(() => {
    const min = getInitialValue("ageMin", 0);
    const max = getInitialValue("ageMax", 100);
    return [min, max];
  });
  const [medicalPriority, setMedicalPriority] = useState(() => getInitialValue("medicalPriority", [], true));

  // State for header controls
  const [searchValue, setSearchValue] = useState(() => getInitialValue("search", ""));
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
    setSearchValue("");
    // Clear URL params
    setSearchParams({});
  }

  // Search handler - applies both search text and filters by updating URL params
    function handleSearch() {
    const newParams = {};

    if (kennel.length > 0) newParams.kennel = kennel.join(",");
  if (breed && breed.length > 0) newParams.breed = breed.join(",");
    if (status.length > 0) newParams.status = status.join(",");
    if (hdbApproved) newParams.hdbApproved = "true";
    if (ageRange[0] > 0) newParams.ageMin = ageRange[0].toString();
    if (ageRange[1] < 100) newParams.ageMax = ageRange[1].toString();
    if (medicalPriority.length > 0) newParams.medicalPriority = medicalPriority.join(",");
    if (searchValue.trim()) newParams.search = searchValue.trim();

    setSearchParams(newParams);
  }

  const { data: dogList = [], isLoading, error } = useQuery({
    queryKey: [
      "dogs",
      {
        kennel: searchParams.get("kennel"),
        breed: searchParams.get("breed"),
        status: searchParams.get("status"),
        hdbApproved: searchParams.get("hdbApproved"),
        ageMin: searchParams.get("ageMin"),
        ageMax: searchParams.get("ageMax"),
        medicalPriority: searchParams.get("medicalPriority"),
        searchValue: searchParams.get("search"),
        sortBy,
      },
    ],
    queryFn: async () => {
      let query = supabase.from("dogs").select("*");

      // Apply filters from URL params
      const kennelParam = searchParams.get("kennel");
      if (kennelParam) {
        query = query.in("kennel", kennelParam.split(","));
      }

      const breedParam = searchParams.get("breed");
      if (breedParam) {
        // support multiple breeds (CSV) by OR-ing ilike clauses so values can be
        // partial matches (e.g. 'labrador' matches 'Labrador Retriever')
        const breeds = breedParam.split(",").map(b => b.trim()).filter(Boolean);
        if (breeds.length === 1) {
          query = query.ilike("breed", `%${breeds[0]}%`);
        } else if (breeds.length > 1) {
          const orExpr = breeds.map(b => `breed.ilike.%${b}%`).join(",");
          query = query.or(orExpr);
        }
      }

      const statusParam = searchParams.get("status");
      if (statusParam) {
        query = query.in("status", statusParam.split(","));
      }

      const hdbApprovedParam = searchParams.get("hdbApproved");
      if (hdbApprovedParam === "true") {
        query = query.eq("is_hdb_approved", true);
      }

      const ageMinParam = searchParams.get("ageMin");
      const ageMaxParam = searchParams.get("ageMax");
      if (ageMinParam || ageMaxParam) {
        const minAge = ageMinParam ? parseInt(ageMinParam) : 0;
        const maxAge = ageMaxParam ? parseInt(ageMaxParam) : 100;
        query = query.gte("age", minAge).lte("age", maxAge);
      }

      const medicalPriorityParam = searchParams.get("medicalPriority");
      if (medicalPriorityParam) {
        query = query.in("medical_priority", medicalPriorityParam.split(","));
      }

      const searchParam = searchParams.get("search");
      if (searchParam && searchParam.trim()) {
        query = query.or(`name.ilike.%${searchParam}%,breed.ilike.%${searchParam}%,kennel.ilike.%${searchParam}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "name_asc":
          query = query.order("name", { ascending: true });
          break;
        case "name_desc":
          query = query.order("name", { ascending: false });
          break;
        case "age_young":
          query = query.order("age", { ascending: true });
          break;
        case "age_old":
          query = query.order("age", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      // If no status param provided, filter out archived statuses on the client
      // so the directory defaults to showing active dogs only.
      if (!statusParam) {
        const archivedStatuses = ["Deceased", "Adopted", "Archived"]
        return (data || []).filter(d => !archivedStatuses.includes(d.status))
      }

      return data;
    },
  });

  const dogCount = dogList.length;

  if (isLoading) {
    return <div>Loading dogs...</div>;
  }

  if (error) {
    return <div>Error loading dogs: {error.message}</div>;
  }

  return (
    <HStack align="flex-start" minH="100vh" p={2} gap={6}>
      <Filters
        kennel={kennel}
        setKennel={setKennel}
        breed={breed}
        setBreed={setBreed}
        status={status}
        setStatus={setStatus}
        hdbApproved={hdbApproved}
        setHdbApproved={setHdbApproved}
        ageRange={ageRange}
        setAgeRange={setAgeRange}
        medicalPriority={medicalPriority}
        setMedicalPriority={setMedicalPriority}
        handleResetFilters={handleResetFilters}
        onSearch={handleSearch}
        breeds={breedOptions}
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
