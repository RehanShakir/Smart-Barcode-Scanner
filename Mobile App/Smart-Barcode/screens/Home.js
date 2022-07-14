import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  View,
  ToastAndroid,
  Image,
} from "react-native";
import CheckboxGroup from "react-native-checkbox-group";

import { Block, theme, Button, Input } from "galio-framework";
import { RadioButton, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

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
} from "../Axios/apiFunctions";
import Modal from "react-native-modal";

const { width, height } = Dimensions.get("screen");

const Home = () => {
  const [scanBarCodeModal, setScanBarCodeModal] = useState(false);
  const [scannig, setScanning] = useState(false);
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

  const { data: scannedData } = useQuery(
    "getScannedDataOfLoggedInUser",
    getScannedDataLoggedInUser
  );
  const queryClient = useQueryClient();

  const getDataMutation = useMutation(getScannedDataLoggedInUser, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("getScannedDataOfLoggedInUser");
    },
  });
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
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
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

  // console.log(scannedData);
  // console.log(getScannedDataLoggedInUser());

  const tableHead = [
    "BARCODE",
    "CHOOSED INSURANCES	",
    "CLAIM INSURANCE	",
    "UPLOAD PHOTOS",
    "CLAIM STATUS",
    "PHOTOS",
    "DATE",
    "DELETE",
  ];

  let tableData = [];

  const mappingData = scannedData?.data?.scannedData?.map((data, index) => {
    tableData.push([
      data.barcode,
      <Button
        shadowless
        style={{ height: "70%", alignSelf: "center" }}
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        onPress={() => {
          setInsuranceModalVisible(true);
          handleInsuranceModal(data._id, data.buttons, data.deleteButtonFlag);
        }}>
        Choosed Insurances
      </Button>,
      <Button
        shadowless
        style={{ height: "70%", alignSelf: "center" }}
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        onPress={() => {
          handleClaimInsurance(data, index);
        }}>
        Claim Insurance
      </Button>,
      <Button
        shadowless
        style={{ height: "70%", alignSelf: "center" }}
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        onPress={() => {
          handleUploadPhtotsMoal(data._id, index);
        }}>
        Upload Photos
      </Button>,
      data.claimStatus === "inProgress" ? (
        <Text style={{ color: "blue", fontWeight: "800", textAlign: "center" }}>
          IN PROGRESS
        </Text>
      ) : data.claimStatus === "finished" ? (
        <Text
          style={{ color: "green", fontWeight: "800", textAlign: "center" }}>
          {data.claimStatus.toUpperCase()}
        </Text>
      ) : (
        <Text style={{ color: "red", fontWeight: "800", textAlign: "center" }}>
          {data.claimStatus.toUpperCase()}
        </Text>
      ),
      <Button
        shadowless
        style={{ height: "70%", alignSelf: "center" }}
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        onPress={() => {
          handleImagePreview(data._id, data.productPhotos);
        }}>
        View Photos
      </Button>,
      formattedDate(data.createdAt),
      <Button
        style={{
          height: "70%",
          width: "80%",
          backgroundColor: "red",
          alignSelf: "center",
        }}
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        onPress={() => {
          handleDeleteEntry(data._id);
        }}>
        Delete
      </Button>,
    ]);
  });

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
    console.log(insurance);
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

    // console.log(result);

    if (!result.cancelled) {
      setImage(result);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      // console.log(image);
      // console.log(scannerId);
      let uriParts = image.uri.split(".");
      let fileType = uriParts[uriParts.length - 1];
      console.log(fileType);

      formData.append("photos", {
        uri: image.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
      const res = await uploadPhotos(formData, scannerId);

      if (res.status === 200) {
        getDataMutation.mutate();
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
      getDataMutation.mutate();
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
    // setBarcodeBtnLoading(true);
    console.log(barcode, checkBoxValues);
    const res = await scanBarcode(barcode, checkBoxValues);

    if (res.status === 200) {
      // setBarcodeBtnLoading(false);

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
  // const tableData = [
  //   ["1", "2", "3"],
  //   ["a", "b", "c"],
  //   ["1", "2", "3"],
  //   ["a", "b", "c"],
  // ];

  return (
    <Block flex center style={styles.home}>
      {!scannig && (
        <Button
          shadowless
          style={{ marginTop: 50, alignSelf: "center" }}
          textStyle={{ fontSize: 12, fontWeight: "700" }}
          onPress={() => setScanning(true)}>
          Scan Barcode
        </Button>
      )}
      <TableComponent tableHead={tableHead} tableData={tableData} />

      {/**BARCODE SCANNER CODE */}
      {scannig && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {/* {scanned && (
        <Button
          shadowless
          textStyle={{ fontSize: 12, fontWeight: "700" }}
          onPress={() => {
            setScanned(false);
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
            {photos.photos.map((photo, index) => {
              return (
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                    // marginBottom: 15,
                  }}>
                  {/* <Image.PreviewGroup key={index + "prImg"}> */}
                  <Avatar.Image
                    source={{
                      uri: photo,
                    }}
                    size={150}
                  />
                  <Button
                    shadowless
                    style={{ marginTop: 50, alignSelf: "center" }}
                    textStyle={{ fontSize: 12, fontWeight: "700" }}
                    color='danger'
                    onPress={() => handleDeletePhoto(photos.id, photo)}>
                    Delete
                  </Button>

                  {/* </Image.PreviewGroup> */}
                </View>
              );
            })}
            <Button
              shadowless
              style={{ marginTop: 50, alignSelf: "center" }}
              textStyle={{ fontSize: 12, fontWeight: "700" }}
              onPress={() => setPhotosModalVisible(false)}>
              Close (X)
            </Button>
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
                console.log(selected);
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
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
