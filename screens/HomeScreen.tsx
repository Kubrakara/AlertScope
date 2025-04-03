import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { fetchDisasters } from "../utils/api";
import DisasterCard from "../components/DisasterCard";
import { Disaster } from "../types/disaster";

const HomeScreen: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDisasters();
      setDisasters(data.slice(0, 20)); // ilk 20 olay
      setLoading(false);
    };
    loadData();
  }, []);

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
        keyExtractor={(item) => item.disasterNumber.toString()}
        renderItem={({ item }) => <DisasterCard data={item} />}
      />
    </View>
  );
};

export default HomeScreen;
