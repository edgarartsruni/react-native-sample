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
import {PRIMARY_BLUE, TEXT_BLUE} from "../constants/css-colors";
import PAGE_WRAPPER_STYLES from "../styles/page-wrapper-styles";
import SCROLL_STYLES from "../styles/scroll-styles";
import HeaderLogo from "../parts/header-logo";
import NoInternetPart from "../parts/no-internet-part";
import PropTypes from "prop-types";
import {updateBillInfo, updateConsole} from '../actions/auth.action'
import SELECT_STYLES, {SELECT_WIDTH} from "../styles/select-styles";
import ModalDropdown from 'react-native-modal-dropdown';
import {setCurrentScreen} from "../helpers/analytics-helper";
import {billsListFunc} from "../helpers/bill-payment-helper";
import Loading from "../parts/loading";
import {setLogoSizes} from "../helpers/image-helper";
import SelectOption from "../parts/select-option";


class ChooseBill extends Component {
    state = {
        pageTitle: 'Bill Payment',
        loading: true,
        items:[],
        barcode: {
            logo: require('../assets/images/barcode.png'),
            show: false
        }
    };


    componentDidMount() {
        if(!this.props.billInfo?.type) {
            this.props.navigation.navigate('ChooseBillType')
        }
        setCurrentScreen(this.props.navigation.state.routeName);
        this.getItemsList();
    }

    componentDidUpdate(props, state) {
        if(this.state.items.length !== state.items.length) {
            this.setItemLogoSizes();
        }
    }

    async setItemLogoSizes() {
        this.setState({
            items: await setLogoSizes(this.state.items)
        })
    }

    async getItemsList() {
        const res = await billsListFunc(this.props.user, this.props.billInfo);
        if(res.success) {
            const items = res.result || [];
            this.setState({
                items: items,
                loading: false,
            })
        } else {
            this.setState({
                loading: false,
            })
            this.props.updateConsole(res.errorMessage, res.errorCode)
        }
    }

    chooseBill(index, bill) {
        if(bill && bill.value) {
            this.props.updateBillInfo(bill.value);
        }
    }

    confirmAction() {
        this.props.navigation.navigate('BillQRCode')
    }

    async logout() {
        await logoutFunc();
        this.props.navigation.navigate('LoginOrRegister')
    }

    imageLoaded(key) {
        const item = this.state[key];
        this.setState({
            [key]: {
                ...item,
                show: true
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <NoInternetPart/>
                <Header
                    leftComponent={{ icon: 'arrow-back',type: 'material', color: PRIMARY_BLUE,size: 20, onPress: () => this.props.navigation.navigate('ChooseBillType') }}
                    rightComponent={{ icon: 'input', color: PRIMARY_BLUE,size: 20, onPress: () => this.logout() }}
                    containerStyle={HEADER_STYLES}
                    centerComponent={<HeaderLogo/>}
                />
                <SafeAreaView style={SCROLL_STYLES}>
                    <ScrollView>
                        <Text style={PAGE_TITLE_STYLES}>{this.state.pageTitle}</Text>
                        <View style={{...styles.formWrapper,alignItems:'center'}}>
                            <View style={{maxWidth: SELECT_WIDTH}}>
                                <Text style={styles.selectLabel}>Provider</Text>
                                <ModalDropdown
                                    options={this.state.items}
                                    style={styles.selectWrapper}
                                    textStyle={styles.selectPlaceholder}
                                    defaultValue={((this.props.billInfo?.selectedBill)?this.props.billInfo.selectedBill.name:'Select Provider')}
                                    renderButtonText = {(option) => (
                                        <Text style={styles.optionTextStyles}>{option.label}</Text>
                                    )}
                                    onSelect={(index,option) => this.chooseBill(index,option)}
                                    dropdownStyle={{
                                        ...styles.selectDropDownStyles,
                                        height: 'auto'
                                    }}
                                    renderRow={
                                        (option,index,isSelected) =>  (
                                            <SelectOption option={option}/>
                                        )
                                    }
                                />
                            </View>
                            <Text style={styles.text}>
                                Choose a provider and go to barcode scanning
                            </Text>
                            <Image
                                style={this.state.barcode.show ? styles.barcodeLogo : {...styles.barcodeLogo, opacity: 0}}
                                source={this.state.barcode.logo}
                                onLoad={() => this.imageLoaded('barcode')}
                            />
                            <Loading navigation={this.props.navigation} loading={this.state.loading}/>
                            <View style={{...styles.bottomWrapper}}>
                                <Button
                                    onPress={() => this.confirmAction()}
                                    title="Continue"
                                    buttonStyle={styles.button}
                                    disabled={!this.props.billInfo?.selectedBill}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}


ChooseBill.propTypes = {
    updateBillInfo: PropTypes.func.isRequired,
    updateConsole: PropTypes.func.isRequired,
    billInfo: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        user: state.user,
        balance: state.balance,
        billInfo: state.billInfo
    };
};

const mapDispatchToProps = {
    updateBillInfo,
    updateConsole,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseBill);

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 15,
        color: TEXT_BLUE,
        marginBottom: 15,
    },
    selectLabel: {
        marginTop: 8,
        ...INPUT_STYLES.inputLabel
    },
    barcodeLogo: {
        width: 206,
        height: 40,
    },
    ...INPUT_STYLES,
    ...BOTTOM_BUTTON_STYLES,
    ...BODY_WRAPPER_STYLES,
    ...PAGE_WRAPPER_STYLES,
    ...SELECT_STYLES
});
