import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  CheckBox,
  Alert,
  Modal,
  Switch,
} from "react-native";
import { TextInput } from "react-native-web";
import { loadDataSet } from "../App.js";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

export function AjoutUtilisateur({ navigation, route }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconfirm, setPasswordconfirm] = useState("");
  const [samepass, setSamepass] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setdate] = useState(moment(new Date()).format("DD-MM-YYYY"));
  const [modalerror, setModalerror] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.tete}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={40}
            color={"#002447"}
            style={{ paddingTop: 10 }}
          ></Ionicons>
        </Pressable>
        <Text
          style={{
            color: "#002447",
            textAlign: "center",
            flex: 2,
            fontSize: 18,
            marginTop:25,
            fontWeight:"bold",
          }}
        >
          Créer un compte Utilisateur
        </Text>
      </View>

      <View style={styles.info}>
        <View style={styles.Utilisateur}>
          <Text> Nom de l'utilisateur </Text>
          <TextInput
            style={styles.textinput}
            value={username}
            onChangeText={setUsername}
          ></TextInput>
        </View>
        <View style={styles.Utilisateur}>
          <Text> Mot de passe </Text>
          <TextInput
            style={styles.textinput}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          ></TextInput>
        </View>
        <View style={styles.Utilisateur}>
          <Text> Confirmer le mot de passe </Text>
          <TextInput
            style={styles.textinput}
            value={passwordconfirm}
            secureTextEntry={true}
            onChangeText={setPasswordconfirm}
          ></TextInput>
        </View>
        {samepass == 1 ? (
          <Text style={{ color: "red", marginTop: 10 }}>
            {"Les deux mots de passe que vous avez entré ne sont pas les mêmes"}
          </Text>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 50,
          }}
        >
          <Switch
            trackColor={{ false: "#767577", true: "#f2dcc5" }}
            thumbColor={isEnabled ? "##bc672c" : "#bc672c"}
            ios_backgroundColor="#3e3e3e"
            tintColor="#ff0000"
            onValueChange={(selval) => {
              toggleSwitch(selval);
            }}
            value={isEnabled}
            style={{ marginRight: 10, marginLeft: 10 }}
          />
          <Text style={{ color: "#002447", fontSize: 13 }}>
            Droits d'Admin accordés :
          </Text>
        </View>
        <View style={{ width: "100%", alignItems: "flex-end" }}>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {modalerror ? (
                    <Text style={styles.modalText}>
                      Ajout impossible . L'utilisateur existe déjà.
                    </Text>
                  ) : (
                    <Text style={styles.modalText}>
                      L'ajout du nouveau utilisateur est réussi
                    </Text>
                  )}

                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>OK</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Pressable
              style={styles.pres}
              onPress={() => {
                if (password != passwordconfirm) {
                  setSamepass(1);
                } else {
                  let param = {
                    isEnabled,
                    username,
                    password,
                  };
                  loadDataSet("ajoutUser", param, (resp) => {
                    if (resp.error == 1) {
                      setModalerror(true);
                    }
                    setModalVisible(true);
                  });
                }
              }}
            >
              <Text style={{ color: "white", padding: 1 }}>Créer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  tete: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  info: {
    marginTop:50,
    width: "50%",
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
    borderColor: "#bc672c",
    padding: 7,
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 50,
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  Utilisateur: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center", //allign /line depend n flexDirection
    justifyContent: "space-between", // allign /col
    margin: 10,
  },
  pres: {
    justifyContent: "center",
    backgroundColor: "#bc672c",
    borderRadius: 20,
    margin: 10,
    padding: 10,
    elevation: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
