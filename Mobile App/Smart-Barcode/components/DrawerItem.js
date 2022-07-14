import React from "react";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { signOut } from "../Redux/actions/auth.actions";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import Icon from "./Icon";
import argonTheme from "../constants/Theme";

const DrawerItem = ({ focused, title, navigation }) => {
  renderIcon = () => {
    switch (title) {
      case "Home":
        return (
          <Icon
            name='shop'
            family='ArgonExtra'
            size={14}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );

      case "Profile":
        return (
          <Icon
            name='chart-pie-35'
            family='ArgonExtra'
            size={14}
            color={focused ? "white" : argonTheme.COLORS.WARNING}
          />
        );

      case "Logout":
        return (
          <Icon
            name='logout'
            family='logout'
            size={20}
            color={focused ? "red" : argonTheme.COLORS.WARNING}
          />
        );

      default:
        return null;
    }
  };

  const dispatch = useDispatch();
  const myNavigation = useNavigation();

  const containerStyles = [
    styles.defaultStyle,
    focused ? [styles.activeStyle, styles.shadow] : null,
  ];
  const handleNavigation = () => {
    if (title === "Logout") {
      dispatch(signOut);
      myNavigation.navigate("Login");
    } else {
      navigation.navigate(title);
    }
  };
  return (
    <>
      <TouchableOpacity style={{ height: 60 }} onPress={handleNavigation}>
        <Block flex row style={containerStyles}>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            {renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={15}
              bold={focused ? true : false}
              color={focused ? "white" : "rgba(0,0,0,0.5)"}>
              {title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
  },
});

export default DrawerItem;
