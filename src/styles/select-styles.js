import INPUT_STYLES from "./input-styles";
import {PRIMARY_BLUE} from "../constants/css-colors";
import {Dimensions} from 'react-native';
/*
const SELECT_STYLES = {
    inputIOS: {
        color: 'white',
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
    },
    inputAndroid: {
       ...INPUT_STYLES.inputContainerStyle,
        color: PRIMARY_BLUE,
        margin: 10,
        padding: 0,
        height: 45,
        borderRadius: 4
    },
    icon: {
        // position: 'absolute',
        // backgroundColor: 'transparent',
        // borderTopWidth: 5,
        // borderTopColor: '#00000099',
        // borderRightWidth: 5,
        // borderRightColor: 'transparent',
        // borderLeftWidth: 5,
        // borderLeftColor: 'transparent',
        // width: 0,
        // height: 0,
        // top: 20,
        // right: 15,
    },
    placeholderColor: PRIMARY_BLUE,
    underline: { borderTopWidth: 0 }
};*/

export const SELECT_WIDTH = 280;

const SELECT_STYLES = {
    selectWrapper: {
        ...INPUT_STYLES.inputContainerStyle,
        width: SELECT_WIDTH,
        // marginLeft: 10,
        // marginTop: 10
    },
    selectPlaceholder: {
        color: PRIMARY_BLUE,
        padding: 12,
        fontSize: 15,
    },
    selectDropDownStyles: {
        justifyContent: 'center',
        width: SELECT_WIDTH,
        // height: 'auto',
    },
    optionStyles: {
        padding: 8,
        // paddingTop: 10,
        // paddingBottom: 10,
        backgroundColor:'#dee7f6',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionTextStyles: {
        color: PRIMARY_BLUE,
        fontSize: 15,
        marginLeft: 5
    }
};

export default SELECT_STYLES;


