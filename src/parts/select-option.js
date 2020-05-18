import React, {Component} from "react";
import {StyleSheet, Text, View, Image} from "react-native";
import {SELECT_PLACEHOLDER} from "../helpers/image-helper";
import SELECT_STYLES from "../styles/select-styles";


class SelectOption extends Component {

    state =  {
        ...SELECT_PLACEHOLDER
    };

    render() {

        const {option} = this.props;
        const {selectPlaceholder} = this.state;

        return (
            <View style={styles.optionStyles}>
                <Image
                    style={{
                        width:  option.value.width || selectPlaceholder.width,
                        height: option.value.height || selectPlaceholder.height
                    }}
                    source={(option.value.logo && option.value.width)?{uri: option.value.logo}:selectPlaceholder.image}
                    resizeMethod={'scale'}
                />
                <Text style={styles.optionTextStyles}>{option.label}</Text>
            </View>
        )

    }


}

export default SelectOption;

const styles = StyleSheet.create({
    ...SELECT_STYLES
});
