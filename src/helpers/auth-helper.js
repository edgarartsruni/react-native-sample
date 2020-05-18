import DeviceInfo from "react-native-device-info";
import {balance, checkDevice, getOTP, login, registerDevice, setPin, updatePin, verifyOTP} from "./fetch-helper";
import AsyncStorage from '@react-native-community/async-storage';
import {
    ERROR_DEFAULT_MESSAGE,
    LOGIN_OR_REGISTER,
    MOBILE_NUMBER,
    MOBILE_NUMBER_FULL_INFO,
    NOT_EDITED_PHONE_NUMBER_INFO
} from "../constants/app-vars";
import {checkIfPhoneNumberNotChanged, checkNetworkConnection, getSimInfo} from "./device-info-helper";
import {ifValidPhoneNumber} from "./validators";
import {SUCCESS_CODE} from "../constants/response-vars";

export const checkDeviceFunc = async () => {
    let token = null;
    let phoneNumber = '';
    try {
        const networkConnectionInfo = await checkNetworkConnection();
        if(!networkConnectionInfo.success){
            alert(networkConnectionInfo.alertMessage);
            return networkConnectionInfo;
        }

        token = await DeviceInfo.getUniqueId();
        phoneNumber = await AsyncStorage.getItem(`@${MOBILE_NUMBER}`);
        const simInfo = await getSimInfo();
        const ifPhoneNumberChanges = await checkIfPhoneNumberNotChanged();
        if(!simInfo || !phoneNumber || !ifValidPhoneNumber(phoneNumber) || !ifPhoneNumberChanges.success) {
            return {
                condition: LOGIN_OR_REGISTER,
            }
        }
        const res = await checkDevice(token, phoneNumber);
        const jsonRes = await res.json();
        if (jsonRes.error_code === SUCCESS_CODE) {
            return {
                condition: jsonRes.user_type,
                userId: jsonRes.user_id,
                token: token,
                phoneNumber: phoneNumber,
                firstName:jsonRes.user_first_name,
                lastName:jsonRes.user_last_name
            };
        } else {
            return {
               errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
               errorCode: jsonRes.error_code,
               token: token
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false
        };
    }
};

export const registerDeviceFunc = async (user, deviceToken) => {
    try {
        const networkConnectionInfo = await checkNetworkConnection();
        if(!networkConnectionInfo.success){
            alert(networkConnectionInfo.alertMessage);
            return networkConnectionInfo;
        }

        const res = await registerDevice(user, deviceToken);
        const jsonRes = await res.json();
        if (jsonRes.error_code === SUCCESS_CODE) {
            return {
                userId: jsonRes.user_id,
                success: true,
            };
        } else {
            return {
               errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
                errorCode: jsonRes.error_code,
                success: false,
                json: jsonRes
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false
        };
    }
};

export const verifyOTPFunc = async (user, deviceToken, otp) => {
    try {

        const networkConnectionInfo = await checkNetworkConnection();
        if(!networkConnectionInfo.success){
            alert(networkConnectionInfo.alertMessage);
            return networkConnectionInfo;
        }

        const ifPhoneNumberChanges = await checkIfPhoneNumberNotChanged();
        if(!ifPhoneNumberChanges.success) {
            return  ifPhoneNumberChanges
        }

        const res = await verifyOTP(user, deviceToken, otp);
        const jsonRes = await res.json();
        if (jsonRes.error_code === SUCCESS_CODE) {
            return {
                userId: jsonRes.user_id,
                success: true,
                json: jsonRes
            };
        } else {
            return {
               errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
                errorCode: jsonRes.error_code,
                success: false
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false
        };
    }
};

export const getOTPFunc = async (user, deviceToken) => {
    try {

        const networkConnectionInfo = await checkNetworkConnection();
        if(!networkConnectionInfo.success){
            alert(networkConnectionInfo.alertMessage);
            return networkConnectionInfo;
        }

        const ifPhoneNumberChanges = await checkIfPhoneNumberNotChanged();
        if(!ifPhoneNumberChanges.success) {
            return  ifPhoneNumberChanges
        }

        const res = await getOTP(user, deviceToken);
        const jsonRes = await res.json();
        if (jsonRes.error_code === SUCCESS_CODE) {
            return {
                userId: jsonRes.user_id,
                success: true,
                json: jsonRes,
                errorMessage: jsonRes.error_message
            };
        } else {
            return {
                errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
                errorCode: jsonRes.error_code,
                success: false
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false
        };
    }
};

export const setPinFunc = async (user, deviceToken, pin, notNewUser) => {
    try {

        const networkConnectionInfo = await checkNetworkConnection();
        if(!networkConnectionInfo.success){
            alert(networkConnectionInfo.alertMessage);
            return networkConnectionInfo;
        }

        const ifPhoneNumberChanges = await checkIfPhoneNumberNotChanged();
        if(!ifPhoneNumberChanges.success) {
            return  ifPhoneNumberChanges
        }

        let res;
        if(notNewUser) {
             res = await updatePin(user, deviceToken, pin);
        } else {
             res = await setPin(user, deviceToken, pin);
        }
        const jsonRes = await res.json();
        if (jsonRes.error_code === SUCCESS_CODE) {
            return {
                userId: jsonRes.user_id,
                success: true,
                json: jsonRes
            };
        } else {
            return {
               errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
                errorCode: jsonRes.error_code,
                success: false
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false
        };
    }
};

export const updatePinFunc = async (user, deviceToken, pin) => {
    try {

        const networkConnectionInfo = await checkNetworkConnection();
        if(!networkConnectionInfo.success){
            alert(networkConnectionInfo.alertMessage);
            return networkConnectionInfo;
        }

        const ifPhoneNumberChanges = await checkIfPhoneNumberNotChanged();
        if(!ifPhoneNumberChanges.success) {
            return  ifPhoneNumberChanges
        }

        const res = await updatePin(user, deviceToken, pin);
        const jsonRes = await res.json();
        if (jsonRes.error_code === SUCCESS_CODE) {
            return {
                userId: jsonRes.user_id,
                success: true,
                json: jsonRes
            };
        } else {
            return {
               errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
                errorCode: jsonRes.error_code,
                success: false
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false
        };
    }
};

export const loginFunc = async (deviceToken, user,  pin) => {
    try {

        const networkConnectionInfo = await checkNetworkConnection();
        if(!networkConnectionInfo.success){
            alert(networkConnectionInfo.alertMessage);
            return networkConnectionInfo;
        }

        const ifPhoneNumberChanges = await checkIfPhoneNumberNotChanged();
        if(!ifPhoneNumberChanges.success) {
            return  ifPhoneNumberChanges
        }

        const res = await login(deviceToken, user,  pin);
        const jsonRes = await res.json();
        if (jsonRes.error_code === SUCCESS_CODE) {
            return {
                userId: jsonRes.user_id,
                success: true,
                authToken: jsonRes.auth_token
            };
        } else {
            return {
               errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
                errorCode: jsonRes.error_code,
                success: false
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false
        };
    }
};

export const balanceFunc = async (user) => {
    try {

        const networkConnectionInfo = await checkNetworkConnection();
        if(!networkConnectionInfo.success){
            alert(networkConnectionInfo.alertMessage);
            return networkConnectionInfo;
        }

        const ifPhoneNumberChanges = await checkIfPhoneNumberNotChanged();
        if(!ifPhoneNumberChanges.success) {
            return  ifPhoneNumberChanges
        }

        const res = await balance(user);
        const jsonRes = await res.json();
        if (jsonRes.error_code === SUCCESS_CODE) {
            return {
                credit: parseFloat(jsonRes.credit_unused),
                balance: parseFloat(jsonRes.balance),
                success: true
            };
        } else {
            return {
               errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
                errorCode: jsonRes.error_code,
               success: false
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false
        };
    }
};

export const logoutFunc =  async () => {
    await AsyncStorage.removeItem(`@${MOBILE_NUMBER}`);
    await AsyncStorage.removeItem(`@${MOBILE_NUMBER_FULL_INFO}`);
    await AsyncStorage.removeItem(`@${NOT_EDITED_PHONE_NUMBER_INFO}`);
};
