import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  ToastAndroid,
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { withNavigation } from "@react-navigation/compat";
import { signIn, loadProfile } from "../Redux/actions/auth.actions";
import { getState, getToken } from "../Redux/localstorage/index";

const { width, height } = Dimensions.get("screen");

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authState = useSelector((state) => state.auth);
  // console.log(authState.isSignedIn);

  const fetchUser = async () => {
    const token = await getToken();
    console.log(token);
    if (!authState.isSignedIn && token) {
      console.log("in use if");

      dispatch(loadProfile(token));
      navigation.navigate("Home");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [authState.isSignedIn]);

  if (getState()) {
  }
  const handleLogin = async () => {
    console.log(email, password);
    const res = await dispatch(signIn(email, password));
    console.log(res);

    if (res?.status) {
      ToastAndroid.show(res.error, ToastAndroid.SHORT);
    }

    if (!res) {
      navigation.navigate("Home");
      // navigation.navigate("Home");
      // authState.role === "admin"
      // ? history.push("/admin")
      // : history.push("/client");
    }
  };

  return (
    <Block flex middle>
      <StatusBar hidden />
      <ImageBackground
        source={Images.RegisterBackground}
        style={{ width, height, zIndex: 1 }}>
        <Block safe flex middle>
          <Block style={styles.registerContainer}>
            <Block flex={0.25} middle style={styles.socialConnect}>
              <Block row style={{ marginTop: theme.SIZES.BASE }}>
                <Image source={Images.Logo} style={styles.avatar} />
              </Block>
            </Block>
            <Block flex>
              <Block flex={0.17} middle>
                <Text color='#8898AA' size={12}>
                  Login with Email and Password
                </Text>
              </Block>
              <Block flex center>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior='padding'
                  enabled>
                  <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    <Input
                      borderless
                      placeholder='Email'
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name='ic_mail_24px'
                          family='ArgonExtra'
                          style={styles.inputIcons}
                        />
                      }
                      onChangeText={(e) => setEmail(e)}
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      password
                      borderless
                      placeholder='Password'
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name='padlock-unlocked'
                          family='ArgonExtra'
                          style={styles.inputIcons}
                        />
                      }
                      onChangeText={(e) => setPassword(e)}
                    />
                  </Block>

                  <Block middle>
                    <Button
                      color='primary'
                      style={styles.createButton}
                      onPress={handleLogin}>
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Login
                      </Text>
                    </Button>
                  </Block>
                </KeyboardAvoidingView>
              </Block>
            </Block>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.875,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA",
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14,
  },
  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
  },
  avatar: {
    width: 200,
    height: 200,
  },
});

export default withNavigation(Login);
