import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import BottomNavigation, {
    FullTab
} from 'react-native-material-bottom-navigation'
import {Image} from "react-native-elements";
import {PARAGRAPH_SILVER, PRIMARY_BLUE} from "../constants/css-colors";

class BottomBar extends Component {
//  Balance | Wallet | Account


    state = {
        activeTab: 'home',
        tabs : [
            {
                key: 'home',
                image: require('../assets/images/icon/bank.png'),
                label: 'Balance',
                barColor: '#ffffff',
                pressColor: 'rgba(22, 30, 149, 0.16)',
                loaded:false,
                route: 'Home',
            },
            {
                key: 'balance',
                image: require('../assets/images/icon/wallet.png'),
                label: 'Wallet',
                barColor: '#ffffff',
                pressColor: 'rgba(22, 30, 149, 0.16)',
                loaded:false,
                route: 'Balance',
            },
            {
                key: 'account',
                image: require('../assets/images/icon/user.png'),
                label: 'Account',
                barColor: '#ffffff',
                pressColor: 'rgba(22, 30, 149, 0.16)',
                loaded: false
            }
        ]
    };

    componentDidMount() {
        let routeName = this.props.navigation.state.routeName.toLocaleLowerCase();
        if(this.state.tabs.findIndex(item => item.key === routeName) === -1) {
            routeName = 'home';
        }
        this.setState({
            activeTab: routeName
        })
    }

    updateState(icon) {
        const tabs = this.state.tabs;
        const index = tabs.findIndex(item => item.key === icon.key);
        if(index > -1) {
            tabs[index].loaded = true;
            this.setState({
                tabs: tabs
            })
        }
    }

    renderIcon = tab => ({ isActive }) => (
        <Image
            style={tab.loaded ? styles.image : {...styles.image, opacity: 0}}
            source={tab.image}
            onLoad={() => this.updateState(tab) }
        />
    );

    renderTab = ({ tab, isActive }) => (
        <FullTab
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            labelStyle={{color:(isActive)?PRIMARY_BLUE:PARAGRAPH_SILVER, fontSize: 10}}
            renderIcon={this.renderIcon(tab)}
        />
    );

    navigate(tab) {
        if(tab.route) {
            this.props.navigation.navigate(tab.route)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <BottomNavigation
                   activeTab={this.state.activeTab}
                   onTabPress={newTab => this.navigate(newTab)}
                   renderTab={this.renderTab}
                   tabs={this.state.tabs}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    image: {
        height: 20,
        width:20
    },
});

export default BottomBar
