import React from "react";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "@/app/screens/HomeScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <>
      <SafeAreaView className="flex-1 px-4 bg-neutral-800">
        <StatusBar style="dark" />
        <HomeScreen />
      </SafeAreaView>
    </>
  );
}
