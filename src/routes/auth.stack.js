import Registration from "../screens/Registration";
import Verification from "../screens/Verification";
import {createStackNavigator} from "react-navigation-stack";
import {createAppContainer} from "react-navigation";
import PinSetup from "../screens/PinSetup";
import Home from "../screens/Home";
import Balance from "../screens/Balance";
import Recharge from "../screens/Recharge";
import Login from "../screens/Login";
import Loader from "../screens/Loader";
import LoginOrRegister from "../screens/LoginOrRegister";
import ChooseProvider from "../screens/ChooseProvider";
import ConfirmRecharge from "../screens/ConfirmRecharge";
import ChooseBill from "../screens/ChooseBill";
import BillQRCode from "../screens/BillQRCode";
import ChooseBillType from "../screens/ChooseBillType";
import BillPayment from "../screens/BillPayment";

const screens = {
    Loader: {
        screen: Loader,
        navigationOptions: {
            headerShown: false,
        }
    },
    LoginOrRegister: {
        screen: LoginOrRegister,
        navigationOptions: {
            headerShown: false,
        },
    },
    Login: {
        screen: Login,
        navigationOptions: {
            headerShown: false,
        },
    },
    Registration: {
        screen: Registration,
        navigationOptions: {
            headerShown: false,
        },
    },
    Verification: {
        screen: Verification,
        navigationOptions: {
            headerShown: false,
        },
    },
    PinSetup: {
        screen: PinSetup,
        navigationOptions: {
            headerShown: false,
        },
    },
    Home: {
        screen: Home,
        navigationOptions: {
            headerShown: false,
        },
    },
    Balance: {
        screen: Balance,
        navigationOptions: {
            headerShown: false,
        },
    },
    ChooseProvider: {
        screen: ChooseProvider,
        navigationOptions: {
            headerShown: false,
        },
    },
    Recharge: {
        screen: Recharge,
        navigationOptions: {
            headerShown: false,
        },
    },
    ConfirmRecharge: {
        screen: ConfirmRecharge,
        navigationOptions: {
            headerShown: false,
        },
    },
    ChooseBillType: {
        screen: ChooseBillType,
        navigationOptions: {
            headerShown: false,
        },
    },
    ChooseBill: {
        screen: ChooseBill,
        navigationOptions: {
            headerShown: false,
        },
    },
    BillQRCode: {
        screen: BillQRCode,
        navigationOptions: {
            headerShown: false,
        },
    },
    BillPayment: {
        screen: BillPayment,
        navigationOptions: {
            headerShown: false,
        },
    },
};

const AuthStack = createStackNavigator(screens,{
    initialRouteName: "Loader",
});

const AppContainer = createAppContainer(AuthStack);
export default AppContainer
