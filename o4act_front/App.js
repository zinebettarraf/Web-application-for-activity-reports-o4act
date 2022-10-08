import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";

import { AjoutUtilisateur } from "./Pages/AjoutUtilisateur";
import { acceuil } from "./Pages/acceuil";
import { SaisieRA } from "./Pages/SaisieRA";
import { login } from "./Pages/login";
import { DisplayRA } from "./Pages/DisplayRA";
import { View, Image,Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {  TouchableOpacity } from "react-native-web";
import { createContext, useState } from "react";
import moment from "moment";


export const StoreContext = createContext(null);


const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
  },
};

export const loadDataSet = (url, param, finalFunction) => {
  let Url = "http://localhost:4000" + "/"+ url;

  let reponse = {};

  fetch(Url, {
    // envoie de req
    method: "POST",

    Accept: "application/json",

    "Content-Type": "application/json", //// a voir bhal dic f js

    body: JSON.stringify(param), // rendre string on envoie que les string au serveur  3amarna body
  })
    .then((response) => response.json())

    .then((data) => {
      reponse = data;
    })

    .catch((error) => {
      throw error;
    })

    .finally(() => {
      finalFunction(reponse); /// 3amarnareponse dyal finalF
    });
};

const App = () => {

  const Stack = createNativeStackNavigator();
  const [logout, setLogout] = useState(false);
  const [logoutFunction, setLogoutFunction] = useState({});
  const [username, setUsername] = useState("");
  const date= useState(moment(new Date()).format("DD/MM/YYYY"));

  /// on ne peut pas passer directement une fonction avec useState (que des var ) l'idee est de passer la fct dans l'objet json

  return (
    <StoreContext.Provider
      value={{
        setLogout: setLogout,
        setUsername,
        setLogoutFunction,
      }}
    >
      <PaperProvider theme={theme}>
        <View style={{ width: "100%", flex: 1 }}>
          <View
            style={{
              width: "100%",
              height: 40,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#e6ebfa",
            }}
          > 
          <View> 
          <Image
              source={require("./assets/logo.png")}
              style={{ width: 100, height: 35 }}
            />
          </View>

             {console.log(logout)}
            {logout ? (
              <View style={{flexDirection:"row",justifyContent:"space-between",flex:1,marginLeft:15,marginTop:8}}>
              <Text style={{fontSize: 15, color: "#bc672c",paddingTop:8}}> {username}  </Text>
              <View  style={{flexDirection:"row"}}>
              <Text style={{fontSize: 15, color: "#bc672c",paddingTop:8}}>  {date} </Text>
              <TouchableOpacity
              style={{margin:8}}
                onPress={() => {
                  setLogout(false);
                  logoutFunction.function();
                }}
              >
                <AntDesign
                  name="logout"
                  size={20}
                  color={"#bc672c"}
                ></AntDesign>
              </TouchableOpacity>
              
              </View></View> ) : null}
          </View>
           
          <View style={{ width: "100%", flex: 1 }}>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="login" component={login} />
                <Stack.Screen name="DisplayRA" component={DisplayRA} />
                <Stack.Screen name="acceuil" component={acceuil} />
                <Stack.Screen
                  name="AjoutUtilisateur"
                  component={AjoutUtilisateur}
                />
                <Stack.Screen name="SaisieRA" component={SaisieRA} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </View>
      </PaperProvider>
    </StoreContext.Provider>
  );
};

export default App;