import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Button, Card, Icon} from "react-native-elements";
import {BACKGROUND_COLOR, PRIMARY_BLUE} from "../constants/css-colors";
import CARD_STYLES from "../styles/card-styles";
import BalancePart from "./balance-part";
import ProfilePart from "./profile-part";

class FirstWatchIntro extends Component {

    render() {

        return (
            <View>
                <ProfilePart/>
                <BalancePart/>
                <Card containerStyle={CARD_STYLES}>
                    <Text style={styles.text}>
                        Thank you for joining pagomo.
                        pagomo is your digital wallet on
                        your phone, with pagomo you will
                        no longer need to find a store or
                        payment office to pay your bills or
                        recharge your phone.
                        Low on balance? No worries!
                        We are happy to help you pay first;
                        we just need some information.
                        The more you provide the more
                        credit we can extend.
                    </Text>
                </Card>
                <Button
                    buttonStyle={{...styles.button, backgroundColor: BACKGROUND_COLOR}}
                    title="See ways to get credit"
                    onPress={this.props.changeFirstView}
                />

                <Button
                    buttonStyle={{...styles.button, backgroundColor: PRIMARY_BLUE}}
                    title="Later"
                    onPress={this.props.changeFirstView}
                />
            </View>
        )

    }

}

export default FirstWatchIntro;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    text: {
        fontSize: 13,
        marginTop: 5,
        textAlign: 'center'
    },
    button: {
        marginTop: 15,
        padding: 5,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 4
    }
});
