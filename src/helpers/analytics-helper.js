import {firebase} from '@react-native-firebase/analytics';
import {getDeviceFullInfo} from "./device-info-helper";

export const rechargePageEvent = async (plan, user) => {
    firebase.analytics().logEvent('plan_view', {
        id: plan.idProducto,
        name: `${plan.servicio} ${plan.producto}`,
        price: plan.precio,
        user_id: user.userId,
        via: 'ConfirmRecharge',
    }).then( () => {
    }).catch(err => {

    });
   firebase.analytics().logSelectContent( {
       content_type:  `${plan.servicio} ${plan.producto}`,
       item_id: plan.idProducto
    }).then( () => {
    }).catch(err => {

    })
};

export const rechargePaymentEvent = async (plan, user , balance, applyCredit) => {
    firebase.analytics().logEvent('recharge', {
        id: plan.idProducto,
        name: `${plan.servicio} ${plan.producto}`,
        price: plan.precio,
        user_id: user.userId,
        credit_type: applyCredit,
        available_balance: balance.balance,
        available_credit: balance.credit,
        via: 'ConfirmRecharge',
    }).then( () => {
    }).catch(err => {

    })
};

export const loginEvent = async (user, method = 'PIN') => {
  firebase.analytics().logLogin({
        method: method,
        // firebase_screen_class: 'Login'
    }).then( () => {
      setUserId(user.userId);
      setUserProperties();
    }).catch(err => {

    })
};

export const setUserId = async (id) => {
    firebase.analytics().setUserId(id).then( () => {

    }).catch(err => {

    })
};

export const setUserProperties = async () => {
    const properties = await getDeviceFullInfo();
    // alert(JSON.stringify(properties))
    firebase.analytics().setUserProperties(properties).then( () => {

    }).catch(err => {

    })
};

export const signUpEvent = async () => {
    firebase.analytics().logSignUp({
        method: 'phone_number',
    }).then( () => {

    }).catch(err => {

    })
};



export const setCurrentScreen = async (screen) => {
    firebase.analytics().setCurrentScreen(screen, screen).then( () => {
    }).catch(err => {

    });
    /*firebase.analytics().logEvent('page_title', {
       title: screen
    }).then( () => {
    }).catch(err => {

    })*/
};



export const billPaymentPageEvent = async (billInfo, user) => {
    firebase.analytics().logEvent('bill_view', {
        id: billInfo.selectedBill.idProducto,
        serviceId: billInfo.selectedBill.idServicio,
        billType: billInfo.type,
        userIdentity: billInfo.barcode.SERVICE_NUMBER.value,
        amount: billInfo.barcode.AMOUNT.value,
        user_id: user.userId,
        via: 'BillPayment',
    }).then( () => {

    }).catch(err => {

    });
    firebase.analytics().logSelectContent( {
        content_type:  `${billInfo.type}, ${billInfo.barcode.SERVICE_NUMBER.value}`,
        item_id: billInfo.selectedBill.idProducto
    }).then( () => {
    }).catch(err => {

    })
};


export const billPaymentEvent = async (billInfo, user , balance, applyCredit) => {
    firebase.analytics().logEvent('bill_pay', {
        id: billInfo.selectedBill.idProducto,
        serviceId: billInfo.selectedBill.idServicio,
        billType: billInfo.type,
        userIdentity: billInfo.barcode.SERVICE_NUMBER.value,
        amount: billInfo.barcode.AMOUNT.value,
        user_id: user.userId,
        credit_type: applyCredit,
        available_balance: balance.balance,
        available_credit: balance.credit,
        via: 'BillPayment',
    }).then( () => {

    }).catch(err => {

    })
};
