import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { InventoryItemCard } from "@/components/InventoryItemCard";
import { COLORS, RADIUS, SHADOW } from "@/lib/theme";
import { Typography } from "@/constants/theme";

const ACTION_WIDTH = 120;
const SWIPE_THRESHOLD = 60;

type SwipeableItemProps = {
  itemName: string;
  quantity: number;
  category: string;
  createdAt: string;
  onToss: () => void;
  onChomp: () => void;
  onTap: () => void;
};

export function SwipeableItem({ onToss, onChomp, onTap, ...item }: SwipeableItemProps) {
  const offset = useSharedValue(0);
  const start = useSharedValue(0);

  const close = () => {
    offset.value = withTiming(0);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onBegin(() => {
      start.value = offset.value;
    })
    .onUpdate((e) => {
      offset.value = Math.max(-ACTION_WIDTH, Math.min(ACTION_WIDTH, start.value + e.translationX));
    })
    .onEnd(() => {
      const target =
        offset.value > SWIPE_THRESHOLD ? ACTION_WIDTH : offset.value < -SWIPE_THRESHOLD ? -ACTION_WIDTH : 0;
      offset.value = withTiming(target);
    });

  const tap = Gesture.Tap().onEnd(() => {
    if (offset.value !== 0) offset.value = withTiming(0);
    else scheduleOnRN(onTap);
  });

  const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  return (
    <View style={styles.clip}>
      <Animated.View style={[styles.row, rowStyle]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Toss one ${item.itemName}`}
          onPress={() => {
            close();
            onToss();
          }}
          style={[styles.action, styles.toss]}
        >
          <Feather name="trash-2" size={22} color={COLORS.white} />
          <Text style={styles.actionText}>Toss</Text>
        </Pressable>

        <GestureDetector gesture={Gesture.Race(pan, tap)}>
          <View style={styles.content}>
            <InventoryItemCard {...item} />
          </View>
        </GestureDetector>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Chomp one ${item.itemName}`}
          onPress={() => {
            close();
            onChomp();
          }}
          style={[styles.action, styles.chomp]}
        >
          <MaterialCommunityIcons name="silverware-fork-knife" size={22} color={COLORS.white} />
          <Text style={styles.actionText}>Chomp</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
    borderRadius: RADIUS.rounded,
    backgroundColor: COLORS.pageSecondary,
    ...SHADOW,
  },
  row: {
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  action: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  toss: {
    left: -ACTION_WIDTH,
    backgroundColor: "#FF4040",
  },
  chomp: {
    right: -ACTION_WIDTH,
    backgroundColor: "#FF9040",
  },
  actionText: {
    ...Typography.bodyMdBold,
    color: COLORS.white,
  },
});
