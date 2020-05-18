import {
    UPDATE_BALANCE,
    UPDATE_DEVICE_TOKEN,
    UPDATE_PROVIDER,
    UPDATE_USER,
    UPDATE_MOBILE_NUMBER,
    UPDATE_BILL_INFO, SELECT_BILL, UPDATE_BARCODE_INFO, CHANGE_CONSOLE
} from './action.types'
import {SUCCESS_CODE} from "../constants/response-vars";

export function updateConsole(message, errorCode = SUCCESS_CODE) {
    return { type: CHANGE_CONSOLE, console: {message, errorCode} }
}

export function updateUser(user) {
    return { type: UPDATE_USER, user }
}

export function updateMobileNumberInfo(user) {
    return { type: UPDATE_MOBILE_NUMBER, user }
}

export function updateDeviceToken(deviceToken) {
    return { type: UPDATE_DEVICE_TOKEN, deviceToken }
}


export function updateBalance(balance) {
    return { type: UPDATE_BALANCE, balance }
}

export function updateProvider(provider) {
    return { type: UPDATE_PROVIDER, provider }
}

export function updateBillInfo(billInfo) {
    return { type: UPDATE_BILL_INFO, billInfo }
}

export function selectBill(billInfo) {
    return { type: SELECT_BILL, billInfo }
}

export function updateBarcodeInfo(billInfo) {
    return { type: UPDATE_BARCODE_INFO, billInfo }
}
