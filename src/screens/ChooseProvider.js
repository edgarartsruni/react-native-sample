import {Image, SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {Component} from "react";
import {Button, Header} from 'react-native-elements';
import {logoutFunc} from "../helpers/auth-helper";
import {connect} from "react-redux";
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
import PropTypes from "prop-types";
import {updateConsole, updateProvider} from '../actions/auth.action'
import SELECT_STYLES, {SELECT_WIDTH} from "../styles/select-styles";
import {providersListFunc} from "../helpers/recharge-helper";
import {getMobileNumberFullInfo, getProviderInfo} from "../helpers/device-info-helper";
import ModalDropdown from 'react-native-modal-dropdown';
import {setLogoSizes} from "../helpers/image-helper";
import {setCurrentScreen} from "../helpers/analytics-helper";
import SelectOption from "../parts/select-option";

class ChooseProvider extends Component {
    state = {
        pageTitle: 'Recharge',
        loading: true,
        providers: [],
        mobileNumber: {
            countryCode: '',
            number: '',
            masked: ''
        }
    };


    componentDidMount() {
        setCurrentScreen(this.props.navigation.state.routeName);
        this.getProvidersList();
        this.getMobileNumberInfo();
    }

    async getMobileNumberInfo() {
        const mobileNumberInfo = await getMobileNumberFullInfo(this.props.user.mobileNumber.slice(1));
        this.setState({
            mobileNumber: mobileNumberInfo
        })
    }

    componentDidUpdate(props, state) {
        if(this.state.providers.length !== state.providers.length) {
            this.setItemLogoSizes();
        }
    }

    async setItemLogoSizes() {
        this.setState({
            providers: await setLogoSizes(this.state.providers)
        })
    }

    async getProvidersList() {
        const providerInfo = await getProviderInfo();
        const res = await providersListFunc(this.props.user);
        if(res.success) {
            const providers = res.providers || [];
            if(providerInfo) {
                const selectedProvider = providers.find(item => item.label.toLowerCase() === providerInfo.toLowerCase());
                if(selectedProvider) {
                    this.props.updateProvider(selectedProvider.value);
                }
            }
            this.setState({
                providers: providers,
                loading: false,
            })
        } else {
            this.setState({
                loading: false,
            });
            this.props.updateConsole(res.errorMessage, res.errorCode)
        }
    }

    chooseProvider(index, provider) {
       if(provider && provider.value) {
          this.props.updateProvider(provider.value);
       }
    }

    goToRechargePage() {
        this.props.navigation.navigate('Recharge')
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
                    leftComponent={{ icon: 'arrow-back',type: 'material', color: PRIMARY_BLUE,size: 20, onPress: () => this.props.navigation.navigate('Home') }}
                    rightComponent={{ icon: 'input', color: PRIMARY_BLUE,size: 20, onPress: () => this.logout() }}
                    containerStyle={HEADER_STYLES}
                    centerComponent={<HeaderLogo/>}
                />
                <SafeAreaView style={SCROLL_STYLES}>
                    <ScrollView>
                        <Text style={PAGE_TITLE_STYLES}>{this.state.pageTitle}</Text>
                        <View style={{...styles.formWrapper,alignItems:'center'}}>
                            <View style={{maxWidth: SELECT_WIDTH}}>
                                <View style={styles.mobileNumberContainer}>
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
                                <Text style={styles.selectLabel}>Provider</Text>
                               <ModalDropdown
                                    options={this.state.providers}
                                    style={styles.selectWrapper}
                                    textStyle={styles.selectPlaceholder}
                                    defaultValue={((this.props.provider)?this.props.provider.name:'Select your provider')}
                                    renderButtonText = {(option) => (
                                        <Text style={styles.optionTextStyles}>{option.label}</Text>
                                    )}
                                    onSelect={(index,option) => this.chooseProvider(index,option)}
                                    dropdownStyle={styles.selectDropDownStyles}
                                    renderRow={
                                        (option,index,isSelected) =>  (
                                           <SelectOption option={option}/>
                                        )
                                    }
                                />
                            </View>
                             {/*<Text>{JSON.stringify(this.props.provider)}</Text>*/}
                             <Loading navigation={this.props.navigation} loading={this.state.loading}/>
                            <View style={{...styles.bottomWrapper}}>
                                <Button
                                    onPress={() => this.goToRechargePage()}
                                    title="Continue"
                                    buttonStyle={styles.button}
                                    disabled={this.state.loading || !ifValidPhoneNumber(this.props.user.mobileNumber) || !this.props.provider}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}


ChooseProvider.propTypes = {
    updateProvider: PropTypes.func.isRequired,
    updateConsole: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        provider: state.provider,
        user: state.user,
    };
};

const mapDispatchToProps = {
    updateProvider,
    updateConsole,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseProvider);

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20
    },
    selectLabel: {
        marginTop: 8,
        ...INPUT_STYLES.inputLabel
    },
    ...INPUT_STYLES,
    ...BOTTOM_BUTTON_STYLES,
    ...BODY_WRAPPER_STYLES,
    ...PAGE_WRAPPER_STYLES,
     ...SELECT_STYLES
});
