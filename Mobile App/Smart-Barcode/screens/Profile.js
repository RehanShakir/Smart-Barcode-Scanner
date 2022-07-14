import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { useQuery } from "react-query";
import { getScannedCountLoggedInUser, getCounts } from "../Axios/apiFunctions";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const authState = useSelector((state) => state.auth);
  // console.log(authState);

  const { data } = useQuery(
    authState.role === "admin" ? "getCount" : "getScannedCountLoggedInUser",
    () =>
      authState.role === "admin" ? getCounts() : getScannedCountLoggedInUser()
  );
  // console.log(data?.data?.scannedBarcodes);
  return (
    <Block flex style={styles.profile}>
      <Block flex>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width, marginTop: "20%" }}>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}>
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <Image source={Images.ProfilePicture} style={styles.avatar} />
              </Block>
              <Block style={styles.info}>
                <Block
                  middle
                  row
                  space='evenly'
                  style={{ marginTop: 20, paddingBottom: 24 }}>
                  {/* <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.INFO }}>
                    CONNECT
                  </Button> */}

                  {/* <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}>
                    MESSAGE
                  </Button> */}
                </Block>
                <Block row space='between'>
                  <Block middle>
                    <Text
                      bold
                      size={18}
                      color='#525F7F'
                      style={{ marginBottom: 4 }}>
                      {authState.role === "admin"
                        ? data?.data?.scannedBarcodes
                        : data?.data?.count}
                    </Text>
                    <Text size={12} color={argonTheme.COLORS.TEXT}>
                      Total Scanned Barcodes
                    </Text>
                  </Block>
                  <Block middle>
                    <Text
                      bold
                      color='#525F7F'
                      size={18}
                      style={{ marginBottom: 4 }}>
                      Approved
                    </Text>
                    <Text size={12} color={argonTheme.COLORS.TEXT}>
                      Account Status
                    </Text>
                  </Block>
                </Block>
              </Block>

              <Block flex>
                <Block middle style={styles.nameInfo}>
                  <Text bold size={28} color='#32325D'>
                    {authState.fullName}
                  </Text>
                  <Text size={16} color='#32325D' style={{ marginTop: 10 }}>
                    {authState.email}
                  </Text>
                </Block>
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle>
                  <Text style={{ textAlign: "center" }}>
                    <Text
                      bold
                      color='#32325D'
                      size={18}
                      style={{ marginBottom: 10 }}>
                      Assigned Insurances
                    </Text>
                    {authState.role === "client"
                      ? " " +
                        authState.assignedButtons?.map((d) => {
                          return d.value;
                        })
                      : ""}
                  </Text>
                </Block>
              </Block>
            </Block>
          </ImageBackground>
        </ScrollView>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,

    flex: 1,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: -10,
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 85,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
});

export default Profile;
