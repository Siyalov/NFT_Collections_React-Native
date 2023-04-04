import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "./components/Header";
import { NFTUserCollection } from "./api/serverData";
import { getPage } from "./api";
import BodyImage from "./components/BodyImage";
import NFTCollection from "./components/NFTCollection";

export default function App() {
  const [data, setData] = useState<Array<NFTUserCollection> | null>(null);
  const [page, setPage] = useState(1);

  async function loadData() {
    const data = await getPage(page);
    setData(data);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView style={stylesApp.container}>
      {data ? (
        data.map((el) => <NFTCollection key={el.id} collection={el} />)
      ) : (
        <Text>Loading...</Text>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const stylesApp = StyleSheet.create({
  container: {
    backgroundColor: "#05071B", // #1E2032
    height: '100%',
  },
});
