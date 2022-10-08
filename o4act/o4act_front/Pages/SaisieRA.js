import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, createElement, ScrollView } from "react-native-web";
import { loadDataSet } from "../App.js";
import moment from "moment";

export function DateTimePicker(prop) {
  return createElement("input", {
    type: prop.type,
    value: prop.value,
    onChange: prop.onChange,
    style: prop.style,
    max:prop.max,
    min: prop.min,
  });
}

export function SaisieRA({ navigation, route }) {
  const [date,setDate]= useState(moment(new Date()).format("YYYY-MM-DD"));
  const [daterapport, setDaterapport] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const time =new Date().toLocaleTimeString().slice(0,5);

  const [ratext, setRatext] = useState("");
  const [selectdate, setSelectdate] = useState(false);
  const [raRetad, setRetard] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [saisieReu, setSaisieReu] = useState(false);
  const [modaltext, setModaltext] = useState("Le rapport d'activité saisi a été enregisté. ");
  const [errormodal, setErrormodal] = useState(false);

  return (      <ScrollView>

    <View style={styles.container}>
      <View style={styles.tete}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
              fontSize: 18,
              marginTop: 10,
              fontWeight: "bold",
            }}
          >
            Saisir un rapport d'activité
          </Text>{" "}
          <View></View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.dateSaisie}>
          <Text
            style={{
              paddingRight: 50,
              marginTop: 5,
              color: "#bc672c",
              fontSize: 15,
              fontWeight: "bold",
              fontFamily: "sans-serif",
            }}
          >
            Saisir la date du rapport :
          </Text>
          <DateTimePicker
            value={daterapport}
            type="date"
            max={date}
            onChange={(e) => {
              setDaterapport(e.target.value);
              setSelectdate(true);
              console.log(e.target.value);
            }}
          ></DateTimePicker>
        </View>
        {daterapport != date && selectdate ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              margin: 10,
              marginBottom:50,
            }}
          >
            <Text
              style={{
                paddingRight: 50,
                paddingTop: 5,
                marginTop: 5,
                color: "#bc672c",
                fontSize: 15,
                fontWeight: "bold",
                fontFamily: "sans-serif",
              }}
            >
              Motif du retard :
            </Text>
            <TextInput
              style={styles.textinput}
              value={raRetad}
              onChangeText={setRetard}
            ></TextInput>
          </View>
        ) : null}

 
        <View style = {{width : "100%", alignItems : 'center' , justifyContent : 'center' ,}}>

        <TextInput
          style={styles.textbig}
          multiline="true"
          value={ratext}
          onChangeText={setRatext}
        ></TextInput>
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
                <Text style={styles.modalText}>
                  {modaltext}
                </Text>
                  {/* {errormodal ? (
                    <Text style={styles.modalText}>
                      Ajout impossible . {'\n\n'}Un rapport existe déjà à la même date ou Motif de retard non saisi .{'\n\n'}
                    </Text>
                  ) : (
                    <Text style={styles.modalText}>
                      Le rapport d'activité saisi a été enregisté
                    </Text>
                  )} */}

                  <Pressable
                    style={[styles.buttonModal]}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      saisieReu?navigation.goBack():null;
                    }}
                  >
                    <Text style={{ color: "white" }}>Ok</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Pressable
              style={styles.pres}
              onPress={() => {
                let param = {
                  username: route.params.username,
                  radate: date+ ' ' + time,
                  date: daterapport,
                  text: ratext,
                  retard: raRetad,
                };
                if(daterapport > date ){
                  setModaltext("Ajout impossible ! Vous avez saisie une date dans le futur .");
                }
                else if(ratext==""){
                  setModaltext("Ajout impossible ! Vous n'avez pas saisi le rapport .");
                }
                else if (raRetad=="" && daterapport != date){
                  setModaltext("Ajout impossible ! Veuillez saisir le motif du retard .");
                }

                else{
                  loadDataSet("saisieRA", param, (resp) => {
                    if (resp.error == 1) {
                      setModaltext("Ajout impossible ! Un rapport existe déjà à la même date .");
                    }
                    else{
                      setSaisieReu(true);
                      setModaltext("Le rapport d'activité saisi a été enregisté. ");
                    }
                  });
                }




                setModalVisible(true);
              }}
            >
              <Text style={{ color: "white" }}> Créer </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>      </ScrollView>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
  tete: {
    height: 70,
    width: "100%",
    padding: 20,
  },
  headLeft: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  textbig: {
    height: 300,
    width: "70%",
    borderWidth: 1,
    borderColor: "#bc672c",
    borderRadius: 5,
    padding: 8,
    fontFamily: "Cochin",
    fontSize: 20,
  },
  dateSaisie: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    margin: 50,
  },
  textinput: {
    height: 40,
    width: "50%",
    borderWidth: 1,
    borderColor: "#bc672c",
    padding: 7,
    borderRadius: 5,
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
  buttonModal: {
    backgroundColor: "#bc672c",
    borderRadius: 20,
    margin: 10,
    padding: 10,
    elevation: 2,
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
