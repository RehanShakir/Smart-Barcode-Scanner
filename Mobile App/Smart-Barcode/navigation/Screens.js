import { Dimensions } from "react-native";
// header for screens
import { Header } from "../components";

// drawer
import CustomDrawerContent from "./Menu";
// screens
import Home from "../screens/Home";
// import Onboarding from "../screens/Onboarding";
// import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import React from "react";
import Login from "../screens/Login";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function ProfileStack(props) {
  return (
    <Stack.Navigator
      initialRouteName='Profile'
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}>
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header title='Profile' navigation={navigation} scene={scene} />
          ),
          // cardStyle: { backgroundColor: "#FFFFFF" },
          // headerTransparent: true,
        }}
      />
      <Stack.Screen
        name='Home'
        component={HomeStack}
        options={{
          header: ({ navigation, scene }) => (
            <Header title='Home' back navigation={navigation} scene={scene} />
          ),
          // headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          header: ({ navigation, scene }) => (
            <Header title='Home' navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header title='Profile' navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
    </Stack.Navigator>
  );
}

export default function MainStack(props) {
  const authState = useSelector((state) => state.auth);
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}>
      {authState.isSignedIn ? (
        <>
          <Stack.Screen
            name='Home'
            component={AppStack}
            options={{
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name='Login'
            component={Login}
            options={{
              headerTransparent: true,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name='Login'
            component={Login}
            options={{
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name='Home'
            component={AppStack}
            options={{
              headerTransparent: true,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal",
        },
      }}
      initialRouteName={"Home"}>
      {/* <Drawer.Screen name='Account' component={Register} /> */}

      {/* <Drawer.Screen name='Login' component={Login} /> */}

      <Drawer.Screen name='Home' component={HomeStack} />
      <Drawer.Screen name='Profile' component={ProfileStack} />
      {/* <Drawer.Screen name='Elements' component={ElementsStack} /> */}
      {/* <Drawer.Screen name='Articles' component={ArticlesStack} /> */}
    </Drawer.Navigator>
  );
}
