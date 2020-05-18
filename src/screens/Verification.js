import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {Component} from "react";
import {
    PARAGRAPH_SILVER,
    PRIMARY_BLUE,
    TEXT_BLUE,
} from "../constants/css-colors";
import {Button, Header, Input} from 'react-native-elements';
import {getOTPFunc, logoutFunc, verifyOTPFunc} from "../helpers/auth-helper";
import CountDown from "react-native-countdown-component";
import {connect} from "react-redux";
import BOTTOM_BUTTON_STYLES from "../styles/bottom-button-styles";
import HEADER_STYLES from "../styles/header-styles";
import PAGE_TITLE_STYLES from "../styles/page-title-styles";
import BODY_WRAPPER_STYLES from "../styles/body-wrapper-styles";
import INPUT_PASS_STYLES, {INPUT_BOTTOM_COLOR} from "../styles/input-pass-styles";
import PAGE_WRAPPER_STYLES from "../styles/page-wrapper-styles";
import SCROLL_STYLES from "../styles/scroll-styles";
import HeaderLogo from "../parts/header-logo";
import {ifOnlyNumbers} from "../helpers/validators";
import NoInternetPart from "../parts/no-internet-part";
import {setCurrentScreen, signUpEvent} from "../helpers/analytics-helper";

import Loading from "../parts/loading";
import {updateConsole} from "../actions/auth.action";
import PropTypes from "prop-types";


const TIMER = 60 * 2;

class Verification extends Component {

    state = {
        pageTitle: 'Verification',
        verificationNumber: ['','','','','',''],
        timer: TIMER,
        disableBtn: false,
        loading: false,
        inputs: []
    };

    componentDidMount() {
        setCurrentScreen(this.props.navigation.state.routeName);
        setTimeout(() => {
            this.state[`inputs`][0].focus()
        }, 400)
    }


    changeVerificationNumber(number,index) {
        const numbers = this.state.verificationNumber;
        const verLength = numbers.length;
        if(number.length === verLength && index === 0) {
            const replacedNumbers = number.split('').map(item => item.replace( /^\D+/g, '') );
            this.setState({
                verificationNumber: replacedNumbers
            });
            const index = replacedNumbers.findIndex(item => item === '');
            if(index !== -1) {
                this.state.inputs[index].focus();
            } else {
                this.state.inputs[verLength - 1].focus();
            }
        } else if (number.length <= 1) {
            number = number[0];
            numbers[index] = number;
            this.setState({
                verificationNumber: numbers
            });
            if(number){
                if(this.state.inputs[index + 1]) {
                    this.state.inputs[index + 1].focus()
                }
            }
        } else if(number.length === 0) {
            if(this.state.inputs[index - 1]) {
                 this.state.inputs[index - 1].focus()
            }
        }
    }

    deleteNumber({ nativeEvent }, index) {
        if (nativeEvent.key === 'Backspace' && !this.state.verificationNumber[index]) {
            if(this.state.inputs[index - 1]) {
                this.state.inputs[index - 1].focus()
            }
        }
    }

    async verificationAction() {
        const numbers = this.state.verificationNumber.join('');

        if(numbers.length < 6 || !ifOnlyNumbers(numbers)) {
            this.props.updateConsole('Invalid OTP')
        } else {
            const res = await verifyOTPFunc(this.props.user, this.props.deviceToken, numbers);
            if(res.success) {
                signUpEvent();
                this.props.navigation.navigate('PinSetup')
            } else {
                this.props.updateConsole(res.errorMessage, res.errorCode);
            }
        }
    }

    async resendOTP() {
        this.setState({
            disableBtn: true,
            loading: true,
        });
        const res = await getOTPFunc(this.props.user, this.props.deviceToken);
        if(res.success) {
            this.props.updateConsole(res.errorMessage, res.errorCode);
            this.setState({
                disableBtn: false,
                loading: false,
                timer: TIMER,
            });
        } else {
            this.props.updateConsole(res.errorMessage, res.errorCode);
            this.setState({
                disableBtn: false,
                loading: false,
                timer: 0
            })
        }
    }

    afterTimerFinish() {
        this.setState({
            disableBtn: true
        })
    }

    async logout() {
        await logoutFunc();
        this.props.navigation.navigate('LoginOrRegister')
    }

    render() {
        return (
            <View style={styles.container}>
                <NoInternetPart/>
                <Header
                    rightComponent={{ icon: 'input', color: PRIMARY_BLUE,size: 20, onPress: () => this.logout() }}
                    // leftComponent={{ type:'font-awesome',icon: 'arrow-left', color: PRIMARY_BLUE,size: 20, onPress: () => this.props.navigation.navigate('Registration') }}
                    // centerComponent={{ text: this.state.pageTitle.toUpperCase(), style: { color: '#fff' } }}
                    centerComponent={<HeaderLogo/>}
                    containerStyle={HEADER_STYLES}
                />
                <SafeAreaView style={SCROLL_STYLES}>
                    <ScrollView>
                        <Text style={PAGE_TITLE_STYLES}>{this.state.pageTitle}</Text>
                        <View style={styles.formWrapper}>
                            <View>
                                <Text style={styles.title}>OTP CODE</Text>
                                <View style={styles.inputs}>
                                    {this.state.verificationNumber.map((item, index) => (
                                        <View key={`validation-${index}`} style={styles.inputWrapper}>
                                            <Input inputContainerStyle={INPUT_BOTTOM_COLOR}
                                                   value={item}
                                                   inputStyle={styles.input}
                                                   ref={(input) => { this.state.inputs.push(input) }}
                                                   maxLength={(index ===0)?6:1}
                                                   keyboardType="number-pad"
                                                   onKeyPress={(e) => this.deleteNumber(e, index)}
                                                   onChangeText={number =>this.changeVerificationNumber(number, index)}/>
                                        </View>
                                    ))}
                                </View>
                                <Loading navigation={this.props.navigation} margin={5}/>
                                <View style={styles.textWrapper}>
                                    <Text style={styles.text}>
                                        Please enter the OTP code sent to
                                        your mobile number before timer
                                        expire
                                    </Text>
                                    <Text style={styles.expireText}>Expire</Text>
                                    {
                                        (!this.state.loading) ? (
                                            <CountDown
                                                style={styles.timer}
                                                until={this.state.timer}
                                                size={11}
                                                onFinish={() => this.afterTimerFinish() }
                                                digitStyle={{backgroundColor: 'whitesmoke'}}
                                                digitTxtStyle={{color: PARAGRAPH_SILVER}}
                                                timeToShow={['M', 'S']}
                                                timeLabels={{m: '', s: ''}}
                                            />
                                        ) : <Loading margin={6} loading={true}/>
                                    }

                                    <Text style={{...styles.text, marginBottom: 20,color: PARAGRAPH_SILVER}}>Didn’t Receive Code?
                                        <Text
                                            onPress={() => this.resendOTP()}
                                            style={{
                                                ...styles.text,
                                                ...styles.coloredText
                                            }}> Resend Now
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.bottomWrapper}>
                                <Button
                                    onPress={() => this.verificationAction()}
                                    title="Verify OTP"
                                    disabled={this.state.disableBtn}
                                    buttonStyle={styles.button}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>

            </View>
        );
    }
}



const mapStateToProps = state => {
    return {
        deviceToken: state.deviceToken,
        user: state.user
    };
};

Verification.propTypes = {
    updateConsole: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
    updateConsole,
};

export default connect(mapStateToProps, mapDispatchToProps)(Verification);

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 5,
        color: TEXT_BLUE
    },
    timer: {
        marginBottom: 5,
        marginTop: 5,
    },
    coloredText: {
        color: TEXT_BLUE,
    },
    textWrapper: {

    },
    expireText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: PARAGRAPH_SILVER
    },
    ...BOTTOM_BUTTON_STYLES,
    ...BODY_WRAPPER_STYLES,
    ...INPUT_PASS_STYLES,
    ...PAGE_WRAPPER_STYLES,
    inputs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
});
