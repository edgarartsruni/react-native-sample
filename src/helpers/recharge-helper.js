import {checkIfPhoneNumberNotChanged, checkNetworkConnection} from "./device-info-helper";
import {providerPlansList, providersList, recharge} from "./fetch-helper";
import {ERROR_DEFAULT_MESSAGE, SITE_URL} from "../constants/app-vars";
import {SUCCESS_CODE} from "../constants/response-vars";


export const providersListFunc = async (user) => {
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

        const res = await providersList(user);
        const jsonRes = await res.json();
        if (jsonRes.error_code === SUCCESS_CODE) {
            const providers = jsonRes.telecom_provider || [];
            return {
                providers: providers.map(item => ( {label: item.service_provider_name, value: {logo: `${SITE_URL}${item.logo}`, name: item.service_provider_name, id: item.service_provider_id}})),
                success: true,
                apiAnswer: true
            };
        } else {
            return {
                errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
                errorCode: jsonRes.error_code,
                success: false,
                apiAnswer: true
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false,
        };
    }
};

export const providerPlansListFunc = async (user, provider) => {
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

        const res = await providerPlansList(user, provider);
        const jsonRes = await res.json();
        if (jsonRes.error_code === SUCCESS_CODE) {
            const plans = jsonRes.producto || [];
            return {
                plans: plans.map(item => ({...item, logo: `${SITE_URL}${item.logo}`, precio: parseFloat(item.precio)})),
                // plans: plans,
                success: true,
                apiAnswer: true
            };
        } else {
            return {
                errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
                errorCode: jsonRes.error_code,
                success: false,
                apiAnswer: true
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false,
        };
    }
};

export const rechargeFunc = async (user, provider, plan, applyCredit) => {
    try {

        const networkConnectionInfo = await checkNetworkConnection();
        if(!networkConnectionInfo.success) {
            alert(networkConnectionInfo.alertMessage);
            return networkConnectionInfo;
        }

        const ifPhoneNumberChanges = await checkIfPhoneNumberNotChanged();
        if(!ifPhoneNumberChanges.success) {
            return  ifPhoneNumberChanges
        }

        const res = await recharge(user, provider, plan, applyCredit);
        const jsonRes = await res.json();

        if (jsonRes.error_code === SUCCESS_CODE) {
            return {
                credit:  parseFloat(jsonRes.available_credit),
                balance: parseFloat(jsonRes.available_balance),
                errorMessage: jsonRes.error_message,
                success: true
            };
        } else {
            return {
                errorMessage: jsonRes.error_message || ERROR_DEFAULT_MESSAGE,
                errorCode: jsonRes.error_code,
                success: false,
                redirect: !jsonRes.error_message
            };
        }
    } catch (e) {
        return {
            errorMessage: e.message,
            success: false
        };
    }
};
