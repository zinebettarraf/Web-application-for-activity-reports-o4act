import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function DisplayRA({ navigation, route }) {
  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.head}>
        <View style={styles.headLeft}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={40}
              color={"#002447"}
              style={StyleSheet.pres}
            ></Ionicons>
          </Pressable>

          <Text style={styles.headtext}>
            {"Date du rapport : " + route.params.date}
          </Text>
        </View>
        <View style={styles.headRight}>
          <Text style={styles.headtext}>
            {"Auteur : " + route.params.username}
          </Text>
        </View>
      </View>
      <View>
        <Text style={styles.headtext}>
            {"Date de la rédaction du rapport : " + route.params.dater}
          </Text>
        </View>
      <View style={styles.textcadre}>
      <Text style={{ color: "#bc672c", fontSize: 18  }}> Rapport</Text>
        <Text style={styles.text}> {route.params.text}</Text>
      </View>
      {route.params.retard != "" ? (
        <View style={styles.textcadre}>
          <Text style={{ color: "#bc672c", fontSize: 18  }}> Motif de retard </Text>
          <Text style={styles.text}> {route.params.retard}</Text>
        </View>
      ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 40,
    marginTop: 20,
  },
  headtext: {
    color: "#002447",
    fontSize: "15px",
    fontFamily: "Roboto Condensed",
    fontWeight: "bold",
    margin: 10,
    padding: 10,
  },
  headLeft: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textcadre: {
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    shadowColor: "#000",
    width: "100%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    padding: 50,
  },
});
