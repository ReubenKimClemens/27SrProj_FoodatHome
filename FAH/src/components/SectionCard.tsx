import { Link, type Href } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Fonts, Shadows } from "@/constants/theme";

type Props = {
  title: string;
  linkText: string;
  linkHref: Href;
  children: ReactNode;
};

export default function SectionCard({ title, linkText, linkHref, children }: Props) {
  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <Link href={linkHref} asChild>
          <Pressable style={styles.linkBox} hitSlop={8}>
            <Text style={styles.linkText}>{linkText}</Text>
          </Pressable>
        </Link>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: Colors.textDefault,
    fontFamily: Fonts.quicksandBold,
    fontSize: 20,
    lineHeight: 24,
    textTransform: "capitalize",
  },
  linkBox: {
    paddingVertical: 8,
    paddingLeft: 32,
    paddingRight: 24,
    backgroundColor: Colors.brandPrimary,
    borderTopLeftRadius: 360,
    borderTopRightRadius: 16,
  },
  linkText: {
    color: Colors.textOnAction,
    fontFamily: Fonts.nunitoBold,
    fontSize: 16,
    lineHeight: 20,
    textDecorationLine: "underline",
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: Colors.bgPageSecondary,
    boxShadow: Shadows.card,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
