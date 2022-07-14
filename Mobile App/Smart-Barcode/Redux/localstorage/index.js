import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    //   const serializedState = localStorage.getItem("token");
    const serializedState = await AsyncStorage.getItem("token");

    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveToken = async (state) => {
  try {
    const serializedState = JSON.stringify(state);
    //   localStorage.setItem("token", serializedState);
    await AsyncStorage.setItem("token", serializedState);
  } catch (err) {}
};

export const getState = async () => {
  try {
    //   const serializedState = localStorage.getItem("token");
    const serializedState = await AsyncStorage.getItem("isSignedIn");

    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = async (state) => {
  try {
    const serializedState = JSON.stringify(state);
    //   localStorage.setItem("token", serializedState);
    await AsyncStorage.setItem("isSignedIn", serializedState);
  } catch (err) {}
};

export const deleteToken = async () => {
  try {
    //   localStorage.removeItem("token");
    await AsyncStorage.clear();
  } catch (e) {}
};
