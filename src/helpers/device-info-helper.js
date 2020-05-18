export const getDeviceFullInfo = async () => {
    const sizes = await getDeviceResolution();
    let countryCode = '';
    const simInfo = await getSimInfo();
    if (simInfo) {
        countryCode = simInfo?.countryCode0 || simInfo?.countryCode1 || '';
    }
    return {
        provider: DeviceInfo.getCarrierSync(),
        app_version: DeviceInfo.getVersion(),
        device_brand:  DeviceInfo.getManufacturerSync(),
        device_model:  DeviceInfo.getDeviceNameSync(),
        device_type: DeviceInfo.getDeviceType(),
        os_version: `${DeviceInfo.getApiLevelSync()}`,
        screen_resolution: sizes.resolution,
        country_code: countryCode.toUpperCase()
    }
};


export const getDeviceToken = async () => {

};

export const getDevicePhoneNumberInfo = async (phoneNum = '') => {
    const networkConnectionInfo = await checkNetworkConnection();
    if(!networkConnectionInfo.success){
        alert(networkConnectionInfo.alertMessage);
    }

    let fullPhoneNumber = phoneNum;
    let code = '';
    let provider = '';
    const simInfo = await getSimInfo();

    if (!simInfo) {
        return  {
            nonEditable: true,
            errorMessage: NO_SIM_ERROR,
            countryCode:  await getCountryCode()
        }
    }

     fullPhoneNumber = phoneNum || simInfo?.phoneNumber0 || simInfo?.phoneNumber1 || DeviceInfo.getPhoneNumberSync();
     code = simInfo?.countryCode0 || simInfo?.countryCode1 || '';
     provider = simInfo?.carrierName0 || simInfo?.carrierName1 || ''
     if(!fullPhoneNumber || fullPhoneNumber === 'unknown' || !ifValidPhoneNumber(fullPhoneNumber)) {
         fullPhoneNumber = phoneNum;
     } else {
            // nonEditable = true;
     }
    fullPhoneNumber = fullPhoneNumber.replace('+','');
    const countryCode = await getCountryCode(code);
    const phoneNumber = fullPhoneNumber.replace(countryCode.slice(1),'');


    return {
        fullPhoneNumber: fullPhoneNumber,
        phoneNumber: phoneNumber,
        maskedPhoneNumber: maskPhoneNumber(phoneNumber),
        countryCode: countryCode,
        noNetwork: networkConnectionInfo.noNetwork,
        provider: provider
    }


};

export const getSimInfo = async () => {
    let simInfo = null;
    try {
        const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        );
        if (permission === PermissionsAndroid.RESULTS.GRANTED) {
            const RNSimData = require('react-native-sim-data').default;
            simInfo = RNSimData.getSimInfo();
        }
    } catch (e) {
        simInfo = null;
    }
    return simInfo;
};

export const getMobileNumberFullInfo = async phoneNumber => {
    let request = false;

    try {
        const mobileNumberFullInfo = JSON.parse(await AsyncStorage.getItem(`@${MOBILE_NUMBER_FULL_INFO}`));
        if(!ifValidPhoneNumber(mobileNumberFullInfo.number)) {
            request = true;
        } else {
            return mobileNumberFullInfo;
        }
    } catch (e) {
        request = true;
    }


    if(request) {
        const res = await getDevicePhoneNumberInfo(phoneNumber);
        return {
            countryCode: res.countryCode,
            number: res.phoneNumber,
            masked: maskPhoneNumber(res.phoneNumber)
        }
    }
};

export const getCountryCode = async (code = '') => {
    let countryCode = '';

    try {
        countryCode = CountryCodes[code.toUpperCase()];
        /*if(!countryCode) {
            const res = await fetchCountryCode();
            countryCode = (await  res.text()) || '';
            REMOVE = 'FROM LOCATION'
        }*/
        if(countryCode.length && !countryCode.includes('+')) {
            countryCode = `+${countryCode}`;
        }
    }catch (e) {
        countryCode = '';
    }
    // TODO comment
    //  return '+374';
    // alert(REMOVE);
    return countryCode;
};

export const getProviderInfo = async () => {
 return  DeviceInfo.getCarrierSync();
};

export const ifMinApiLevel = async () => {
    const apiLevel = await DeviceInfo.getApiLevel();
    return apiLevel <= MIN_API_LEVEL;
};

export const getDeviceResolution = async () => {
    const screenWidth = Dimensions.get('screen').width;
    const screenHeight = Dimensions.get('screen').height;
    const pixelRatio = PixelRatio.get();
    return {
        width: screenWidth,
        height: screenHeight,
        size: `${Math.round(screenWidth)}x${Math.round(screenHeight)}`,
        resolution: `${Math.round(screenWidth * pixelRatio)}x${Math.round(screenHeight * pixelRatio)}`,
    }
};

export const checkNetworkConnection = async () => {
    const state =  await NetInfo.fetch();
    if(!state.isConnected) {
        return {
            success: false,
            noNetwork: true,
            alertMessage: "Something went wrong, please check your internet connect and try again.",
            errorMessage: ''
        }
    }
    return {
        success: true,
        noNetwork: false,
        errorMessage: ''
    }
};

export const shortSimInfo = async () => {
    const phoneNumber = await DeviceInfo.getPhoneNumber() || '';
    const provider = await DeviceInfo.getCarrier() || '';
    return {
        number: phoneNumber,
        provider: provider
    }
};

export const checkIfPhoneNumberNotChanged = async () => {
    const phoneNumberInfo = await shortSimInfo();
    let condition = false;
    const storedNumber = await AsyncStorage.getItem(`@${NOT_EDITED_PHONE_NUMBER_INFO}`);
    if(storedNumber) {
        condition = !!(storedNumber === JSON.stringify(phoneNumberInfo) && phoneNumberInfo.provider)
    }

    if (!condition) {
        await logoutFunc();
    }

    return {
        success: condition,
        simChanged: !condition,
        errorMessage: 'SIM card changed,\n please re login to continue.',
        errorCode: NEED_TO_LOGIN
    };

};
