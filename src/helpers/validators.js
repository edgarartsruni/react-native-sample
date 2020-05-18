import {MIN_MOBILE_NUMBER_LENGTH} from "../constants/app-vars";

export const ifValidPhoneNumber = (val) => {
    return val && val.length >= MIN_MOBILE_NUMBER_LENGTH && (/^\d+$/.test(val) || (val[0] === '+' && /^\d+$/.test(val.slice(1))));
};

export const ifOnlyNumbers = (val) => {
    return val && /^\d+$/.test(val);
};

export const maskPhoneNumber = phoneNumber => {
    return  `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};
