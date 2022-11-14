import axios from "axios";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  FlatList,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { AuthContext } from "../context";
import { IPost } from "./Posts";
import BottomSheet from "@gorhom/bottom-sheet";
import { globalStyles } from "./styles";
import { openCamera, openGallery } from "./functions";
import { ImageInfo, ImagePickerResult } from "expo-image-picker";

export function Profile() {
  const { width } = useWindowDimensions();
  const { user, setAuth } = useContext(AuthContext);

  const [posts, setPosts] = useState<IPost[]>([]);
  function getPosts() {
    axios.get("/posts", { params: { type: "profile" } }).then(({ data }) => {
      console.log(data);
      setPosts(data || []);
    });
  }
  useEffect(() => {
    getPosts();
  }, []);
  function updatePhoto(res: ImageInfo) {
    console.log("update Profile");
    setAuth({ user: { ...user, image: res.uri } });
  }
  const sheetRef = useRef<BottomSheet>(null);

  function openSheet() {
    console.log("Expandir sheet");

    sheetRef.current?.expand();
  }
  const snapPoints = useMemo(() => ["25%"], []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{ padding: 15 }}>
        <TouchableOpacity onPress={openSheet}>
          {user?.image ? (
            <Image
              source={{ uri: user?.image }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <AntDesign
              style={{
                backgroundColor: "#FFFFFF",
                alignSelf: "flex-start",
                borderRadius: 50,
              }}
              name="user"
              size={100}
              color="black"
            />
          )}
        </TouchableOpacity>
        <Text style={{ marginTop: 15 }}>{user?.name}</Text>
        <Text style={{ marginTop: 15 }}>{user?.bio}</Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id!}
        numColumns={Math.round(width / 100)}
        ListEmptyComponent={() => <Text>No Tienes Posts</Text>}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.images[0].url }}
            style={{ width: 100, height: 100, b }}
          />
        )}
      />
      <BottomSheet
        ref={sheetRef}
        backgroundStyle={{ backgroundColor: "#f3f3f3" }}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
      >
        <View>
          <TouchableOpacity
            style={globalStyles.option}
            onPress={() => openGallery(updatePhoto)}
          >
            <AntDesign
              name="picture"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text>Abrir Galleria</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.option}
            onPress={() => openCamera(updatePhoto)}
          >
            <AntDesign
              name="camera"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text>Abrir Camara</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
