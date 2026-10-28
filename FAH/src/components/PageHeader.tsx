import { StyleSheet, Text, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";

type Props = {
  title?: string;
  userName?: string;
};

function getGreeting(userName: string) {
  const hour = new Date().getHours();
  let timeGreeting: string;

  if (hour >= 5 && hour < 12) {
    timeGreeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    timeGreeting = "Good evening";
  } else {
    timeGreeting = "Good night";
  }

  return `${timeGreeting} ${userName}!`;
}

export default function PageHeader({ title, userName = "Cronch" }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title} accessibilityRole="header">
        {title || getGreeting(userName)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
  },
  title: {
    color: Colors.textDefault,
    fontFamily: Fonts.quicksandBold,
    fontSize: 24,
    lineHeight: 32,
    textTransform: "capitalize",
  },
});
