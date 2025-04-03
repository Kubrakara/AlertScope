import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import { fetchDisasters } from "../../utils/api";
import DisasterCard from "../components/DisasterCard";
import { Disaster } from "../../types/disaster";

const HomeScreen: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDisasters();
      setDisasters(data.slice(0, 50)); // ilk 20 olay
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
      <FlatList
        data={disasters}
        // Benzersiz key sağlamak için item.disasterNumber ve index kombinasyonunu kullanıyoruz
        keyExtractor={(item, index) => `${item.disasterNumber}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <DisasterCard data={item} />
          </TouchableOpacity>
        )}
        // Listede boş veri varsa mesaj göster
        ListEmptyComponent={
          <Text className="text-white">No disasters found.</Text>
        }
      />

      {/* Modal */}
      {selectedDisaster && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-neutral-800 rounded-lg p-6 w-11/12 max-w-lg">
              <Text className="text-white text-xl font-bold mb-2">
                {selectedDisaster.declarationTitle}
              </Text>
              <Text className="text-white/80 mb-2">
                <Text className="font-semibold">State: </Text>
                {selectedDisaster.state}
              </Text>
              <Text className="text-white/80 mb-2">
                <Text className="font-semibold">Incident Type: </Text>
                {selectedDisaster.incidentType}
              </Text>

              <Text className="font-semibold text-white/80 mb-4">
                Declaration Date:{" "}
                {new Date(
                  selectedDisaster.declarationDate
                ).toLocaleDateString()}
              </Text>

              <TouchableOpacity onPress={handleCloseModal}>
                <View className="bg-red-500 rounded-lg p-2">
                  <Text className="text-white text-center">Close</Text>
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
