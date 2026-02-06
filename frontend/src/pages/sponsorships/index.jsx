import {
  Box,
  VStack,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabaseClient";
import Stats from "./Stats";
import Filters from "./Filters";
import SponsorshipTable from "./SponsorshipTable";
import SponsorSidebar from "./SponsorSidebar";
import EditSponsorshipModal from "./EditSponsorshipModal";

export default function Sponsorships() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(["all"]);
  const [typeFilter, setTypeFilter] = useState(["all"]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [editingSponsorship, setEditingSponsorship] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditSponsorship = (sponsorship) => {
    setEditingSponsorship(sponsorship);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSponsorship(null);
  };

  // Fetch sponsorships
  const { data: sponsorships = [], isLoading } = useQuery({
    queryKey: ["sponsorships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorships")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch sponsored dogs
  const { data: sponsoredDogs = [] } = useQuery({
    queryKey: ["sponsoredDogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsored_dogs")
        .select(`
          sponsorship_id,
          dog_id,
          dogs (
            name,
            kennel
          )
        `);

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch all dogs for sidebar
  const { data: dogs = [] } = useQuery({
    queryKey: ["dogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dogs")
        .select("id, name, kennel")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Combine sponsorships with their sponsored dogs
  const sponsorshipsWithDogs = useMemo(() => {
    return sponsorships.map(sponsorship => ({
      ...sponsorship,
      sponsored_dogs: sponsoredDogs.filter(sd => sd.sponsorship_id === sponsorship.id)
    }));
  }, [sponsorships, sponsoredDogs]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalAmount = sponsorshipsWithDogs.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
    const dogsSponsored = new Set(
      sponsorshipsWithDogs.flatMap(s => s.sponsored_dogs?.map(sd => sd.dog_id) || [])
    ).size;
    const dogsWithoutSponsorship = dogs.length - dogsSponsored;
    const expiringSoon = sponsorshipsWithDogs.filter(s => {
      if (!s.end_date) return false;
      const endDate = new Date(s.end_date);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;

    return { totalAmount, dogsSponsored, dogsWithoutSponsorship, expiringSoon };
  }, [sponsorshipsWithDogs, dogs]);

  // Filter sponsorships
  const filteredSponsorships = sponsorshipsWithDogs.filter(sponsorship => {
    const matchesSearch = !searchKeyword.trim() ||
      sponsorship.sponsor_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      sponsorship.sponsor_contact?.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesStatus = statusFilter[0] === "all" || sponsorship.status === statusFilter[0];
    const matchesType = typeFilter[0] === "all" || sponsorship.type === typeFilter[0];

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Box p={8} bg="bg" minH="100vh">
      <VStack gap={6} maxW="1400px" mx="auto" align="stretch">
        {/* Header */}
        <Heading size="2xl" color="fg.default">
          Sponsorships Management
        </Heading>

        {/* Main Content with Sidebar */}
        <HStack align="start" gap={6} flex={1}>
          {/* Left Side - Stats, Filters and Table */}
          <VStack flex={1} gap={4} align="stretch">
            {/* Stats */}
            <Stats stats={stats} />

            <Filters
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
            />
            <SponsorshipTable
              sponsorships={filteredSponsorships}
              isLoading={isLoading}
              onSelectSponsor={setSelectedSponsor}
              onEditSponsorship={handleEditSponsorship}
            />
          </VStack>

          {/* Right Side - Sponsor Sidebar */}
          <Box w="350px" flexShrink={0}>
            <SponsorSidebar
              selectedSponsor={selectedSponsor}
              sponsorshipsWithDogs={sponsorshipsWithDogs}
            />
          </Box>
        </HStack>
      </VStack>

      <EditSponsorshipModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        sponsorship={editingSponsorship}
      />
    </Box>
  );
}