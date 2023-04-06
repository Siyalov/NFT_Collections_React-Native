import React, { useState, useEffect } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  PanResponder,
} from "react-native";
import { NFTUserCollection } from "./api/serverData";
import { getPage } from "./api";
import NFTCollection from "./components/NFTCollection";
import { LinearGradient } from "expo-linear-gradient";

// TODO: move code from App.tsx to "Page"

export default function App() {
  const [data, setData] = useState<Array<NFTUserCollection> | null>(null);
  const pageSize = 10;
  const [lastLoadedPage, setLastLoadedPage] = useState(0);
  const scrollMessage = "Scroll for next gem";
  const scrollMessageEmpty = "Nothing here..";

  async function loadAndAddData(page = 1) {
    const prevPage = lastLoadedPage;
    setLastLoadedPage(page);
    const loadedData = await getPage(page, pageSize);
    if (!loadedData) {
      setLastLoadedPage(prevPage);
      return;
    }

    if (data) {
      setData([].concat(data, loadedData));
    } else {
      setData(loadedData);
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const topGradientHeight = new Animated.Value(0);
  const bottomGradientHeight = new Animated.Value(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const { dy } = gestureState;
      const isSwipeDown = dy > 0;
      const absDy = Math.abs(dy);
      const gradientOpacity = absDy > 100 ? 100 : absDy;
      if (isSwipeDown) {
        topGradientHeight.setValue(gradientOpacity);
        bottomGradientHeight.setValue(0);
      } else {
        topGradientHeight.setValue(0);
        bottomGradientHeight.setValue(gradientOpacity);
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      const { dy } = gestureState;
      const isSwipeDown = dy > 0;
      const directionMultiplier = isSwipeDown ? 1 : -1;
      const absDy = Math.abs(dy);
      if (absDy >= 50) {
        const nextIndex = currentIndex - directionMultiplier;
        if (data && nextIndex >= 0 && nextIndex < data.length) {
          setCurrentIndex(nextIndex);
        }
      }
      topGradientHeight.setValue(0);
      bottomGradientHeight.setValue(0);
    },
  });

  useEffect(() => {
    loadAndAddData();
  }, []);

  useEffect(() => {
    if (data && data.length - currentIndex < 4) {
      const newPage = Math.ceil(data.length / pageSize) + 1;
      if (newPage > lastLoadedPage) {
        loadAndAddData(newPage);
      }
    }
  }, [currentIndex]);

  return (
    <SafeAreaView style={styles.container} {...panResponder.panHandlers}>
      <Animated.View style={[styles.gradientOverlay, { height: topGradientHeight }]}>
        <LinearGradient
          colors={["#1FECFC00", "#1FECFCFF"]}
          style={{ height: "100%" }}
        />
        <Text style={[styles.gradientText, { bottom: 0 }]}>
          {currentIndex === 0 ? scrollMessageEmpty : scrollMessage}
        </Text>
      </Animated.View>

      <Animated.View style={{ bottom: bottomGradientHeight }}>
        {data ? (
          <NFTCollection
            key={data[currentIndex].id}
            collection={data[currentIndex]}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </Animated.View>

      <Animated.View
        style={[
          styles.gradientOverlay,
          { position: "absolute", bottom: 0, height: bottomGradientHeight },
        ]}
      >
        <LinearGradient
          colors={["#1FECFCFF", "#1FECFC00"]}
          style={{ height: "100%" }}
        />
        <Text style={[styles.gradientText, { top: 0 }]}>
          {currentIndex === data?.length - 1
            ? scrollMessageEmpty
            : scrollMessage}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#05071B", // #1E2032
    height: "100%",
  },
  gradientOverlay: {
    position: "relative",
    left: 0,
    right: 0,
    height: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  gradientText: {
    position: "absolute",
    color: "white",
    textAlign: "center",
    width: "100%",
    padding: 18,
  },
});
