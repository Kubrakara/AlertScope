import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // en yukarıya ekle
import DisasterCard from "../components/DisasterCard";
import { Disaster } from "../../types/disaster";
import { stateNameMap, incidentTypes } from "../constants/disasterFilters";

const HomeScreen: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedState, setSelectedState] = useState("ALL");
  const [selectedIncidentType, setSelectedIncidentType] = useState("ALL");

  // 🔄 FEMA API'den veri çek
  const fetchDisasters = async (state?: string, type?: string) => {
    setLoading(true);
    try {
      let url =
        "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries";
      const filters: string[] = [];

      if (state && state !== "ALL") filters.push(`state eq '${state}'`);
      if (type && type !== "ALL") filters.push(`incidentType eq '${type}'`);

      if (filters.length > 0) {
        url += `?$filter=${filters.join(" and ")}&$orderby=declarationDate desc&$top=100`;
      } else {
        url += "?$orderby=declarationDate desc&$top=100";
      }

      console.log("📡 API URL:", url);
      const response = await fetch(url);
      const data = await response.json();

      console.log(
        "📦 Veri sayısı:",
        data.DisasterDeclarationsSummaries?.length
      );
      setDisasters(data.DisasterDeclarationsSummaries || []);
    } catch (error) {
      console.error("❌ API fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  const handleApplyFilters = () => {
    fetchDisasters(selectedState, selectedIncidentType);
    setModalVisible(false);
  };

  const handleResetFilters = () => {
    setSelectedState("ALL");
    setSelectedIncidentType("ALL");
    fetchDisasters();
    setModalVisible(false);
  };

  const handleCardPress = (disaster: Disaster) => {
    setSelectedDisaster(disaster);
  };

  const filteredDisasters = disasters.filter((d) =>
    d.declarationTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-neutral-800 px-4 py-6">
      {/* Arama ve filtre butonu */}
      {/* Arama ve filtre yan yana */}
      <View className="flex-row items-center space-x-2 gap-3 mb-4">
        <View className="flex-1">
          <TextInput
            placeholder="Search disasters..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="text-white bg-neutral-700 px-3 py-3 rounded-lg"
          />
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-red-600 p-3 rounded-lg justify-center items-center"
        >
          <Ionicons name="filter-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Liste */}
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          {filteredDisasters.length === 0 ? (
            <Text className="text-white text-center mt-4">
              No disasters found.
            </Text>
          ) : (
            <FlatList
              data={filteredDisasters}
              keyExtractor={(item, index) => `${item.disasterNumber}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleCardPress(item)}>
                  <DisasterCard data={item} />
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}

      {/* Modal: Filtre Seçimi */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View
            className="bg-white p-6 rounded-xl w-full max-w-md"
            style={{
              maxHeight: "85%", // 📏 Modal yüksekliğini sınırlıyoruz
              width: "100%",
            }}
          >
            <ScrollView>
              <Text className="text-lg font-bold mb-2">Filter Disasters</Text>

              {/* State Seçimi */}
              <Text className="font-semibold mt-2 mb-1">State:</Text>
              <View className="flex-row flex-wrap">
                <TouchableOpacity
                  onPress={() => setSelectedState("ALL")}
                  style={{
                    backgroundColor:
                      selectedState === "ALL" ? "red" : "#e5e7eb",
                    padding: 6,
                    margin: 4,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      color: selectedState === "ALL" ? "white" : "black",
                    }}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {Object.entries(stateNameMap).map(([code, name]) => (
                  <TouchableOpacity
                    key={code}
                    onPress={() => setSelectedState(code)}
                    style={{
                      backgroundColor:
                        selectedState === code ? "red" : "#e5e7eb",
                      padding: 6,
                      margin: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: selectedState === code ? "white" : "black",
                      }}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Incident Type Seçimi */}
              <Text className="font-semibold mt-4 mb-1">Incident Type:</Text>
              <View className="flex-row flex-wrap">
                {incidentTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setSelectedIncidentType(type)}
                    style={{
                      backgroundColor:
                        selectedIncidentType === type ? "red" : "#e5e7eb",
                      padding: 6,
                      margin: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          selectedIncidentType === type ? "white" : "black",
                      }}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Butonlar */}
              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    backgroundColor: "red",
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleResetFilters}
                  style={{
                    backgroundColor: "gray",
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Reset
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleApplyFilters}
                  style={{
                    backgroundColor: "green",
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Detay Modal */}
      {selectedDisaster && (
        <Modal animationType="slide" transparent={true} visible={true}>
          <View className="flex-1 justify-center items-center bg-black/50 px-4">
            <View className="bg-neutral-900 rounded-2xl p-6 w-full max-w-xl shadow-lg">
              <Text className="text-white text-2xl font-bold mb-4">
                {selectedDisaster.declarationTitle}
              </Text>
              <DetailRow label="State" value={selectedDisaster.state} />
              <DetailRow
                label="Incident Type"
                value={selectedDisaster.incidentType}
              />
              <DetailRow
                label="Disaster Number"
                value={selectedDisaster.disasterNumber}
              />
              <DetailRow
                label="Declaration Date"
                value={new Date(
                  selectedDisaster.declarationDate
                ).toLocaleDateString()}
              />
              <DetailRow
                label="Designated Area"
                value={selectedDisaster.designatedArea}
              />
              <TouchableOpacity
                onPress={() => setSelectedDisaster(null)}
                className="mt-6"
              >
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

// 🔁 Reusable detail row
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View className="flex-row justify-between my-1">
    <Text className="text-gray-400">{label}</Text>
    <Text className="text-white font-medium">{value}</Text>
  </View>
);

export default HomeScreen;
