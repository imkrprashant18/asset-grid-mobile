import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const FRAME_SIZE = SCREEN_W * 0.68;
const CORNER = 24;
const CORNER_THICKNESS = 4;
const CORNER_COLOR = "#00829b";

const UUID_REGEX =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function extractAssetId(data: string): string | null {
  const match = data.match(UUID_REGEX);
  return match ? match[0] : null;
}

function CornerBrackets() {
  const corners = [
    { top: 0, left: 0, borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS },
    { top: 0, right: 0, borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS },
    { bottom: 0, left: 0, borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS },
    { bottom: 0, right: 0, borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS },
  ];
  return (
    <>
      {corners.map((style, i) => (
        <View
          key={i}
          style={[
            {
              position: "absolute",
              width: CORNER,
              height: CORNER,
              borderColor: CORNER_COLOR,
              borderRadius: 3,
            },
            style,
          ]}
        />
      ))}
    </>
  );
}

export default function ScannerQR() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scanLine = useRef(new Animated.Value(0)).current;
  const hasNavigated = useRef(false);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission?.granted]);

  const scanLineStyle = {
    transform: [{
      translateY: scanLine.interpolate({
        inputRange: [0, 1],
        outputRange: [0, FRAME_SIZE - 2],
      }),
    }],
  };

  const handleScan = ({ data }: { data: string }) => {
    if (scanned || hasNavigated.current) return;
    setScanned(true);

    const assetId = extractAssetId(data);
    console.log("QR RAW:", data, "| ID:", assetId);

    if (assetId) {
      hasNavigated.current = true;
      router.push(`/(tabs)/assets/${assetId}`);
      setTimeout(() => {
        setScanned(false);
        hasNavigated.current = false;
      }, 1500);
    } else {
      Alert.alert("Not an Asset QR", `Scanned: ${data}`, [
        { text: "Scan Again", onPress: () => setScanned(false) },
      ]);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-8">
        <Ionicons name="camera-outline" size={64} color="#00829b" />
        <Text className="text-white text-xl font-bold mt-6 mb-2">
          Camera Access Needed
        </Text>
        <Text className="text-gray-400 text-center mb-8">
          Allow camera access to scan asset QR codes
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-primary px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold text-base">Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  const overlayTop = (SCREEN_H - FRAME_SIZE) / 2 - 40;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Camera full screen */}
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      {/* Dark overlay — top */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: overlayTop,
          backgroundColor: "rgba(0,0,0,0.62)",
        }}
      />
      {/* Dark overlay — bottom */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: overlayTop + FRAME_SIZE,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.62)",
        }}
      />
      {/* Dark overlay — left */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: overlayTop,
          left: 0,
          width: (SCREEN_W - FRAME_SIZE) / 2,
          height: FRAME_SIZE,
          backgroundColor: "rgba(0,0,0,0.62)",
        }}
      />
      {/* Dark overlay — right */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: overlayTop,
          right: 0,
          width: (SCREEN_W - FRAME_SIZE) / 2,
          height: FRAME_SIZE,
          backgroundColor: "rgba(0,0,0,0.62)",
        }}
      />

      {/* Scan frame */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: overlayTop,
          left: (SCREEN_W - FRAME_SIZE) / 2,
          width: FRAME_SIZE,
          height: FRAME_SIZE,
        }}
      >
        <CornerBrackets />

        {/* Animated scan line */}
        {!scanned && (
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 8,
                right: 8,
                height: 2,
                borderRadius: 2,
                backgroundColor: CORNER_COLOR,
                shadowColor: CORNER_COLOR,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.9,
                shadowRadius: 6,
                elevation: 6,
              },
              scanLineStyle,
            ]}
          />
        )}

        {/* Scanned success indicator */}
        {scanned && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#00829b",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="checkmark" size={32} color="#fff" />
            </View>
          </View>
        )}
      </View>

      {/* Top bar */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 0,
          right: 0,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <Text
          style={{
            flex: 1,
            textAlign: "center",
            color: "#fff",
            fontSize: 17,
            fontWeight: "700",
          }}
        >
          Scan Asset QR
        </Text>

        {/* Torch toggle */}
        <Pressable
          onPress={() => setTorch((t) => !t)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: torch
              ? "rgba(0,130,155,0.5)"
              : "rgba(255,255,255,0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={torch ? "flash" : "flash-outline"}
            size={22}
            color="#fff"
          />
        </Pressable>
      </View>

      {/* Bottom sheet */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + 24,
          paddingTop: 24,
          paddingHorizontal: 32,
          backgroundColor: "rgba(0,0,0,0.75)",
          alignItems: "center",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        <View
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.2)",
            marginBottom: 16,
          }}
        />
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 6 }}>
          Point at an Asset QR Code
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textAlign: "center" }}>
          Hold your camera steady. The QR will be detected automatically.
        </Text>
      </View>
    </View>
  );
}
