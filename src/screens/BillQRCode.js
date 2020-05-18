import React, { Component, useState , useEffect } from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Animated, Easing, Vibration} from 'react-native';
import {RNCamera} from 'react-native-camera';
import NoInternetPart from "../parts/no-internet-part";
import {Button, Header, Icon, Overlay} from "react-native-elements";
import {ICON_SILVER, PARAGRAPH_SILVER, PRIMARY_BLUE, RED} from "../constants/css-colors";
import HEADER_STYLES from "../styles/header-styles";
import HeaderLogo from "../parts/header-logo";
import INPUT_STYLES from "../styles/input-styles";
import BODY_WRAPPER_STYLES from "../styles/body-wrapper-styles";
import PAGE_WRAPPER_STYLES from "../styles/page-wrapper-styles";
import {changeBarcodeData} from "../helpers/bill-helper";
import OVERLAY_PART, {OVERLAY_BACKGROUND_COLOR} from "../styles/overlay-styles";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {updateBarcodeInfo, updateConsole} from "../actions/auth.action";
import {logoutFunc} from "../helpers/auth-helper";
import Loading from "../parts/loading";

const INITIAL_STATE = {
    flashMode: false,
    success: false,
    onPay: false,
    barcode: null
};


const FadeInView = (props) => {
    const [fadeAnim] = useState(new Animated.Value(0))  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    // Infinite: true
                }
            ),
            // {resetBeforeIteration: false}
        ).start();
    }, []);

    const movingMargin = fadeAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ["5%", "55%", "5%"]
    });

    return (
        <Animated.View                 // Special animatable View
            style={{
                ...props.style,
                top: movingMargin,         // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
}


class BillQRCode extends Component {

    state = INITIAL_STATE;


    componentDidMount() {
        if(!this.props.billInfo?.selectedBill) {
            this.props.navigation.navigate('ChooseBill')
        }
        this.props.navigation.addListener('willFocus', () => {
            this.setState(INITIAL_STATE)
        })
        //TODO comment
        // this.onBarCodeRead({data: '82213126903137RH09BM000000437724'})
    }

    onBarCodeRead (e) {
        // water - 82213126903137RH09BM000000437724
        // electricity - 013001102022812003140000002925
       if(!this.state.success && !this.state.onPay) {
           const res = changeBarcodeData(this.props.billInfo.type, e.data);
           if(res.success) {
               Vibration.vibrate(1000);
               this.props.updateConsole(null);
               this.setState({
                   success:true,
                   flashMode: false,
                   barcode:  res.data,
               });
           } else {
               this.setState({
                   barcode: null
               });
               this.props.updateConsole(res.errorMessage, res.errorCode);
           }
       }
    }

    pay() {
        this.props.updateConsole(null);
        this.props.updateBarcodeInfo(this.state.barcode);
        this.setState({
            success: false,
            onPay: true
        }, () => {
            this.props.navigation.navigate('BillPayment');
        })
    }

    cancel() {
        this.setState({
            success: false
        });
    }

    flashMode(value) {
        this.setState({ flashMode: !value });
    }

    async logout() {
        await logoutFunc();
        this.props.navigation.navigate('LoginOrRegister')
    }


    render() {

        const {barcode} = this.state;

        return (
            <View style={styles.container}>
                <NoInternetPart/>
                <Header
                    leftComponent={{ icon: 'arrow-back',type: 'material', color: PRIMARY_BLUE,size: 20, onPress: () => this.props.navigation.navigate('ChooseBill') }}
                    rightComponent={{ icon: 'input', color: PRIMARY_BLUE,size: 20, onPress: () => this.logout() }}
                    containerStyle={HEADER_STYLES}
                    centerComponent={<HeaderLogo/>}
                />
                <RNCamera
                    style={styles.preview}
                    flashMode={(this.state.flashMode)?RNCamera.Constants.FlashMode.torch:RNCamera.Constants.FlashMode.off}
                    onBarCodeRead={(e) => this.onBarCodeRead(e)}
                    ref={cam => this.camera = cam}
                >

                    <View style={styles.barcodeWrapper}>
                        <View style={styles.leftTopCorner}/>
                        <View style={styles.rightTopCorner}/>
                        <View style={styles.leftBottomCorner}/>
                        <View style={styles.rightBottomCorner}/>
                        {
                            (!this.state.success) ? (
                                <FadeInView style={styles.scannerLaser}>
                                    <View style={styles.scannerBackground}/>
                                </FadeInView>
                            ) : null
                        }
                    </View>

                    <Overlay
                        overlayStyle={styles.overlayContainer}
                        isVisible={this.state.success}
                        windowBackgroundColor="rgba(255, 255, 255, .5)"
                        overlayBackgroundColor={OVERLAY_BACKGROUND_COLOR}
                        width="auto"
                        height="auto"
                        onBackdropPress={() => this.cancel() }
                    >
                        <View style={{...styles.overlayWrapper,...styles.infoOverlayWrapper}}>

                            {
                                (barcode)? (
                                    Object.keys(barcode).map(key => (
                                        <View key={key} style={styles.infoWrapper}>
                                            <Text style={styles.infoLabel}>{barcode[key].label}:</Text>
                                            <Text style={styles.infoValue}>{barcode[key].prettyValue}</Text>
                                        </View>
                                    ))
                                ) : null
                            }
                            <View style={{marginTop:20,...styles.overlayButtonWrapper}}>
                                <Button
                                    titleStyle={styles.overlayBtnText}
                                    buttonStyle={styles.overlayBtnWrapper}
                                    containerStyle={styles.overlayBtn}
                                    title="Scan"
                                    onPress={() => this.cancel()}
                                    raised
                                />
                                <Button
                                    titleStyle={styles.overlayBtnText}
                                    buttonStyle={styles.overlayBtnWrapper}
                                    containerStyle={styles.overlayBtn}
                                    title="Pay"
                                    disabled={!this.state.barcode}
                                    onPress={() => this.pay()}
                                    raised
                                />
                            </View>
                        </View>
                    </Overlay>
                   <Loading navigation={this.props.navigation} />
                </RNCamera>
                {<View style={styles.bottomOverlay}>
                    <TouchableOpacity onPress={() => this.flashMode(this.state.flashMode)}>
                        <Icon
                            size={50}
                            name={this.state.flashMode?'flash-off':'flash-on'}
                            type='material'
                            color={ICON_SILVER}
                        />
                    </TouchableOpacity>
                </View>}
            </View>
        )
    }
}

BillQRCode.propTypes = {
    updateBarcodeInfo: PropTypes.func.isRequired,
    updateConsole: PropTypes.func.isRequired,
    billInfo: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
    updateBarcodeInfo,
    updateConsole,
};

const mapStateToProps = state => {
    return {
        user: state.user,
        billInfo: state.billInfo
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillQRCode);



const opacityColor = "rgba(255, 0, 0, 0.5)";

const cornerStyles = {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor : opacityColor // invisible color
};

const cornerPadding = 15;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    errorMessage: {
      backgroundColor: RED,
      padding: 2,
      color: 'white'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    cameraIcon: {
        margin: 5,
        height: 40,
        width: 40
    },
    bottomOverlay: {
        position: "absolute",
        width: "100%",
        flex: 20,
        bottom: 40,
        flexDirection: "row",
        justifyContent: "center"
    },
    text: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20
    },
    infoOverlayWrapper: {
        alignItems: 'flex-start'
    },
    infoWrapper: {
        marginTop: -3,
    },
    infoLabel: {
        ...INPUT_STYLES.inputLabel
    },
    infoValue: {
        ...INPUT_STYLES.inputLabel,
        color: PARAGRAPH_SILVER,
        marginTop: -10,
    },
    overlayText: {

    },
    barcodeWrapper: {
        position: 'absolute',
        top: "35%",
        width: '100%',
        height: '30%',
    },
    leftTopCorner: {
        top: 0,
        left: cornerPadding,
        borderLeftWidth: 4,
        borderTopWidth: 4,
        ...cornerStyles
    },
    rightTopCorner: {
        top: 0,
        right: cornerPadding,
        borderRightWidth: 4,
        borderTopWidth: 4,
        ...cornerStyles
    },
    leftBottomCorner: {
        bottom: 0,
        left: cornerPadding,
        borderLeftWidth: 4,
        borderBottomWidth: 4,
        ...cornerStyles
    },
    rightBottomCorner: {
        bottom: 0,
        right: cornerPadding,
        borderRightWidth: 4,
        borderBottomWidth: 4,
        ...cornerStyles
    },
    scannerLaser: {
       position: 'absolute',
       left: '7%',
       width: '86%',
       height: "40%",
        borderBottomWidth: 8,
        borderColor : opacityColor // invisible color
    },
    scannerBackground: {
        width: '90%',
        position: 'absolute',
        height: "100%",
        top: 0,
        left: '5%',
        // borderRadius: 5000,
        backgroundColor :"rgba(255, 255, 255, 0.3)", // invisible color,
    },
    ...BODY_WRAPPER_STYLES,
    ...PAGE_WRAPPER_STYLES,
    ...OVERLAY_PART
});
