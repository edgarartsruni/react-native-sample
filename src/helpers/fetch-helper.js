import {API_URL} from "../constants/app-vars";
import {Clipboard} from 'react-native'

export const checkDevice = (deviceToken, phoneNumber) => {
    return fetch(`${API_URL}user/check/device`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mobile_number: phoneNumber,
            device_token: deviceToken,
        }),
    })
};

export const registerDevice = (user, deviceToken) => {
    return fetch(`${API_URL}user/register`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            device_token: deviceToken,
            mobile_number: user.mobileNumber,
            user_first_name: user.firstName,
            user_last_name: user.lastName,
            device_type: "MOBILE"
        }),
    })
};

export const getOTP = (user, deviceToken) => {
    return fetch(`${API_URL}user/mobile-number/verification/resend-otp`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user.userId,
            mobile_number: user.mobileNumber,
            device_token: deviceToken
        }),
    })
};

export const verifyOTP = (user, deviceToken, otp) => {
    return fetch(`${API_URL}user/mobile-number/verification-otp`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user.userId,
            mobile_number: user.mobileNumber,
            device_token: deviceToken,
            otp:otp
        }),
    })
};


export const setPin = (user, deviceToken, pin) => {

    return fetch(`${API_URL}user/pin-setup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user.userId,
            mobile_number: user.mobileNumber,
            device_token: deviceToken,
            pin:pin
        }),
    })
};

export const updatePin = (user, deviceToken, pin) => {
    return fetch(`${API_URL}user/pin-update`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user.userId,
            mobile_number: user.mobileNumber,
            device_token: deviceToken,
            pin:pin
        }),
    })
};

export const login = (deviceToken,user, pin) => {
    return fetch(`${API_URL}user/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mobile_number: user.mobileNumber,
            device_token: deviceToken,
            pin:pin
        }),
    })
};


export const balance = user => {
    return fetch(`${API_URL}user/wallet-info?user_id=${user.userId}&auth_token=${user.authToken}`);
};

export const providersList = user => {
    // Clipboard.setString(`${API_URL}phone-recharge/telecom-provider-list?user_id=${user.userId}&auth_token=${user.authToken}`)
    return fetch(`${API_URL}phone-recharge/telecom-provider-list?user_id=${user.userId}&auth_token=${user.authToken}`);
};

export const providerPlansList = (user, provider) => {

    return fetch(`${API_URL}phone-recharge/telecom-provider-plans`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user.userId,
            auth_token: user.authToken,
            mobile_number: user.mobileNumber,
            service_provider_id:provider.id,
            service_provider_name:provider.name
        }),
    })
};

export const recharge = (user, provider, plan, applyCredit) => {
    return fetch(`${API_URL}phone-recharge/payment`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user.userId,
            auth_token: user.authToken,
            mobile_number: user.mobileNumber,
            idServicio: plan.idServicio,
            idProducto: plan.idProducto,
            precio: plan.precio,
            credit_type: applyCredit,
        }),
    })
};

export const fetchCountryCode = () => {
    return fetch(`https://ipapi.co/country_calling_code`);
};


export const billTypesList = user => {
    return fetch(`${API_URL}utility-bill/type-list?user_id=${user.userId}&auth_token=${user.authToken}`);
};

export const billsList = (user, billType) => {
    return fetch(`${API_URL}utility-bill/service-provider-list`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user.userId,
            auth_token: user.authToken,
            bill_type_id: billType.id,
            bill_type: billType.type
        }),
    })
};


export const billPayment = (user, billInfo, applyCredit) => {
    return fetch(`${API_URL}utility-bill/payment`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user.userId,
            auth_token: user.authToken,
            credit_type: applyCredit,
            referencia: billInfo.barcode.SERVICE_NUMBER.value,
            montoPago: `${billInfo.barcode.AMOUNT.value}`,
            idServicio: billInfo.selectedBill.idServicio,
            idProducto: billInfo.selectedBill.idProducto,
            bill_type: billInfo.type
        }),
    })
};
