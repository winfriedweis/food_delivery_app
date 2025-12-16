// Zum mappen von classname auf die style Prop zum verwenden von Expo Image

import {cssInterop} from "nativewind";
import {ImageBackground as ExpoImageBackground} from "expo-image";

export const ImageBackground = cssInterop(ExpoImageBackground, {
    className: "style",
});
