import React, { useState, useEffect } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  PanResponder,
} from "react-native";
import NFTCollection from "../components/NFTCollection";
import { LinearGradient } from "expo-linear-gradient";
import {
  NFTCollectionsState,
} from "../store/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getNFTCollection } from "../store/slices/NFTSlice";

export default function MainPage() {
  const appDispatch = useAppDispatch();
  const { collections, isLoading, error } = useAppSelector<NFTCollectionsState>(
    (state) => state.nft
  );

  useEffect(() => {
    appDispatch(getNFTCollection(1));
  }, [appDispatch]);

  const pageSize = 10;
  const [lastLoadedPage, setLastLoadedPage] = useState(0);
  const scrollMessage = "Scroll for next gem";
  const scrollMessageEmpty = "Nothing here..";

  async function loadAndAddData(page = 1) {
    const prevPage = lastLoadedPage;
    setLastLoadedPage(page);
    const loadedData = await getNFTCollection(page);
    if (!loadedData) {
      setLastLoadedPage(prevPage);
      return;
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
        if (collections && nextIndex >= 0 && nextIndex < collections.length) {
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
    if (collections && collections.length - currentIndex < 4) {
      const newPage = Math.ceil(collections.length / pageSize) + 1;
      if (newPage > lastLoadedPage) {
        loadAndAddData(newPage);
      }
    }
  }, [currentIndex]);

  return (
    <SafeAreaView style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={[styles.gradientOverlay, { height: topGradientHeight }]}
      >
        <LinearGradient
          colors={["#1FECFC00", "#1FECFCFF"]}
          style={{ height: "100%" }}
        />
        <Text style={[styles.gradientText, { bottom: 0 }]}>
          {currentIndex === 0 ? scrollMessageEmpty : scrollMessage}
        </Text>
      </Animated.View>

      <Animated.View style={{ bottom: bottomGradientHeight }}>
        {!isLoading && collections.length ? (
          <NFTCollection
            key={collections[currentIndex].id}
            collection={collections[currentIndex]}
          />
        ) : (
          <Text style={[styles.preloaderText]}>Loading...</Text>
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
          {currentIndex === collections?.length - 1
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
    overflow: "hidden",
  },
  gradientText: {
    position: "absolute",
    color: "white",
    textAlign: "center",
    width: "100%",
    padding: 18,
  },
  preloaderText: {
  color:"white",
  fontSize: 30,
  }
});
