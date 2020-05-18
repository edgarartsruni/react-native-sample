import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import React, {Component} from "react";
import {PRIMARY_BLUE} from "../constants/css-colors";
import {Button, Overlay} from "react-native-elements";
import OVERLAY_PART, {OVERLAY_BACKGROUND_COLOR} from "../styles/overlay-styles";
import {connect} from "react-redux";
import {updateConsole} from "../actions/auth.action";
import PropTypes from "prop-types";
import {DUPLICATED_PAYMENT, NEED_TO_LOGIN, NOT_AUTHORIZED} from "../constants/response-vars";


const PRETTIFY_ERRORS = [{
    key: 'JSON Parse error: Unexpected identifier “object”',
    value: 'Seems something went wrong. Please try again later.'
}, {
    key: `JSON Parse error: Expected '}'`,
    value: 'Seems something went wrong. Please try again later.'
}];

class Loading extends Component {

    state = {
        isVisible: false
    };


    close() {
        const code = this.props.console?.errorCode;
        this.props.updateConsole(null);


        switch(code) {
            case NOT_AUTHORIZED:
                this.props.navigation.navigate('Login');
                break;
            case DUPLICATED_PAYMENT:
                this.props.navigation.navigate('Balance');
                break;
            case NEED_TO_LOGIN:
                this.props.navigation.navigate('LoginOrRegister');
                break;
        }
    }

    render() {

        let message = this.props.console?.message;
        const pretty = PRETTIFY_ERRORS.find(item => item.key === message);
        if(pretty) {
            message = pretty.value;
        }

        return (
            <View style={{...styles.container, margin: this.props.margin || 20}}>
                {
                    (this.props.loading)?<ActivityIndicator size={25} color={PRIMARY_BLUE} />: <View style={styles.skeleton}>
                        <Overlay
                            overlayStyle={styles.overlayContainer}
                            isVisible={!!this.props.console?.message}
                            windowBackgroundColor="rgba(255, 255, 255, .5)"
                            overlayBackgroundColor={OVERLAY_BACKGROUND_COLOR}
                            width="auto"
                            height="auto"
                            onBackdropPress={() => this.close() }
                        >
                            <View style={styles.overlayWrapper}>
                                <Text style={styles.overlayText}>{message}</Text>
                                <Button
                                    titleStyle={styles.overlayBtnText}
                                    buttonStyle={styles.overlayBtnWrapper}
                                    containerStyle={styles.overlayBtn}
                                    title="Ok"
                                    onPress={() => this.close()}
                                    raised
                                />
                            </View>
                        </Overlay>
                    </View>
                }
            </View>
        )
    }
}

Loading.propTypes = {
    updateConsole: PropTypes.func.isRequired,
};


const mapStateToProps = state => {
    return {
        console: state.console
    };
};

const mapDispatchToProps = {
    updateConsole
};

export default connect(mapStateToProps, mapDispatchToProps)(Loading);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    skeleton: {
        height: 25,
        alignItems: 'center'
    },
    ...OVERLAY_PART
});
