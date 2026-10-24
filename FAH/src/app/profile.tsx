import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const COLORS = {
    green: "#10A373",
    background: "#FAF8F5",
    card: "#FFFFFF",
    text: "#3A3F47",
    divider: "#8E8E8E",
};

const achievements = [
    {id: "fah", title: "Do you have FAH?" },
    {id: "chomp", title: "Chomp Machine" },
    {id: "receipt", title: "Receipt Warrior" },
];

const howToItems = [
    "Scan and Upload a Receipt",
    "Manually Add a Receipt",
    "How to Read the Analytics Graph",
    "How to Use Analytics to Help You Budget",
    "How to Set a New Budget",
];

const settingItems = [
    { label: "Recently Deleted Items", icon: "trash-2"},
    { label: "Notifications", icon: "bell" },
    { label: "Sign Out", icon: "log-out" },
] as const;

type RowProps = {
    label : string;
    icon? : React.ComponentProps<typeof Feather>["name"];
    isLast?: boolean;
    onPress? : ()=> void;
};

function ListRow({label, icon, isLast, onPress }: RowProps){
    return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && styles.rowDivider,
        pressed && styles.pressed,
      ]}
    >
        <View style={styles.rowLeft}>
            {icon && <Feather name={icon} size={18} color={COLORS.text} />}
            <Text style={styles.rowText}>{label}</Text>
            </View>
            <Feather name="chevron-right" size={22} color={COLORS.text} />
            </Pressable>
    );
}

export default function ProfileScreen(){
    return (
        <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        >
            <Text style={styles.pageTitle}>Profile</Text>

            {/*Achievements*/}
            <View style={styles.achievementHeader}>
                <Text style={styles.sectionTitle}>Achievements</Text>
            <Pressable style={styles.viewAllTab} onPress={() => console.log("View All")}>
                <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
            </View>
            <View style={[styles.card, styles.achievementCard]}>
                {achievements.map((a)=>(
                    <View key={a.id} style={styles.achievement}>
                        {/*Replace the images once in assets*/}
                        <View style={styles.badgePlaceholder} />
                        <Text style={styles.achievementText}>{a.title}</Text>
                </View>
                ))}
            </View>

            <Text style={styles.sectionTitle}>How To Use</Text>
            <View style={styles.card}>
                {howToItems.map((label, i) => (
                    <ListRow
                    key={label}
                    label={label}
                    isLast={i === howToItems.length - 1}
                    onPress={() => console.log(label)}
                    />
                ))}
            </View>

            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.card}>
                {settingItems.map((item, i) => (
                    <ListRow
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    isLast={i === settingItems.length - 1}
                    onPress={() => console.log(item.label)}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor : COLORS.background,
    },

    content: {
        paddingHorizontal: 24, 
        paddingTop: 40,
        paddingBottom: 120
    },

    pageTitle: {
        fontSize: 30,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 28,
    },

    sectionTitle:{
        fontSize: 24,
        fontWeight: "600",
        color: COLORS.text,
        marginTop: 32,
        marginBottom: 12,
    },

    achievementHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },

    viewAllTab:{
        backgroundColor: COLORS.green,
        paddingHorizontal: 40,
        paddingTop: 10, 
        paddingBottom: 16,
        marginBottom: -6,
        borderTopLeftRadius: 32, 
        borderTopRightRadius: 12,
    },

    viewAllText:{
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        textDecorationLine: "underline",
    },

    card:{
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingHorizontal: 40,
        paddingVertical: 12,
        boxShadow:  "0 2px 12px rgba(0, 0, 0, 0.06)",
    },
    achievementCard:{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 12,
        paddingVertical: 24,
    },
    achievement: {
        alignItems: "center",
        width: 100,
    },

    badgePlaceholder: {
        width: 72,
        height: 80,
        borderRadius: 12,
        backgroundColor: "#E8E8E8",
        marginBottom: 12,
    },

    achievementText:{
        fontSize: 16,
        color: COLORS.text,
        textAlign: "center",
    },

    row:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 20,
    },

    rowDivider:{
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },

    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
        paddingRight: 12,
    },

    rowText:{
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.text,
    },

    pressed: {
        opacity: 0.6,
    }
})