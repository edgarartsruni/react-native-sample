import {
    CHANGE_CONSOLE,
    SELECT_BILL,
    UPDATE_BALANCE, UPDATE_BARCODE_INFO, UPDATE_BILL_INFO,
    UPDATE_DEVICE_TOKEN, UPDATE_MOBILE_NUMBER, UPDATE_PROVIDER,
    UPDATE_USER
} from '../actions/action.types'
import {SUCCESS_CODE} from "../constants/response-vars";


const INITIAL_STATE = {
    console: {
        message: '',
        errorCode: SUCCESS_CODE
    },
    isLoading: true,
    user: {
        userId: null,
        mobileNumber: '',
        firstName: '',
        lastName: '',
        authToken: null
    },
    deviceToken: '',
    provider: null,
    balance: {
        credit: 0,
        balance: 0
    },
    mobileNumberInfo: {
        countryCode: '',
        number: '',
        masked: ''
    },
    billInfo: {
        name: '',
        type: '',
        id: '',
        selectedBill: null,
        barcode: null
    }
};

export const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHANGE_CONSOLE:
            return {
                ...state,
                console: action.console
            };
        case UPDATE_USER:
            return {
                ...state,
                user: action.user
            };
         case UPDATE_MOBILE_NUMBER:
            return {
                ...state,
                mobileNumberInfo: action.mobileNumberInfo
            };
        case UPDATE_DEVICE_TOKEN:
            return {
                ...state,
                deviceToken: action.deviceToken
            };
        case UPDATE_PROVIDER:
            return {
                ...state,
                provider: action.provider
            };
        case UPDATE_BALANCE:
            return {
                ...state,
                balance: action.balance
            };
        case SELECT_BILL:
            return {
                ...state,
                billInfo: {
                    ...action.billInfo,
                    selectedBill: null,
                    barcode: null
                }
        };
        case UPDATE_BILL_INFO:
            return {
                ...state,
                billInfo: {
                    ...state.billInfo,
                    selectedBill: action.billInfo,
                    barcode: null
                }
            };
        case UPDATE_BARCODE_INFO:
            return {
                ...state,
                billInfo: {
                    ...state.billInfo,
                    barcode: action.billInfo
                }
            };
        default:
            return state
    }
}
