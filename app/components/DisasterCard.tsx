import React from "react";
import { View, Text } from "react-native";
import { Disaster } from "../../types/disaster";

// Olay türüne göre ikon ve renk eşlemesi
const getIncidentStyle = (type: string) => {
  const map: Record<string, { bg: string; icon: string }> = {
    fire: { bg: "bg-red-600", icon: "🔥" },
    flood: { bg: "bg-blue-600", icon: "🌊" },
    hurricane: { bg: "bg-purple-600", icon: "🌀" },
    tornado: { bg: "bg-green-600", icon: "🌪️" },
    earthquake: { bg: "bg-yellow-500", icon: "🌍" },
    drought: { bg: "bg-orange-600", icon: "☀️" },
    "tropical storm": { bg: "bg-cyan-600", icon: "🌧️" },
    "severe storm(s)": { bg: "bg-gray-600", icon: "⛈️" },
    snow: { bg: "bg-sky-400", icon: "❄️" },
    freezing: { bg: "bg-sky-300", icon: "🧊" },
    terrorist: { bg: "bg-black", icon: "💣" },
    other: { bg: "bg-zinc-700", icon: "❓" },
  };

  const key = type.toLowerCase();
  return map[key] || { bg: "bg-zinc-600", icon: "⚠️" };
};

type Props = {
  data: Disaster;
};

const DisasterCard: React.FC<Props> = ({ data }) => {
  const { bg, icon } = getIncidentStyle(data.incidentType);

  return (
    <View
      className={`rounded-2xl p-4 mb-4 shadow-md border border-white/10 ${bg}`}
    >
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-white text-lg font-bold flex-1 pr-2">
          {icon} {data.declarationTitle}
        </Text>
        <Text className="text-white/70 text-sm text-right">{data.state}</Text>
      </View>

      <Text className="text-white/80 text-sm">{data.incidentType}</Text>

      <Text className="text-white/60 text-xs mt-2">
        Declared on {new Date(data.declarationDate).toLocaleDateString()}
      </Text>
    </View>
  );
};

export default DisasterCard;
