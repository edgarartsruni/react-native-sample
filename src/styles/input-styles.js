import {PRIMARY_BLUE, TEXT_BLUE} from "../constants/css-colors";

const INPUT_STYLES = {
     input: {
         padding: 8,
         color: PRIMARY_BLUE,
     },
     mobileNumberWrapper: {
      flexDirection: 'row',
     },
    mobileNumberContainer: {
        // marginLeft: 10,
        // marginRight: 10,
    },
    inputLabel: {
        marginBottom: 8,
        color: TEXT_BLUE,
        fontWeight: 'bold',
        fontSize: 16
    },
    label: {
        marginTop: 8,
        marginBottom: 10,
        color: TEXT_BLUE,
    },
    inputContainerStyle: {
         backgroundColor:'#dee7f6',
         borderBottomWidth: 0,
         borderRadius: 4,
    },
    mobileCountryCode: {
        backgroundColor:'white',
        borderWidth: 2,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        borderColor: '#dee7f6',
        minWidth: 55,
        alignItems: 'center',
        justifyContent: 'center',
        color: PRIMARY_BLUE,
        fontSize: 16,
        textAlign: 'center'
    },
    mobileInputText: {
        fontSize: 16,
        color: PRIMARY_BLUE,
    },
    mobileInput: {
        padding: 12,
        flex: 1,
        fontSize: 16,
        color: PRIMARY_BLUE,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        borderRadius: 4,
        backgroundColor: '#dee7f6',
    }
};

export default INPUT_STYLES;
