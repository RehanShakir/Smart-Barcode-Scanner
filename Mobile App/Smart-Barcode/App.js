import React from "react";
import { Image, LogBox } from "react-native";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import { Images, argonTheme } from "./constants";
import { Provider } from "react-redux";
import reducers from "./Redux/reducers";
import { createStore, applyMiddleware, compose } from "redux";

import reduxThunk from "redux-thunk";

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo,
];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const queryClient = new QueryClient();
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);

// cache product images
LogBox.ignoreLogs(["Invalid prop textStyle of type array supplied to Cell"]);

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };
  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <QueryClientProvider client={queryClient}>
              <GalioProvider theme={argonTheme}>
                <Block flex>
                  <Screens />
                </Block>
              </GalioProvider>
            </QueryClientProvider>
          </NavigationContainer>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([...cacheImages(assetImages)]);
  };

  _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

export default App;
