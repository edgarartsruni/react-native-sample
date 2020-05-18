import {Image} from "react-native";

export function getImageSize(uri, maxHeight, maxWidth) {
    return new Promise(resolve => {
        Image.getSize(uri, (width, height) => {
            const val = width / height;
            if (height > maxHeight) {
                height = maxHeight;
                width = val * height;
            } else {
                width = maxWidth;
                height = width / val;
            }
            resolve({
                width,
                height
            })
        }, () => {
            resolve({
                width: 0,
                height: 0
            })
        })
    })
}


export const SELECT_MAX_HEIGHT = 25;
export const SELECT_MAX_WIDTH = 80;

export const SELECT_PLACEHOLDER = {
    selectPlaceholder: {
        image: require('../assets/images/prov_loader.png'),
        width: 42,
        height: 25
    }
};

export async function setLogoSizes(logos) {
    for (const logo of logos) {
        const sizes = await getImageSize(logo.value.logo, SELECT_MAX_HEIGHT, SELECT_MAX_WIDTH)
        logo.value.width = sizes.width;
        logo.value.height = sizes.height;
    }
    return logos;
}
