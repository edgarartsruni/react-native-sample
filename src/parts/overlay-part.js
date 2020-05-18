import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import React, {Component} from "react";
import {PRIMARY_BLUE} from "../constants/css-colors";
import {Button, Overlay} from "react-native-elements";

class overlayPart extends Component {

    render() {
        return (
            <Overlay
                isVisible={this.state.isVisible}
                windowBackgroundColor="rgba(255, 255, 255, .5)"
                overlayBackgroundColor="red"
                width="auto"
                height="auto"
                onBackdropPress={() => this.setState({ isVisible: false })}
            >
                <View>
                    <Text>{this.state.console}</Text>
                    <Button
                        title="Ok"
                        type="clear"
                    />
                </View>
            </Overlay>
        )
    }
}

export default overlayPart;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    skeleton: {
        height: 25,
        alignItems: 'center'
    },
    errorMessage: {
        color: 'red',
        fontSize: 15,
        textAlign: 'center',
    },
});
