import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
  Linking,
} from "react-native";
import { NFTUserCollection, NFTUserCollectionItem } from "../api/serverData";
import { useSwipeX } from "../hooks/useSwipe";
import { Col, Grid, Row } from "react-native-easy-grid";
import Button from "./Button";
import Eth from "../assets/eth.svg";

interface ComponentProps {
  collection: NFTUserCollection;
}

export default function NFTCollection({ collection }: ComponentProps) {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [activeItem, setActiveItem] = useState(collection.items[0]);
  const imagesMarginLeft = useRef(new Animated.Value(0));
  const windowDimensions = Dimensions.get("window");
  const imagesCount = 4;

  function onSwipeRight() {
    setActiveItemIndex(Math.max(0, activeItemIndex - 1));
  }

  function onSwipeLeft() {
    setActiveItemIndex(Math.min(imagesCount, activeItemIndex + 1));
  }

  function onBrowseCollectionClick() {
    Linking.openURL(collection.collection_url);
  }

  function onImageClick(item: NFTUserCollectionItem) {
    Linking.openURL(item.item_url);
  }

  useEffect(() => {
    setActiveItem(collection.items[activeItemIndex] || activeItem);
    Animated.timing(imagesMarginLeft.current, {
      toValue: activeItemIndex * -windowDimensions.width,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [activeItemIndex]);

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeX({
    offset: 40,
    onSwipeLeft,
    onSwipeRight,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image
            style={styles.avatarImage}
            source={{ uri: collection.creator_pic }}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.creatorName}>{collection.creator_name}</Text>
          <Text style={styles.price}>
            <Eth /> {activeItem.price_eth}{" "}
            <Text style={styles.priceUSD}>(${activeItem.price_usd})</Text>
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.images,
          { width: windowDimensions.width, height: windowDimensions.width },
        ]}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Animated.View
          style={[
            styles.imagesContainer,
            { transform: [{ translateX: imagesMarginLeft.current }] },
          ]}
        >
          {collection.items.slice(0, 4).map((item, idx) => (
            <TouchableOpacity
              style={styles.imagesImage}
              onPress={() => onImageClick(item)}
              key={idx}
            >
              <Image
                resizeMethod="scale"
                resizeMode="stretch"
                style={{ width: "100%", height: "100%" }}
                source={{ uri: item.image }}
              />
            </TouchableOpacity>
          ))}
          <View style={styles.imagesImage}>
            <View style={styles.imagesLastElement}>
              <Text style={styles.imagesLastElementHeader}>
                Browse all NFTs from this collection
              </Text>
              <Button onPress={onBrowseCollectionClick}>
                <Text style={{ color: "white" }}>Browse Collection</Text>
              </Button>
            </View>
            <Grid>
              <Row>
                {collection.items.slice(0, 2).map((item, idx) => (
                  <Col key={idx}>
                    <Image
                      resizeMethod="scale"
                      resizeMode="stretch"
                      style={[styles.imagesImage, { width: "100%" }]}
                      key={idx}
                      source={{ uri: item.image }}
                    />
                  </Col>
                ))}
              </Row>
              <Row>
                {collection.items.slice(2, 4).map((item, idx) => (
                  <Col key={idx}>
                    <Image
                      resizeMethod="scale"
                      resizeMode="stretch"
                      style={[styles.imagesImage, { width: "100%" }]}
                      key={idx}
                      source={{ uri: item.image }}
                    />
                  </Col>
                ))}
              </Row>
            </Grid>
          </View>
        </Animated.View>
        <View style={styles.imagesDotsOverlay}>
          <View style={styles.imagesDotsContainer}>
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <TouchableOpacity
                  onPress={() => {
                    setActiveItemIndex(idx);
                  }}
                  key={idx}
                >
                  <View
                    style={[
                      styles.imagesDot,
                      {
                        backgroundColor:
                          idx === activeItemIndex ? "white" : undefined,
                      },
                    ]}
                  ></View>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </View>
      <View style={styles.description}>
        <Text style={styles.descriptionText}>{collection.description}</Text>
        <Button style={{ marginTop: 32 }} onPress={onBrowseCollectionClick}>
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            Browse Collection
          </Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // backgroundColor: '#fa0',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    // alignItems: 'center',
  },
  avatar: {
    overflow: "hidden",
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  headerText: {
    marginLeft: 10,
  },
  creatorName: {
    color: "#1FECFC",
    fontSize: 16,
  },
  price: {
    color: "white",
    fontSize: 14,
  },
  priceUSD: {
    color: "#CDCDCD",
    fontSize: 10,
  },
  images: {
    overflow: "hidden",
  },
  imagesContainer: {
    height: "100%",
    width: "500%",
    flexDirection: "row",
  },
  imagesImage: {
    height: "100%",
    width: "20%",
  },
  imagesLastElement: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagesLastElementHeader: {
    color: "white",
    fontSize: 32,
    textAlign: "center",
  },
  imagesDotsOverlay: {
    position: "absolute",
    width: "100%",
    height: 12,
    marginBottom: 12,
    bottom: 0,
    zIndex: 2,
    alignItems: "center",
  },
  imagesDotsContainer: {
    flexDirection: "row",
  },
  imagesDot: {
    borderRadius: 6,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "white",
    height: 12,
    width: 12,
    marginHorizontal: 6,
  },
  description: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  descriptionText: {
    color: "#F3F3F3",
  },
});
