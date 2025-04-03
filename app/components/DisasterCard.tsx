import React from "react";
import { View, Text } from "react-native";
import { Disaster } from "../../types/disaster";

type Props = {
  data: Disaster;
};

const DisasterCard: React.FC<Props> = ({ data }) => {
  return (
    <View className="bg-neutral-700 rounded-2xl p-4 mb-4 shadow-md border border-neutral-600">
      <Text className="text-white text-xl font-bold mb-1">
        {data.declarationTitle}
      </Text>
      <Text className="text-white/80 text-base">
        {data.state} - {data.incidentType}
      </Text>
      <Text className="text-red-500 text-sm mt-2">
        {new Date(data.declarationDate).toLocaleDateString()}
      </Text>
    </View>
  );
};

export default DisasterCard;
