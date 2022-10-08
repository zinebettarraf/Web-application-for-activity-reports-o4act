import { useState, useContext, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-web";
import { loadDataSet, StoreContext } from "../App.js";

export function login({ navigation, route }) {
  const [nom, setNom] = useState("");
  const [mdp, setMdp] = useState("");
  const [connected, setConnected] = useState(0);
  const setLogout = useContext(StoreContext).setLogout;
  const setLogoutFunction = useContext(StoreContext).setLogoutFunction;
  const setUsername = useContext(StoreContext).setUsername;
  const [enter, setEnter] = useState(false);

  useEffect(() => {

    const handleKeyDown = (event) => {
      if (event.key == "Enter") {
        let param = {
          username: nom,
          password: mdp,
        };
        loadDataSet("login", param, (res) => {
          console.log(param);
          console.log(res);
          if (res.response == false) {
            setConnected(1);
          } else {
            setConnected(2);
            setLogout(true);
            setUsername(nom);
            setLogoutFunction({
              function: () => {
                navigation.navigate("login");
              },
            });
            navigation.navigate("acceuil", {
              username: nom,
              role: res.role,
            });
          }
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nom,mdp]);

  return (
    <View style={styles.container}>
      <View style={styles.login}>
        <View style={styles.Utilisateur}>
          <Text> Nom de l'utilisateur </Text>
          <TextInput
            style={styles.textinput}
            value={nom}
            onChangeText={(name) => {
              setNom(name);
            }}
          ></TextInput>
        </View>
        <View style={styles.Utilisateur}>
          <Text> Mot de passe </Text>
          <TextInput
            style={styles.textinput}
            secureTextEntry={true}
            value={mdp}
            onChangeText={(psw) => {
              setMdp(psw);
            }}
          ></TextInput>
        </View>
        {connected == 1 ? (
          <Text style={{ color: "red", marginTop: 10 }}>
            {"Le nom de l'utilisateur ou le mot de passe sont incorrects "}
          </Text>
        ) : null}

        <View style={{ width: "100%", alignItems: "flex-end" }}>
          <Pressable
            style={styles.pres}
            onPress={() => {
              let param = {
                username: nom,
                password: mdp,
              };

              loadDataSet("login", param, (res) => {
                if (res.response == false) {
                  setConnected(1);
                } else {
                  setConnected(2);
                  setLogout(true);
                  setUsername(nom);
                  setLogoutFunction({
                    function: () => {
                      navigation.navigate("login");
                    },
                  });
                  navigation.navigate("acceuil", {
                    username: nom,
                    role: res.role,
                  });
                }
              });
            }}
          >
            <Text style={{ color: "white" }}>Se connecter</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  login: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    paddingLeft: 70,
    paddingRight: 70,
    paddingTop: 30,
    paddingBottom: 20,
  },
  textinput: {
    height: 40,
    width: "50%",
    borderWidth: 1,
    padding: 7,
    borderRadius: 5,
  },
  Utilisateur: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center", //allign /line depend n flexDirection
    justifyContent: "space-between", // allign /col
    margin: 10,
  },
  pres: {
    backgroundColor: "#bc672c",
    width: 100,
    height: 40,
    margin: 20,
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
