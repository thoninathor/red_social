import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    padding: 15,
    alignSelf: "stretch",
    margin: 15,
    backgroundColor: "#f3f3f3",
    marginVertical: 5,
    borderRadius: 15,
  },
  btn: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "green",
    borderRadius: 15,
    minWidth: 150,
  },
  btntext: {
    textAlign: "center",
    color: "white",
  },
  option: {
    flexDirection: "row",
    margin: 15,
  },
});
