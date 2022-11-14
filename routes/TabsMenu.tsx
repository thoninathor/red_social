import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FC } from "react";
import { Posts, Profile, Search } from "../pages";
import { AntDesign } from "@expo/vector-icons";
export type TabsPages = {
  Posts: undefined;
  Profile: undefined;
  Search: undefined;
};

const Tab = createBottomTabNavigator<TabsPages>();

export const TabsMenu: FC = () => {
  return (
    <Tab.Navigator initialRouteName="Profile">
      <Tab.Screen
        options={{
          title: "Red Social",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
        name="Posts"
        component={Posts}
      />
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="search1" size={size} color={color} />
          ),
        }}
        name="Search"
        component={Search}
      />
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
};
