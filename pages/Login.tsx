import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { FC, useContext, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context";
import { Pages } from "../routes";
import { globalStyles } from "./styles";

interface Props {
  navigation: NativeStackNavigationProp<Pages, "Login">;
}

export const Login: FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useContext(AuthContext);

  async function entrar() {
    console.log(email, password);
    const { data } = await axios.post("/login", { email, password });
    console.log(data);
    if (data.msg) {
      if (Platform.OS == "web") {
        alert(data.msg);
      }
      Alert.alert("Red Social", data.msg);
    }
    if (data.rToken) {
      setAuth({ isAuth: true, ...data });
    }
  }
  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: "#fff",
        alignItems: "center",
        minHeight: "100%",
      }}
    >
      <Text style={{ fontSize: 50, marginVertical: 100, color: "#AA6D39" }}>Freejobs</Text>
      <TextInput
        onChangeText={setEmail}
        value={email}
        style={globalStyles.input}
        placeholder="email"
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        style={globalStyles.input}
        placeholder="clave"
      />
      <TouchableOpacity style={globalStyles.btn} onPress={entrar}>
        <Text style={globalStyles.btntext}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
        <div>
        <Text style={{color: "black"}}>¿No tienes una cuenta? </Text>
        <Text style={{ color: "green" }}>Regístrate</Text>
        </div>
      </TouchableOpacity>
    </ScrollView>
  );
};
