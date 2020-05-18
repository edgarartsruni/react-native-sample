import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {Component} from "react";
import {Button, Header, Image, Input} from 'react-native-elements';
import {logoutFunc, registerDeviceFunc} from "../helpers/auth-helper";
import { updateUser, updateDeviceToken, updateConsole } from '../actions/auth.action'
import {connect} from "react-redux";
import PropTypes from "prop-types";
import INPUT_STYLES from "../styles/input-styles";
import BOTTOM_BUTTON_STYLES from "../styles/bottom-button-styles";
import HEADER_STYLES from "../styles/header-styles";
import PAGE_TITLE_STYLES from "../styles/page-title-styles";
import BODY_WRAPPER_STYLES from "../styles/body-wrapper-styles";
import {PRIMARY_BLUE} from "../constants/css-colors";
import Loading from "../parts/loading";
import PAGE_WRAPPER_STYLES from "../styles/page-wrapper-styles";
import SCROLL_STYLES from "../styles/scroll-styles";
import HeaderLogo from "../parts/header-logo";
import {ifValidPhoneNumber} from "../helpers/validators";
import NoInternetPart from "../parts/no-internet-part";
import {setCurrentScreen} from "../helpers/analytics-helper";
import {getMobileNumberFullInfo} from "../helpers/device-info-helper";


class Registration extends Component {
    state = {
        pageTitle: 'Registration',
        loading: false,
        user: {
            mobileNumber: '',
            firstName: '',
            lastName: ''
        },
        icons: {
            card: require('../assets/images/icon/card.png')
        },
        mobileNumber: {
            countryCode: '',
            number: '',
            masked: ''
        },
        imageLoaded: false,
    };


    componentDidMount() {
        setCurrentScreen(this.props.navigation.state.routeName);
        this.setState({
            user: {
                ...this.state.user,
                mobileNumber: this.props.user.mobileNumber
            }
        })
        this.getMobileNumberInfo();
    }

    async getMobileNumberInfo() {
        const mobileNumberInfo = await getMobileNumberFullInfo(this.props.user.mobileNumber.slice(1));
        this.setState({
            mobileNumber: mobileNumberInfo
        })
    }

    changeUserFields(key, text) {
        this.setState({
            user: {
                ...this.state.user,
                [key]: text,
            }
        });
    }

    async registerAction() {
        this.setState({
            loading: true
        });
        const res = await registerDeviceFunc(this.state.user, this.props.deviceToken);
        this.setState({
            loading: false
        });
        if(res.success) {
            const userId = res.userId;
            this.props.updateUser({
                ...this.state.user,
                userId: userId,
            });
            this.props.navigation.navigate('Verification');
        } else {
            this.props.updateConsole(res.errorMessage, res.errorCode);
        }
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
                    containerStyle={HEADER_STYLES}
                    centerComponent={<HeaderLogo/>}
                />
                <SafeAreaView style={SCROLL_STYLES}>
                    <ScrollView>
                        <Text style={PAGE_TITLE_STYLES}>{this.state.pageTitle}</Text>
                        <View style={styles.formWrapper}>
                            <View>
                               <View style={{...styles.mobileNumberContainer,marginLeft: 10,marginRight: 10}}>
                                   <Text style={styles.inputLabel}>Mobile Number</Text>
                                   <View style={styles.mobileNumberWrapper}>
                                       <View style={styles.mobileCountryCode}>
                                           <Text style={styles.mobileInputText}>{this.state.mobileNumber.countryCode}</Text>
                                       </View>
                                       <View style={styles.mobileInput}>
                                           <Text style={styles.mobileInputText}>{this.state.mobileNumber.masked}</Text>
                                       </View>
                                   </View>
                               </View>
                                <Input
                                    inputContainerStyle={styles.inputContainerStyle}
                                    style={styles.input}
                                    placeholder='Enter your first name'
                                    leftIcon={{ type: 'font-awesome', name: 'user', color: PRIMARY_BLUE }}
                                    inputStyle={styles.input}
                                    labelStyle={styles.label}
                                    onChangeText={(text)=>this.changeUserFields('firstName',text)}
                                    label={'First Name'}
                                />
                                <Input
                                    inputContainerStyle={styles.inputContainerStyle}
                                    style={styles.input}
                                    placeholder='Enter your last name'
                                    leftIcon={{ type: 'font-awesome', name: 'user', color: PRIMARY_BLUE }}
                                    inputStyle={styles.input}
                                    labelStyle={styles.label}
                                    onChangeText={(text)=>this.changeUserFields('lastName',text)}
                                    /* errorStyle={{ color: 'red' }}
                                     errorMessage='ENTER A VALID ERROR HERE'*/
                                    label={'Last Name'}
                                />

                                <View style={styles.imageWrapper}>
                                    <Image
                                        style={this.state.imageLoaded ? styles.image : {...styles.image,opacity: 0}}
                                        source={this.state.icons.card}
                                        onLoad={() => this.setState({imageLoaded: true})}
                                    />
                                </View>
                                <Loading navigation={this.props.navigation} loading={this.state.loading} margin={12}/>
                                <Text style={styles.text}>An OTP will be sent to your mobile {"\n"} number via WhatsApp/SMS</Text>
                            </View>

                            <View style={styles.bottomWrapper}>
                                <Button
                                    onPress={() => this.registerAction()}
                                    title="Send OTP"
                                    buttonStyle={styles.button}
                                    disabled={this.state.loading || !ifValidPhoneNumber(this.props.user.mobileNumber)}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

Registration.propTypes = {
    updateDeviceToken: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    updateConsole: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        deviceToken: state.deviceToken,
        user: state.user,
    };
};

const mapDispatchToProps = {
    updateDeviceToken,
    updateUser,
    updateConsole
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20
    },
    imageWrapper: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 20
    },
    image: {
        width: 47,
        height: 39,
    },
    ...INPUT_STYLES,
    ...BOTTOM_BUTTON_STYLES,
    ...BODY_WRAPPER_STYLES,
    ...PAGE_WRAPPER_STYLES
});
