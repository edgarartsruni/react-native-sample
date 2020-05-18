import {StyleSheet, View} from "react-native";
import React, {Component} from "react";
import {Header} from 'react-native-elements';
import NoInternetPart from "../parts/no-internet-part";
import {PRIMARY_BLUE} from "../constants/css-colors";
import HEADER_STYLES from "../styles/header-styles";
import HeaderLogo from "../parts/header-logo";
import {connect} from "react-redux";
import {logoutFunc} from "../helpers/auth-helper";
import PAGE_WRAPPER_STYLES from "../styles/page-wrapper-styles";
import BottomBar from "../parts/bottom-bar";
import {updateBalance, updateConsole} from "../actions/auth.action";
import PropTypes from "prop-types";
import {billPaymentEvent, billPaymentPageEvent, setCurrentScreen} from "../helpers/analytics-helper";
import {billPaymentFunc} from "../helpers/bill-payment-helper";
import PaymentPart from "../parts/payment-part";

const LOGO_REDUCER = 1.8;

class BillPayment extends Component {

    state = {
        pageTitle: 'NSL',
        loading: false,
        overlayText: '',
        barcode: null
    };


    componentDidMount() {
       if(!this.props.billInfo?.barcode) {
            this.props.navigation.navigate('BillQRCode')
        }
        setCurrentScreen(this.props.navigation.state.routeName);
        billPaymentPageEvent(this.props.billInfo, this.props.user);
    }


     pay = async applyCredit => {
        const {credit, balance} = this.props.balance;
        if ((credit + balance) < this.props.billInfo.barcode.AMOUNT.value) {
            this.props.updateConsole('Insufficient Balance, Please Top Up your account to add more balance')
        } else {
            this.setState({
                loading: true,
                overlayText: ''
            });
            const res = await billPaymentFunc(
                this.props.user,
                this.props.billInfo,
                applyCredit
            );
            if (res.success) {
                this.setState({
                    overlayText: res.errorMessage,
                    loading: false,
                });
                const balance = {
                    credit:(typeof res.credit === "number")?res.credit:credit,
                    balance:(typeof res.balance === "number")?res.balance:balance
                };
                this.props.updateBalance(balance);
                billPaymentEvent(this.props.billInfo, this.props.user, balance, applyCredit);
            } else if(!res.success && res.redirect) {
                this.props.navigation.navigate('ChooseBillType');
            } else {
                this.setState({
                    loading: false
                });
                this.props.updateConsole(res.errorMessage, res.errorCode);
            }
        }
    }

    goToBalancePage = (success = true) => {
        this.setState({
            overlayText: ''
        });
        if(success) {
            this.props.navigation.navigate('Balance')
        }
    };

    async logout() {
        await logoutFunc();
        this.props.navigation.navigate('LoginOrRegister')
    }

    render() {
        const {selectedBill, barcode} = this.props.billInfo;
        let entry = null;
        if(selectedBill && barcode) {
            entry = {
                width: selectedBill.width*LOGO_REDUCER || 0,
                height: selectedBill.height*LOGO_REDUCER || 0,
                value: barcode?.AMOUNT?.value,
                text: barcode.SERVICE_NUMBER.prettyValue,
                logo: selectedBill.logo,
                loading: this.state.loading,
                overlayText: this.state.overlayText
            };
        }

        return (
            <View style={styles.container}>
                <NoInternetPart/>
                <Header
                    leftComponent={{ icon: 'arrow-back',type: 'material', color: PRIMARY_BLUE,size: 20, onPress: () => this.props.navigation.navigate('BillQRCode') }}
                    rightComponent={{ icon: 'input', color: PRIMARY_BLUE,size: 20, onPress: () => this.logout() }}
                    containerStyle={HEADER_STYLES}
                    centerComponent={<HeaderLogo/>}
                />
                <PaymentPart
                    entry={entry}
                    action={this.pay}
                    onPaySuccess={this.goToBalancePage}
                    navigation={this.props.navigation}
                />
                <BottomBar navigation={this.props.navigation}/>
            </View>
        );
    }
}

BillPayment.propTypes = {
    billInfo: PropTypes.object.isRequired,
    updateConsole: PropTypes.func.isRequired,
    updateBalance: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
    updateBalance,
    updateConsole,
};

const mapStateToProps = state => {
    return {
        user: state.user,
        balance: state.balance,
        billInfo: state.billInfo,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillPayment);

const styles = StyleSheet.create({
    container: {
        ...PAGE_WRAPPER_STYLES.container,
        justifyContent: 'space-between',
    }
});
