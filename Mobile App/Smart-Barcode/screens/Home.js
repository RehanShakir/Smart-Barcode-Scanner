import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  View,
  ToastAndroid,
  BackHandler,
  Image,
} from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";

import CheckboxGroup from "react-native-checkbox-group";
import Constants from "expo-constants";
import GridImageView from "react-native-grid-image-viewer";

import { Block, theme, Button, Input } from "galio-framework";
import { RadioButton, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

import TableComponent from "../components/Table";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { formattedDate } from "../constants/formatDate";

import {
  getScannedDataLoggedInUser,
  removeInsuracne,
  claimInsurance,
  uploadPhotos,
  removePhoto,
  deleteBarcode,
  scanBarcode,
  getDataByBarcode,
} from "../Axios/apiFunctions";
import Modal from "react-native-modal";

const { width, height } = Dimensions.get("screen");

const Home = () => {
  const route = useRoute();
  const [scanBarCodeModal, setScanBarCodeModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [insuranceModal, setInsuranceModalVisible] = useState(false);
  const [showButton, setShowButton] = useState();
  const [checkBoxValues, setCheckBoxValues] = useState([]);
  const [choosedInsurance, setChoosedInsurance] = useState({
    id: "",
    insurance: [],
  });
  const [selectedBarcode, setSelectedBarcode] = useState();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scannerId, setScannerId] = useState("");
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const [productStatus, setProductStatus] = useState("lost");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [code, setCode] = useState("");
  const [packageContents, setPackageContents] = useState("");
  const [website, setWebsite] = useState("");
  const [sizeWeight, setSizeWeight] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState(null);
  const [photos, setPhotos] = useState({
    id: "",
    photos: [],
  });
  const [photosModalVisible, setPhotosModalVisible] = useState(false);
  const [barcodeData, setBarcodeData] = useState();

  const { data: scannedData, isFetching: fetching } = useQuery(
    "getScannedDataOfLoggedInUser",
    getScannedDataLoggedInUser
  );

  const { data: barcodeDataQuery, isFetching: loading } = useQuery(
    ["getDataByBarcode", selectedBarcode],
    () => getDataByBarcode(selectedBarcode)
  );

  useEffect(() => {
    !loading && setBarcodeData(barcodeDataQuery);
  }, [selectedBarcode, loading]);

  useEffect(() => {
    !fetching && setSelectedBarcode(scannedData?.data?.scannedData[0]?.barcode);
  }, [fetching]);

  const queryClient = useQueryClient();

  const getDataMutation = useMutation(getScannedDataLoggedInUser, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("getScannedDataOfLoggedInUser");
    },
  });

  const getBarcodeDataMutation = useMutation(getDataByBarcode, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getDataByBarcode", selectedBarcode]);
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (route.name === "Home") {
          setScanning(false);
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [route])
  );

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");

      // if (Platform.OS !== "web") {
      //   const { status } =
      //     await ImagePicker.requestMediaLibraryPermissionsAsync();
      //   if (status !== "granted") {
      //     alert("Sorry, we need camera roll permissions to make this work!");
      //   }
      // }
    })();

    return () => {};
  }, []);
  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    setBarcode(data);

    setScanBarCodeModal(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleScanBarcode = () => {
    return <View style={styles.container}></View>;
  };

  /**Choosed Insurance Functions START*/
  const handleInsuranceModal = (id, insurance, deleteButtonFlag) => {
    setInsuranceModalVisible(true);
    setChoosedInsurance({
      id: id,
      insurance: insurance,
    });
    setShowButton(deleteButtonFlag);
  };
  const handleDeleteInsurance = async (insurance) => {
    const res = await removeInsuracne(choosedInsurance.id, insurance);
    if (res.status === 200) {
      getDataMutation.mutate();
      setInsuranceModalVisible(false);
      ToastAndroid.show("Insurance Deleted Successfully!", ToastAndroid.SHORT);
    } else {
      setInsuranceModalVisible(false);
      ToastAndroid.show(
        "Something went wrong! Please check your internet connection",
        ToastAndroid.SHORT
      );
    }
  };
  /**Choosed Insurance Functions END*/

  /**Claim Insuarance Functions START*/
  const handleClaimInsurance = (data, index) => {
    setIsModalVisible(true);
    setScannerId(data._id);
  };

  const onFinish = async () => {
    const values = {
      name: name,
      address: address,
      code: code,
      productStatus: productStatus,
      packageContents: packageContents,
      website: website,
      sizeWeight: sizeWeight,
      email: email,
      phoneNumber: phoneNumber,
    };
    const res = await claimInsurance(values, scannerId);
    if (res.status === 200) {
      // form.resetFields();
      setIsModalVisible(false);
      getDataMutation.mutate();
      ToastAndroid.show(
        "Insurance Claim Request Submitted Successfully",
        ToastAndroid.SHORT
      );
    }
  };
  /**Claim Insuracne Functions END*/

  /**Upload Photos Functions START*/
  const handleUploadPhtotsMoal = (_id, index) => {
    setUploadModalVisible(true);

    setScannerId(_id);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: false,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      let uriParts = image.uri.split(".");
      let fileType = uriParts[uriParts.length - 1];

      formData.append("photos", {
        uri: image.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
      const res = await uploadPhotos(formData, scannerId);

      if (res.status === 200) {
        setImage(null);
        getBarcodeDataMutation.mutate(selectedBarcode);
        ToastAndroid.show("Photos Uploaded Successfully!", ToastAndroid.SHORT);
        setUploadModalVisible(false);
      }
    } catch (error) {
      console.log(error);
      setUploadModalVisible(false);
      ToastAndroid.show(
        "Something went wrong! Please check your internet connection",
        ToastAndroid.SHORT
      );
    }
  };

  /**Upload Photos Functions END*/

  /**View Photos Functions Start*/
  const handleImagePreview = (id, photos) => {
    setPhotos({
      id: id,
      photos: photos,
    });

    setPhotosModalVisible(true);
  };

  const handleDeletePhoto = async (id, photo) => {
    const res = await removePhoto(id, photo);
    if (res.status === 200) {
      getBarcodeDataMutation.mutate({ selectedBarcode });
      setPhotosModalVisible(false);
      ToastAndroid.show("Photo Deleted Successfully!", ToastAndroid.SHORT);
    } else {
      setPhotosModalVisible(false);
      ToastAndroid.show(
        "Something went wrong! Please check your internet connection",
        ToastAndroid.SHORT
      );
    }
  };
  /**View Photos Functions END*/

  /**Delete Record Functions START*/
  const handleDeleteEntry = async (id) => {
    const res = await deleteBarcode(id);
    if (res.status === 200) {
      getDataMutation.mutate();
      ToastAndroid.show(res?.data?.message, ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(
        "Something went wrong! Please check your internet connection",
        ToastAndroid.SHORT
      );
    }
  };

  /**Delete Record Functions END*/

  /**Scan Barcode Functions START*/
  const handleBarcodeModalOk = async () => {
    const res = await scanBarcode(barcode, checkBoxValues);

    if (res.status === 200) {
      setScanBarCodeModal(false);
      getDataMutation.mutate();

      ToastAndroid.show("Barcode Added Successfully!", ToastAndroid.SHORT);
    } else {
      setScanBarCodeModal(false);

      ToastAndroid.show(
        "Something went wrong! Please check your internet connection",
        ToastAndroid.SHORT
      );
    }
  };

  /**Scan Barcode Functions END*/

  const tableData1 = [
    [
      !loading && !fetching
        ? barcodeData?.data?.scannedData[0]?.barcode
        : "Loading...",
    ],
    [
      <Button
        shadowless
        style={{ height: "70%", alignSelf: "center" }}
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        onPress={() => {
          setInsuranceModalVisible(true);
          handleInsuranceModal(
            barcodeData?.data?.scannedData[0]?._id,
            barcodeData?.data?.scannedData[0]?.buttons,
            barcodeData?.data?.scannedData[0]?.deleteButtonFlag
          );
        }}>
        Choosed Insurances
      </Button>,
    ],
    [
      <Button
        shadowless
        style={{ height: "70%", alignSelf: "center" }}
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        onPress={() => {
          handleClaimInsurance(barcodeData?.data?.scannedData[0]);
        }}>
        Claim Insurance
      </Button>,
    ],
    [
      <Button
        shadowless
        style={{ height: "70%", alignSelf: "center" }}
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        onPress={() => {
          handleUploadPhtotsMoal(barcodeData?.data?.scannedData[0]?._id);
        }}>
        Upload Photos
      </Button>,
    ],
    [
      !loading && !fetching ? (
        barcodeData?.data?.scannedData[0]?.claimStatus === "inProgress" ? (
          <Text
            style={{ color: "blue", fontWeight: "800", textAlign: "center" }}>
            IN PROGRESS
          </Text>
        ) : barcodeData?.data?.scannedData[0]?.claimStatus === "finished" ? (
          <Text
            style={{ color: "green", fontWeight: "800", textAlign: "center" }}>
            {barcodeData?.data?.scannedData[0]?.claimStatus.toUpperCase()}
          </Text>
        ) : (
          <Text
            style={{ color: "red", fontWeight: "800", textAlign: "center" }}>
            {barcodeData?.data?.scannedData[0]?.claimStatus.toUpperCase()}
          </Text>
        )
      ) : (
        "Loading..."
      ),
    ],
    [
      <Button
        shadowless
        style={{ height: "70%", alignSelf: "center" }}
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        onPress={() => {
          handleImagePreview(
            barcodeData?.data?.scannedData[0]?._id,
            barcodeData?.data?.scannedData[0]?.productPhotos
          );
        }}>
        View Photos
      </Button>,
    ],
    [formattedDate(barcodeData?.data?.scannedData[0]?.createdAt)],
    [
      <Button
        style={{
          height: "70%",
          width: "80%",
          backgroundColor: "red",
          alignSelf: "center",
        }}
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        onPress={() => {
          handleDeleteEntry(barcodeData?.data?.scannedData[0]?._id);
        }}>
        Delete
      </Button>,
    ],
  ];
  return (
    <Block flex center style={styles.home}>
      {
        <Button
          shadowless
          style={{ marginTop: 50, alignSelf: "center" }}
          textStyle={{ fontSize: 12, fontWeight: "700" }}
          onPress={() => (!scanning ? setScanning(true) : setScanning(false))}>
          {!scanning ? "Scan Barcode" : "Exit"}
        </Button>
      }
      <Picker
        selectedValue={selectedBarcode}
        style={{
          width: "50%",
          backgroundColor: "whitesmoke",
        }}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedBarcode(itemValue);
          getBarcodeDataMutation.mutate(itemValue);
        }}>
        {scannedData?.data?.scannedData?.map((data, index) => {
          return (
            <Picker.Item
              label={data.barcode}
              value={data.barcode}
              key={index + data.barcode}
            />
          );
        })}
      </Picker>

      <TableComponent tableData1={tableData1} />
      {/* <TableComponent tableHead={tableHead} tableData={tableData1} /> */}

      {/**BARCODE SCANNER CODE */}
      {/* <View style={styles.articles}> */}
      {scanning && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {/* </View> */}
      {/* {scanning && (
        <Button
          shadowless
          textStyle={{ fontSize: 12, fontWeight: "700" }}
          onPress={() => {
            setScanning(false);
          }}>
          Tap To Scan Barcode
        </Button>
      )} */}

      {/**Choosed Insurances Modal */}
      <Modal
        isVisible={insuranceModal}
        style={{ alignSelf: "center" }}
        onBackButtonPress={() => setInsuranceModalVisible(false)}
        coverScreen={false}
        backdropColor={"white"}
        backdropOpacity={1}
        onBackdropPress={() => setInsuranceModalVisible(false)}
        deviceWidth={width}
        deviceHeight={height}>
        <ScrollView>
          <View>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 20,
              }}>
              Choosed Insurance
            </Text>

            {choosedInsurance.insurance.map((d, index) => {
              return (
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Button
                    style={{ marginBottom: 15 }}
                    disabled={true}
                    color='primary'>
                    {d}
                  </Button>
                  <Button
                    shadowless
                    disabled={showButton}
                    color={"danger"}
                    style={{ width: "50%", alignSelf: "center" }}
                    textStyle={{
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                    onPress={() => handleDeleteInsurance(d)}>
                    Delete
                  </Button>
                </View>
              );
            })}
            <Button
              shadowless
              style={{ marginTop: 50, alignSelf: "center" }}
              textStyle={{ fontSize: 12, fontWeight: "700" }}
              onPress={() => setInsuranceModalVisible(false)}>
              Close (X)
            </Button>
          </View>
        </ScrollView>
      </Modal>

      {/**Claim Insurance Modal */}
      <Modal
        isVisible={isModalVisible}
        style={{ alignSelf: "center" }}
        coverScreen={false}
        backdropColor={"white"}
        backdropOpacity={1}
        onBackdropPress={() => setIsModalVisible(false)}
        onBackButtonPress={() => setIsModalVisible(false)}
        deviceWidth={width}
        deviceHeight={height}>
        <View>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 20,
            }}>
            Claim Insurance
          </Text>
          <Block flex center>
            {/* <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior='padding'
              enabled> */}
            <ScrollView>
              <Block width={width * 0.8}>
                <Input placeholder='Name' onChangeText={(e) => setName(e)} />
                <Input
                  placeholder='Address'
                  onChangeText={(e) => setAddress(e)}
                />
                <Input
                  placeholder='Track & Trace Code
'
                  onChangeText={(e) => setCode(e)}
                />
                <Text style={{ fontWeight: "700" }}>Product Status</Text>
                <RadioButton.Group
                  onValueChange={(value) => {
                    setProductStatus(value);
                  }}
                  value={productStatus}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={{ marginRight: 30 }}>
                      <Text>Lost</Text>
                      <RadioButton value='lost' />
                    </View>
                    <View>
                      <Text>Damaged</Text>
                      <RadioButton value='damaged' />
                    </View>
                  </View>
                </RadioButton.Group>

                <Input
                  placeholder='Package Contents
'
                  onChangeText={(e) => setPackageContents(e)}
                />
                <Input
                  placeholder='Website'
                  onChangeText={(e) => setWebsite(e)}
                />
                <Input
                  placeholder='Size & Weight'
                  onChangeText={(e) => setSizeWeight(e)}
                />
                <Input placeholder='Email' onChangeText={(e) => setEmail(e)} />
                <Input
                  placeholder='Phone Number
'
                  onChangeText={(e) => setPhoneNumber(e)}
                />
              </Block>
              {/* </KeyboardAvoidingView> */}
            </ScrollView>
          </Block>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Button
              shadowless
              style={{ marginTop: 50, alignSelf: "center" }}
              textStyle={{ fontSize: 12, fontWeight: "700" }}
              onPress={() => onFinish()}>
              Submit
            </Button>
            <Button
              shadowless
              style={{ marginTop: 50, alignSelf: "center" }}
              textStyle={{ fontSize: 12, fontWeight: "700" }}
              onPress={() => setIsModalVisible(false)}>
              Close (X)
            </Button>
          </View>
        </View>
      </Modal>

      {/**Upload Photos Modal */}
      <Modal
        onBackButtonPress={() => setUploadModalVisible(false)}
        isVisible={uploadModalVisible}
        style={{ alignSelf: "center" }}
        coverScreen={false}
        backdropColor={"white"}
        backdropOpacity={1}
        onBackdropPress={() => setUploadModalVisible(false)}
        deviceWidth={width}
        deviceHeight={height}>
        <View>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 20,
            }}>
            Upload Photos
          </Text>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Button
              shadowless
              style={{ marginTop: 50, alignSelf: "center" }}
              textStyle={{ fontSize: 12, fontWeight: "700" }}
              onPress={pickImage}>
              Select Image
            </Button>
            {image && (
              <Image
                source={{ uri: image.uri }}
                style={{ width: 200, height: 200 }}
              />
            )}
          </View>
          <Button
            shadowless
            style={{ alignSelf: "center" }}
            textStyle={{ fontSize: 12, fontWeight: "700" }}
            onPress={handleUpload}>
            Upload Image
          </Button>
          <Button
            shadowless
            style={{ marginTop: 50, alignSelf: "center" }}
            textStyle={{ fontSize: 12, fontWeight: "700" }}
            onPress={() => setUploadModalVisible(false)}>
            Close (X)
          </Button>
        </View>
      </Modal>

      {/**View Photos Modal */}
      <Modal
        isVisible={photosModalVisible}
        onBackButtonPress={() => setPhotosModalVisible(false)}
        style={{ alignSelf: "center" }}
        coverScreen={false}
        backdropColor={"white"}
        backdropOpacity={1}
        onBackdropPress={() => setPhotosModalVisible(false)}
        deviceWidth={width}
        deviceHeight={height}>
        <ScrollView>
          <View>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 20,
              }}>
              Photos
            </Text>
            <Button
              shadowless
              style={{ marginTop: 10, alignSelf: "center", marginBottom: 50 }}
              textStyle={{ fontSize: 12, fontWeight: "700" }}
              onPress={() => setPhotosModalVisible(false)}>
              Close (X)
            </Button>
            {photos?.photos?.map((photo, index) => {
              console.log(photo);
              return (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                    flex: 1,
                    // marginBottom: 15,
                  }}>
                  {/* <Image.PreviewGroup key={index + "prImg"}> */}
                  {/* <Avatar.Image
                  source={{
                    uri: photo,
                  }}
                  size={150}
                /> */}
                  <GridImageView heightOfGridImage={100} data={[photo]} />

                  <Button
                    // shadowless
                    style={{ width: 40, marginTop: -50, alignSelf: "center" }}
                    textStyle={{ fontSize: 12, fontWeight: "700" }}
                    color='danger'
                    onPress={() => handleDeletePhoto(photos.id, photo)}>
                    Delete
                  </Button>

                  {/* </Image.PreviewGroup> */}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </Modal>

      {/**Scan Barcode Modal*/}
      <Modal
        isVisible={scanBarCodeModal}
        onBackButtonPress={() => setScanBarCodeModal(false)}
        style={{ alignSelf: "center" }}
        coverScreen={false}
        backdropColor={"white"}
        backdropOpacity={1}
        onBackdropPress={() => setScanBarCodeModal(false)}
        deviceWidth={width}
        deviceHeight={height}>
        <ScrollView>
          <View>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 20,
              }}>
              Scanned Barcode
            </Text>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "300",
                marginBottom: 20,
              }}>
              {barcode}
            </Text>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 20,
              }}>
              Choose Insurances
            </Text>
            <CheckboxGroup
              callback={(selected) => {
                setCheckBoxValues(selected);
              }}
              iconColor={"#00a2dd"}
              iconSize={30}
              checkedIcon='ios-checkbox-outline'
              uncheckedIcon='ios-square-outline'
              checkboxes={scannedData?.data?.scannedData[0]?.userId?.assignedButtons?.map(
                (btn) => {
                  return {
                    label: btn.value,
                    value: btn.value,
                  };
                }
              )}
              labelStyle={{
                color: "#333",
              }}
              rowStyle={{
                flexDirection: "row",
                alignSelf: "center",
              }}
              rowDirection={"column"}
            />
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Button
                shadowless
                style={{ marginTop: 50, alignSelf: "center" }}
                textStyle={{ fontSize: 12, fontWeight: "700" }}
                onPress={() => handleBarcodeModalOk()}>
                Add Barcode
              </Button>
              <Button
                shadowless
                style={{ marginTop: 50, alignSelf: "center" }}
                textStyle={{ fontSize: 12, fontWeight: "700" }}
                onPress={() => setScanBarCodeModal(false)}>
                Close (X)
              </Button>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    width: width,
    backgroundColor: "white",
  },
  articles: {
    // width: width - theme.SIZES.BASE * 2,
  },
});

export default Home;
