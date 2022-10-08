import { useEffect, useState } from "react";
import moment from "moment";
import { Pressable, StyleSheet, Text, View, Switch } from "react-native";
import {
  AntDesign,
  EvilIcons,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Searchbar, DataTable, FAB } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { loadDataSet } from "../App.js";
import { ScrollView, createElement, TextInput } from "react-native-web";
import { useIsFocused } from "@react-navigation/native";

export function DateTimePicker(prop) {
  return createElement("input", {
    type: prop.type,
    value: prop.value,
    onChange: prop.onChange,
    style: prop.style,
    min: prop.min,
  });
}

let data;

export function acceuil({ navigation, route }) {
  const today = new Date();
  const firstDay = moment(
    new Date(today.setDate(today.getDate() - today.getDay() + 1))
  ).format("YYYY-MM-DD");
  const lastDay = moment(
    new Date(today.setDate(today.getDate() - today.getDay() + 7))
  ).format("YYYY-MM-DD");
  const firstDaylastweek = moment(
    new Date(today.setDate(today.getDate() - today.getDay() - 13))
  ).format("YYYY-MM-DD");
  const lastDaylastweek = moment(
    new Date(today.setDate(today.getDate() - today.getDay() + 7))
  ).format("YYYY-MM-DD");
  const date = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [pages, setPages] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);
  const [hideheader, setHideheader] = useState(true);
  const [hideserach, setHidesearch] = useState(false);

  const [dateA, setDateA] = useState(lastDay);
  const [dateDe, setDateDe] = useState(firstDay);
  const [selecteddateA, setSelecteddateA] = useState(false);
  const [selecteddateDe, setSelecteddateDe] = useState(false);
  const [motscle, setMotscle] = useState("");
  const [employe, setEmploye] = useState(
    route.params.role ? "" : route.params.username
  );
  const [isSelectedtoday, setSelectiontoday] = useState(false);
  const [isSelectedweek, setSelectionweeek] = useState(false);
  const [isSelectedlastweek, setSelectionlastweek] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [tableUser, setTableUser] = useState([]);
  const isFocused = useIsFocused();
  const [lastWorkingDate, setLastWorkingDate] = useState("");

  let page_bis = page;
  let offset;

  useEffect(() => {
    loadDataSet("lastDate", {}, (resp) => {
      setLastWorkingDate(resp["lastDate"]);
      setDateA(moment(resp["lastDate"]).format("YYYY-MM-DD"))
      setDateDe(moment(resp["lastDate"]).format("YYYY-MM-DD"))
      offset = limit * (page_bis - 1);
      if (isFocused) {
        let paramPage = {
          employe,
          motscle,
          isSelectedtoday,
          isSelectedweek,
          isSelectedlastweek,
          selecteddateA: true,
          selecteddateDe: true,
          dateDe: resp["lastDate"]==""?today:resp["lastDate"],
          dateA: resp["lastDate"]==""?today:resp["lastDate"],
          offset: offset,
          limit: limit,
          setNbrows: true,
        };
        loadDataSet("getUsers", {}, (reponse) => {
          setTableUser(reponse);
        });
        loadDataSet("getPage", paramPage, (reponse) => {
          if (reponse[0] == 0) {
            setPages(1);
          } else {
            setPages(
              reponse[0] % limit == 0
                ? Math.floor(reponse[0] / limit)
                : Math.floor(reponse[0] / limit) + 1
            );
          }
          data = reponse[1];
          setTableData(reponse[1]);
        });
      }
    });
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.bar}>
          {hideserach ? null : (
            <Searchbar
              placeholder="Rechercher"
              onChangeText={(textS) => {
                setSearch(textS);
                if (textS.length > 3 || textS.length == 0) {
                  setSelecteddateA(false);
                  setSelecteddateDe(false);
                  setSelectionlastweek(false);
                  setSelectiontoday(false);
                  setSelectionweeek(false);
                  setPage(1);
                  page_bis = 1;
                  offset = limit * (page_bis - 1);
                  let paramSearchbar = {
                    limit,
                    offset,
                    employe,
                    motscle: textS,
                    isSelectedtoday: false,
                    isSelectedweek: false,
                    isSelectedlastweek: false,
                    selecteddateA: false,
                    selecteddateDe: false,
                    dateDe,
                    dateA,
                    setNbrows: true,
                  };
                  if (
                    moment(textS, "DD/MM/YYYY", true).isValid() ||
                    moment(textS, "DD-MM-YYYY", true).isValid()
                  ) {
                    // traitement de la recherche par date en raccourci
                    paramSearchbar.motscle = "";
                    paramSearchbar.selecteddateA = true;
                    paramSearchbar.selecteddateDe = true;
                    setMotscle("");
                    setSelecteddateA(true);
                    setSelecteddateDe(true);
                    if (moment(textS, "DD/MM/YYYY", true).isValid()) {
                      paramSearchbar.dateA = moment(textS, "DD/MM/YYYY").format(
                        "YYYY-MM-DD"
                      );
                      paramSearchbar.dateDe = moment(
                        textS,
                        "DD/MM/YYYY"
                      ).format("YYYY-MM-DD");
                    } else {
                      paramSearchbar.dateA = moment(textS, "DD-MM-YYYY").format(
                        "YYYY-MM-DD"
                      );
                      paramSearchbar.dateDe = moment(
                        textS,
                        "DD-MM-YYYY"
                      ).format("YYYY-MM-DD");
                    }
                    setDateA(paramSearchbar.dateA);
                    setDateDe(paramSearchbar.dateDe);
                  }

                  loadDataSet("getPage", paramSearchbar, (reponse) => {
                    if (reponse[0] == 0) {
                      setPages(1);
                    } else {
                      setPages(
                        reponse[0] % limit == 0
                          ? Math.floor(reponse[0] / limit)
                          : Math.floor(reponse[0] / limit) + 1
                      );
                    }
                    setTableData(reponse[1]);
                  });
                }
              }}
              value={search}
              style={styles.searchbar}
              clearIcon={{ style: { padding: 10 } }}
            />
          )}
          <Pressable
            style={styles.pressearchbar}
            onPress={() => {
              setHideheader(false);
              setHidesearch(true);
              setSelectiontoday(false);
              setSelectionweeek(false);
              setSelectionlastweek(false);
              setSelecteddateA(false);
              setSelecteddateDe(false);
            }}
          >
            <Ionicons
              name="filter-outline"
              size={25}
              color={"#575757"}
            ></Ionicons>
          </Pressable>
        </View>
        {!hideheader ? (
          <View style={styles.headersearch}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Pressable
                  onPress={() => {
                    setHideheader(true);
                    setHidesearch(false);
                    setSelectionlastweek(false);
                    setSelectiontoday(false);
                    setSelectionweeek(false);
                  }}
                >
                  <Ionicons
                    name="close-circle"
                    color={"#ff3333"}
                    size={20}
                  ></Ionicons>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setEmploye(route.params.role ? "" : route.params.username);
                    setSelecteddateA(false);
                    setSelecteddateDe(false);
                    setMotscle("");
                    setSelectionlastweek(false);
                    setSelectiontoday(false);
                    setSelectionweeek(false);
                    setDateA(lastDay);
                    setDateDe(firstDay);
                    setPage(1);
                    page_bis = 1;
                    offset = limit * (page_bis - 1);
                    let param = {
                      employe: route.params.role ? "" : route.params.username,
                      motscle: "",
                      isSelectedtoday: false,
                      isSelectedweek: false,
                      isSelectedlastweek: false,
                      selecteddateA: false,
                      selecteddateDe: false,
                      dateDe: firstDay,
                      dateA: lastDay,
                      offset,
                      limit,
                      setNbrows: true,
                    };
                    loadDataSet("getPage", param, (reponse) => {
                      if (reponse[0] == 0) {
                        setPages(1);
                      } else {
                        setPages(
                          reponse[0] % limit == 0
                            ? Math.floor(reponse[0] / limit)
                            : Math.floor(reponse[0] / limit) + 1
                        );
                      }
                      setTableData(reponse[1]);
                    });
                  }}
                >
                  <Ionicons
                    name="md-reload-circle"
                    color={"#ff9933"}
                    size={20}
                    style={{ marginLeft: 3 }}
                  ></Ionicons>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setSelectionlastweek(false);
                    setSelectiontoday(false);
                    setSelectionweeek(false);
                    setPage(1);
                    page_bis = 1;
                    offset = limit * (page_bis - 1);
                    let param = {
                      setNbrows: true,
                      employe,
                      motscle,
                      isSelectedtoday: false,
                      isSelectedweek: false,
                      isSelectedlastweek: false,
                      selecteddateA,
                      selecteddateDe,
                      dateDe,
                      dateA,
                      offset,
                      limit,
                    };
                    loadDataSet("getPage", param, (reponse) => {
                      if (reponse[0] == 0) {
                        setPages(1);
                      } else {
                        setPages(
                          reponse[0] % limit == 0
                            ? Math.floor(reponse[0] / limit)
                            : Math.floor(reponse[0] / limit) + 1
                        );
                      }
                      setTableData(reponse[1]);
                    });
                  }}
                >
                  <Ionicons
                    name="search-circle"
                    color={"#47d147"}
                    size={22}
                    style={{ marginLeft: 3, marginTop: -2 }}
                  ></Ionicons>
                </Pressable>
              </View>
              <Text
                style={{ color: "#1e1e2f", fontSize: 15, fontWeight: "bold" }}
              >
                Filtre de recherche avancé
              </Text>
              <View></View>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <Text style={{ marginRight: 30 }}>De : </Text>
                <DateTimePicker
                  value={dateDe}
                  type="date"
                  onChange={(e) => {
                    setSelecteddateDe(true);
                    setDateDe(e.target.value);
                  }}
                ></DateTimePicker>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginRight: 30 }}>À : </Text>
                {console.log(dateA)}
                <DateTimePicker
                  value={dateA}
                  type="date"
                  onChange={(e) => {
                    setSelecteddateA(true);
                    setDateA(e.target.value);
                  }}
                ></DateTimePicker>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text> Mots-clés: </Text>
                <TextInput
                  style={styles.textinput}
                  value={motscle}
                  onChangeText={(e) => {
                    setMotscle(e);
                  }}
                  Ò
                ></TextInput>
              </View>
              {route.params.role ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ marginRight: 50 }}> {"Employé(e): "}</Text>
                  <Picker
                    style={styles.pickerStyle}
                    selectedValue={employe}
                    onValueChange={setEmploye}
                  >
                    <Picker.Item label="" value="" />
                    {tableUser.map((val, index) => {
                      return <Picker.Item label={val} value={val} />;
                    })}
                  </Picker>
                </View>
              ) : null}
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "50%",
                justifyContent: "space-between",
                marginLeft: 350,
                marginTop: 25,
              }}
            >
              {" "}
              <Pressable
                style={styles.pressearch}
                onPress={() => {
                  setSelectiontoday(false);
                  setSelectionlastweek(false);
                  setSelectionweeek(false);
                  setSelecteddateDe(true);
                  setSelecteddateA(true);
                  setDateA(moment(lastWorkingDate).format("YYYY-MM-DD"));
                  setDateDe(moment(lastWorkingDate).format("YYYY-MM-DD"));
                  setPage(1);
                  page_bis = 1;
                  offset = limit * (page_bis - 1);
                  let param = {
                    setNbrows: true,
                    employe,
                    motscle,
                    isSelectedtoday: false,
                    isSelectedweek: false,
                    isSelectedlastweek: false,
                    selecteddateA: true,
                    selecteddateDe: true,
                    dateDe: lastWorkingDate,
                    dateA: lastWorkingDate,
                    offset,
                    limit,
                  };
                  loadDataSet("getPage", param, (reponse) => {
                    if (reponse[0] == 0) {
                      setPages(1);
                    } else {
                      setPages(
                        reponse[0] % limit == 0
                          ? Math.floor(reponse[0] / limit)
                          : Math.floor(reponse[0] / limit) + 1
                      );
                    }
                    setTableData(reponse[1]);
                  });
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>
                  Dernier jour travaillé
                </Text>
              </Pressable>
              <Pressable
                style={styles.pressearch}
                onPress={() => {
                  setSelectiontoday(true);
                  setSelectionlastweek(false);
                  setSelectionweeek(false);
                  setSelecteddateDe(false);
                  setSelecteddateA(false);
                  setDateA(moment(new Date()).format("YYYY-MM-DD"));
                  setDateDe(moment(new Date()).format("YYYY-MM-DD"));
                  setPage(1);
                  page_bis = 1;
                  offset = limit * (page_bis - 1);
                  let param = {
                    setNbrows: true,
                    employe,
                    motscle,
                    isSelectedtoday: true,
                    isSelectedweek: false,
                    isSelectedlastweek: false,
                    selecteddateA: false,
                    selecteddateDe: false,
                    dateDe,
                    dateA,
                    offset,
                    limit,
                  };
                  loadDataSet("getPage", param, (reponse) => {
                    if (reponse[0] == 0) {
                      setPages(1);
                    } else {
                      setPages(
                        reponse[0] % limit == 0
                          ? Math.floor(reponse[0] / limit)
                          : Math.floor(reponse[0] / limit) + 1
                      );
                    }
                    setTableData(reponse[1]);
                  });
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>
                  Aujourd'hui
                </Text>
              </Pressable>
              <Pressable
                style={styles.pressearch}
                onPress={() => {
                  setSelectiontoday(false);
                  setSelectionlastweek(false);
                  setSelectionweeek(true);
                  setSelecteddateDe(false);
                  setSelecteddateA(false);
                  setDateA(lastDay);
                  setDateDe(firstDay);
                  setPage(1);
                  page_bis = 1;
                  offset = limit * (page_bis - 1);
                  let param = {
                    setNbrows: true,
                    employe,
                    motscle,
                    isSelectedtoday: false,
                    isSelectedweek: true,
                    isSelectedlastweek: false,
                    selecteddateA: false,
                    selecteddateDe: false,
                    dateDe,
                    dateA,
                    offset,
                    limit,
                  };
                  loadDataSet("getPage", param, (reponse) => {
                    if (reponse[0] == 0) {
                      setPages(1);
                    } else {
                      setPages(
                        reponse[0] % limit == 0
                          ? Math.floor(reponse[0] / limit)
                          : Math.floor(reponse[0] / limit) + 1
                      );
                    }
                    setTableData(reponse[1]);
                  });
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>
                  Cette semaine
                </Text>
              </Pressable>
              <Pressable
                style={styles.pressearch}
                onPress={() => {
                  setSelectiontoday(false);
                  setSelectionlastweek(true);
                  setSelectionweeek(false);
                  setSelecteddateDe(false);
                  setSelecteddateA(false);
                  setDateA(lastDaylastweek);
                  setDateDe(firstDaylastweek);
                  setPage(1);
                  page_bis = 1;
                  offset = limit * (page_bis - 1);
                  let param = {
                    setNbrows: true,
                    employe,
                    motscle,
                    isSelectedtoday: false,
                    isSelectedweek: false,
                    isSelectedlastweek: true,
                    selecteddateA: false,
                    selecteddateDe: false,
                    dateDe,
                    dateA,
                    offset,
                    limit,
                  };
                  loadDataSet("getPage", param, (reponse) => {
                    if (reponse[0] == 0) {
                      setPages(1);
                    } else {
                      setPages(
                        reponse[0] % limit == 0
                          ? Math.floor(reponse[0] / limit)
                          : Math.floor(reponse[0] / limit) + 1
                      );
                    }
                    setTableData(reponse[1]);
                  });
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>
                  La semaine dernière
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
        <View style={styles.tete}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "flex-start",
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
              style={{ margin: 10 }}
            />
            <Text style={{ color: "#002447", fontSize: 13, margin: 10 }}>
              Voir les descriptions
            </Text>
          </View>
          <Text
            style={{
              color: "#bc672c",
              textAlign: "center",
              flex: 2,
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Les rapports d'activités
          </Text>
          <View style={styles.left}>
            {route.params.role ? (
              <Pressable
                style={styles.adduser}
                onPress={() => {
                  navigation.navigate("AjoutUtilisateur", {
                    username: route.params.username,
                    date,
                  });
                }}
              >
                <AntDesign
                  name="adduser"
                  size={30}
                  color={"#bc672c"}
                ></AntDesign>
              </Pressable>
            ) : (
              <Pressable
                style={styles.adduser}
                onPress={() => {
                  navigation.navigate("SaisieRA", {
                    username: route.params.username,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name="file-document-edit-outline"
                  size={30}
                  color={"#bc672c"}
                ></MaterialCommunityIcons>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.table}>
          <DataTable>
            <DataTable.Header>
              {route.params.role ? (
                <DataTable.Title style={{ justifyContent: "center" }}>
                  <Text style={styles.titleTab}>Auteur</Text>
                </DataTable.Title>
              ) : null}
              <DataTable.Title style={{ justifyContent: "center" }}>
                <Text style={styles.titleTab}>Date du rapport</Text>
              </DataTable.Title>
              <DataTable.Title style={{ justifyContent: "center" }}>
                <Text style={styles.titleTab}>Date de rédaction</Text>
              </DataTable.Title>
              <DataTable.Title style={{ justifyContent: "center" }}>
                <Text style={styles.titleTab}>Retardé/Non retardé</Text>
              </DataTable.Title>
              <DataTable.Title style={{ justifyContent: "center" }}>
                <Text style={styles.titleTab}>Motif de retard</Text>
              </DataTable.Title>
              <DataTable.Title style={{ justifyContent: "center" }}>
                <Text style={styles.titleTab}>Lien vers le rapport</Text>
              </DataTable.Title>
            </DataTable.Header>

            {tableData?.map((value, index) => {
              return (
                <>
                  <DataTable.Row>
                    {route.params.role ? (
                      <DataTable.Cell style={{ justifyContent: "center" }}>
                        {value[0]}
                      </DataTable.Cell>
                    ) : null}

                    <DataTable.Cell style={{ justifyContent: "center" }}>
                      {value[1]}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ justifyContent: "center" }}>
                      {value[2]}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ justifyContent: "center" }}>
                      {value[1] != value[2].slice(0, 10) ? (
                        <Ionicons
                          name="md-alert-circle-outline"
                          size={25}
                          color={"red"}
                        ></Ionicons>
                      ) : (
                        <AntDesign
                          name="checkcircleo"
                          size={20}
                          color={"green"}
                        ></AntDesign>
                      )}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ justifyContent: "center" }}>
                      {value[3]}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ justifyContent: "center" }}>
                      <Pressable
                        onPress={() => {
                          navigation.navigate("DisplayRA", {
                            dater: value[1],
                            date: value[1],
                            retard: value[3],
                            text: value[4],
                            username: value[0],
                          });
                        }}
                      >
                        <EvilIcons
                          name="link"
                          size={20}
                          color={"#002447"}
                        ></EvilIcons>
                      </Pressable>
                    </DataTable.Cell>
                  </DataTable.Row>
                  {isEnabled ? (
                    <DataTable.Row>
                      <View style={styles.text}>
                        <Text>{value[4]}</Text>
                        {value[1] != value[2].slice(0, 10) ? (
                          <View>
                            <Text
                              style={{
                                color: "#e60000",
                                fontWeight: "bold",
                                fontSize: "20",
                                margin: 20,
                                marginLeft: 2,
                              }}
                            >
                              Motif de retard :
                            </Text>
                            <Text>{value[3]}</Text>
                          </View>
                        ) : null}
                      </View>
                    </DataTable.Row>
                  ) : null}
                </>
              );
            })}
          </DataTable>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                marginTop: 10,
                width: "10%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Pressable
                onPress={() => {
                  if (page_bis > 1) {
                    page_bis = page - 1;
                    let offset = limit * (page_bis - 1);
                    let paramPage = {
                      employe,
                      motscle,
                      isSelectedtoday,
                      isSelectedweek,
                      isSelectedlastweek,
                      selecteddateA,
                      selecteddateDe,
                      dateDe,
                      dateA,
                      offset: offset,
                      limit: limit,
                      setNbrows: false,
                    };
                    loadDataSet("getPage", paramPage, (reponse) => {
                      data = reponse[1];
                      setTableData(reponse[1]);
                      setPage(page_bis);
                    });
                  }
                }}
              >
                <MaterialIcons
                  name="navigate-before"
                  size={30}
                  color={"#bc672c"}
                ></MaterialIcons>
              </Pressable>
              <Text
                style={{
                  color: "#bc672c",
                  fontSize: 15,
                  fontWeight: "bold",
                  marginTop: 5,
                }}
              >
                {page + "/" + pages}
              </Text>
              <Pressable
                onPress={() => {
                  if (page_bis < pages) {
                    page_bis = page + 1;
                    let offset = limit * (page_bis - 1);
                    let paramPage = {
                      employe,
                      motscle,
                      isSelectedtoday,
                      isSelectedweek,
                      isSelectedlastweek,
                      selecteddateA,
                      selecteddateDe,
                      dateDe,
                      dateA,
                      offset: offset,
                      limit: limit,
                      setNbrows: false,
                    };
                    console.log(paramPage);
                    loadDataSet("getPage", paramPage, (reponse) => {
                      data = reponse[1];
                      setTableData(reponse[1]);
                      setPage(page_bis);
                    });
                  }
                }}
              >
                <MaterialIcons
                  name="navigate-next"
                  size={30}
                  color={"#bc672c"}
                ></MaterialIcons>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    width: "100%",
  },
  searchbar: {
    height: 35,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  pressearchbar: {
    height: 35,
    marginLeft: -30,
  },
  headersearch: {
    backgroundColor: "#e0e0eb",
    marginTop: -30,
    marginLeft: 8,
    marginRight: 8,
    padding: 10,
    borderRadius: 10,
    paddingBottom: 40,
    shadowColor: "#1e1e2f",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  pressearch: {
    backgroundColor: "#002447",
    borderRadius: 200,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tete: {
    height: 70,
    backgroundColor: " #8d96a9 ",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    fontSize: 14,
    fontWeight: "bold",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
    flexDirection: "row-reverse",
    alignContent: "center",
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1, //prend le reste
    borderColor: "red",
    borderWidth: 1,
    height: 70,
  },
  table: {
    paddingTop: 100,
    paddingHorizontal: 30,
    flex: 1,
  },
  pres: {
    backgroundColor: "#3e72e2",
    width: 200,
    height: 40,
    margin: 20,
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  presbar: {
    backgroundColor: "#3e72e2",
    width: 200,
    height: 40,
    margin: 20,
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  butt: {
    alignItems: "flex-end",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  textinput: {
    height: 30,
    width: "60%",
    borderWidth: 0.5,
    borderColor: "#1e1e2f",
    backgroundColor: "white",
    padding: 7,
    margin: 10,
    borderRadius: 100,
  },
  adduser: {
    marginTop: -7,
    marginLeft: 10,
    marginRight: -10,
    marginBottom: 19,
    padding: 2,
    backgroundColor: "#fffaf7",
    shadowColor: "#bc672c",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    borderRadius: 50,
  },
  titleTab: {
    color: "#002447",
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "sans-serif",
  },
  pickerStyle: {
    color: "#bc672c",
    height: 30,
    width: 100,
    padding: 7,
    borderRadius: 5,
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
    padding: 40,
  },
});
