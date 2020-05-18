import React, {Component} from "react";
import {StyleSheet, Text, View, StatusBar, BackHandler} from "react-native";
import { RED} from "../constants/css-colors";
import NetInfo from "@react-native-community/netinfo"

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

class MiniOfflineSign extends Component{
    render() {
        return (
            <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>No Internet Connection</Text>
            </View>
        );
    }
}

class NoInternetPart extends Component {

    state = {
        isConnected: true
    };
    unsubscribe = null;



    componentDidMount() {

      this.unsubscribe = NetInfo.addEventListener(state => {
            this.setState({
                isConnected: state.isConnected
            });
            if(this.props.checkConnectionInfo) {
                this.props.checkConnectionInfo(state.isConnected)
            }
        });

    }

    componentWillUnmount() {
       if(typeof this.unsubscribe === 'function') {
          this.unsubscribe();
      }
    }

    render() {
        if (!this.state.isConnected) {
            return <MiniOfflineSign />;
        }
        return null;
    }

}


export default NoInternetPart;

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: RED,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        top: STATUSBAR_HEIGHT,
        zIndex: 100,
        width: "100%"
    },
    offlineText: {
        color: '#fff'
    }
});
