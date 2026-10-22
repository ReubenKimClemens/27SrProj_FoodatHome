import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/theme";

type Props = {
  value: number;
  max: number;
  color: string;
};

export default function ProgressBar({ value, max, color }: Props) {
  const percentage = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percentage) }}
    >
      <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 6,
    backgroundColor: Colors.progressTrack,
    borderRadius: 999,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 999,
  },
});
