import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Text,
  Pressable,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { fetchDisasters } from "../../utils/api";
import DisasterCard from "../components/DisasterCard";
import { Disaster } from "../../types/disaster";

// 🗺️ State kodlarını tam isimleriyle eşleyen harita
const stateNameMap: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
  PR: "Puerto Rico",
  GU: "Guam",
  VI: "U.S. Virgin Islands",
  AS: "American Samoa",
  MP: "Northern Mariana Islands",
};

const HomeScreen: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [filtered, setFiltered] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(
    null
  );

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterState, setFilterState] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [stateOptions, setStateOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [incidentTypeOptions, setIncidentTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDisasters();
      const sliced = data.slice(0, 100);
      setDisasters(sliced);
      setFiltered(sliced);

      const uniqueStates = Array.from(
        new Set(sliced.map((d) => d.state))
      ).filter(Boolean);
      const uniqueTypes = Array.from(
        new Set(sliced.map((d) => d.incidentType))
      ).filter(Boolean);

      setStateOptions([
        { label: "All States", value: "" },
        ...uniqueStates.map((s) => ({
          label: `${stateNameMap[s] || s} (${s})`,
          value: s,
        })),
      ]);

      setIncidentTypeOptions([
        { label: "All Types", value: "" },
        ...uniqueTypes.map((t) => ({ label: t, value: t })),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  const handleCardPress = (disaster: Disaster) => {
    setSelectedDisaster(disaster);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDisaster(null);
  };

  const handleFilterApply = () => {
    const filteredData = disasters.filter((d) => {
      const stateMatch = filterState ? d.state === filterState : true;
      const typeMatch = filterType ? d.incidentType === filterType : true;
      const searchMatch = searchQuery
        ? d.declarationTitle.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return stateMatch && typeMatch && searchMatch;
    });

    setFiltered(filteredData);
  };

  // Arama değiştiğinde filtreleme tetiklenir
  useEffect(() => {
    handleFilterApply();
  }, [searchQuery, filterState, filterType]);

  if (loading) {
    return (
      <ActivityIndicator
        className="flex-1 justify-center items-center"
        size="large"
      />
    );
  }

  return (
    <View className="flex-1 bg-neutral-800 px-4 py-6">
      {/* Arama ve Filtre Alanı */}
      <View className="flex-row items-center justify-between mb-4 space-x-2">
        <View className="flex-1 bg-neutral-700 rounded-lg px-3">
          <TextInput
            placeholder="Search by title..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="text-white py-2"
          />
        </View>
        <TouchableOpacity
          onPress={() => setFilterModalOpen(true)}
          className="p-2"
        >
          <Ionicons name="filter-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal visible={filterModalOpen} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-center items-center px-4">
          <View className="bg-neutral-900 w-full max-w-xl p-6 rounded-2xl space-y-4">
            <Text className="text-white text-xl font-semibold mb-2">
              Filter Disasters
            </Text>

            {/* State Dropdown */}
            <View>
              <Text className="text-white/70 mb-1">State</Text>
              <View className="bg-neutral-700 rounded-md">
                <RNPickerSelect
                  onValueChange={setFilterState}
                  value={filterState}
                  items={stateOptions}
                  placeholder={{ label: "Select a state...", value: "" }}
                  style={{
                    inputAndroid: { color: "white", padding: 10 },
                    inputIOS: { color: "white", padding: 10 },
                    placeholder: { color: "#aaa" },
                  }}
                />
              </View>
            </View>

            {/* Incident Type Dropdown */}
            <View>
              <Text className="text-white/70 mb-1">Incident Type</Text>
              <View className="bg-neutral-700 rounded-md">
                <RNPickerSelect
                  onValueChange={setFilterType}
                  value={filterType}
                  items={incidentTypeOptions}
                  placeholder={{ label: "Select incident type...", value: "" }}
                  style={{
                    inputAndroid: { color: "white", padding: 10 },
                    inputIOS: { color: "white", padding: 10 },
                    placeholder: { color: "#aaa" },
                  }}
                />
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row justify-end space-x-2 pt-2">
              <Pressable
                onPress={() => setFilterModalOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded-lg"
              >
                <Text className="text-white">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  handleFilterApply();
                  setFilterModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 rounded-lg"
              >
                <Text className="text-white font-semibold">Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Disaster List */}
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => `${item.disasterNumber}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <DisasterCard data={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-white text-center mt-4">
            No disasters found.
          </Text>
        }
      />

      {/* Details Modal */}
      {selectedDisaster && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50 px-4">
            <View className="bg-neutral-900 rounded-2xl p-6 w-full max-w-xl shadow-lg">
              <Text className="text-white text-2xl font-bold mb-4">
                {selectedDisaster.declarationTitle}
              </Text>

              <View className="space-y-2">
                <Text className="text-white/90">
                  <Text className="font-semibold">State:</Text>{" "}
                  {selectedDisaster.state}
                </Text>
                <Text className="text-white/90">
                  <Text className="font-semibold">Declaration Type:</Text>{" "}
                  {selectedDisaster.declarationType}
                </Text>
                <Text className="text-white/90">
                  <Text className="font-semibold">Disaster Number:</Text>{" "}
                  {selectedDisaster.disasterNumber}
                </Text>
                <Text className="text-white/90">
                  <Text className="font-semibold">Incident Type:</Text>{" "}
                  {selectedDisaster.incidentType}
                </Text>
                <Text className="text-white/90">
                  <Text className="font-semibold">Declaration Date:</Text>{" "}
                  {new Date(
                    selectedDisaster.declarationDate
                  ).toLocaleDateString()}
                </Text>
                <Text className="text-white/90">
                  <Text className="font-semibold">Incident Dates:</Text>{" "}
                  {new Date(
                    selectedDisaster.incidentBeginDate
                  ).toLocaleDateString()}{" "}
                  -{" "}
                  {new Date(
                    selectedDisaster.incidentEndDate
                  ).toLocaleDateString()}
                </Text>
                <Text className="text-white/90">
                  <Text className="font-semibold">Designated Area:</Text>{" "}
                  {selectedDisaster.designatedArea}
                </Text>
                <Text className="text-white/90">
                  <Text className="font-semibold">
                    FEMA Declaration String:
                  </Text>{" "}
                  {selectedDisaster.femaDeclarationString}
                </Text>
                <Text className="text-white/90">
                  <Text className="font-semibold">Region:</Text>{" "}
                  {selectedDisaster.region}
                </Text>
              </View>

              <TouchableOpacity onPress={handleCloseModal} className="mt-6">
                <View className="bg-red-600 py-2 rounded-xl">
                  <Text className="text-center text-white font-semibold text-base">
                    Close
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default HomeScreen;
