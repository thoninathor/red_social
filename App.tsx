import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import { AuthProvider } from "./context";
import { StackMenu } from "./routes";

axios.defaults.baseURL = "http://192.168.0.15:3000";
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackMenu />
      </NavigationContainer>
    </AuthProvider>
  );
}
