import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Card} from "react-native-elements";
import {balanceFunc} from "../helpers/auth-helper";
import {connect} from "react-redux";
import { GREEN, PRIMARY_BLUE, RED} from "../constants/css-colors";
import CARD_STYLES from "../styles/card-styles";
import PropTypes from "prop-types";
import {updateBalance, updateConsole} from "../actions/auth.action";

class BalancePart extends Component {

    componentDidMount() {
        this.getUserBalance();
    }

    async getUserBalance() {
        const res = await balanceFunc(this.props.user);
        if(res.success) {
            const balance = {
                credit:res.credit || 0,
                balance:res.balance || 0
            };
            this.props.updateBalance(balance);
        } else {
            if (res.simChanged) {
                this.props.updateConsole(res.errorMessage, res.errorCode)
            }
           /*if (res.errorMessage && res.errorMessage.length) {

           }*/
        }
    }

    render() {

        const { balance, credit } = this.props.balance;

        return (
            <Card containerStyle={CARD_STYLES}
                  wrapperStyle={styles.cardWrapper}>
                <View>
                    <Text style={styles.text}>Balance</Text>
                    <Text style={{
                        ...styles.text,
                        ...styles.value,
                        color: GREEN
                    }}>${balance.toFixed(2)}</Text>
                </View>
                <View>
                    <Text style={styles.text}>Credit</Text>
                    <Text style={{
                        ...styles.text,
                        ...styles.value,
                        color: RED
                    }}>${credit.toFixed(2)}</Text>
                </View>
            </Card>
        )

    }

}

BalancePart.propTypes = {
    updateBalance: PropTypes.func.isRequired,
    updateConsole: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        deviceToken: state.deviceToken,
        user: state.user,
        balance: state.balance,
    };
};

const mapDispatchToProps = {
    updateBalance,
    updateConsole,
};

export default connect(mapStateToProps,mapDispatchToProps)(BalancePart);

const styles = StyleSheet.create({
    cardWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    text: {
        fontSize: 15,
        textAlign: 'center',
        color: PRIMARY_BLUE,
        marginBottom: 3
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
