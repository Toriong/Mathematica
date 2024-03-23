import { View } from "react-native"
import { OVERLAY_OPACITY } from "../../globalVars";

const TabOverlay = () => <View style={{ zIndex: 10, width: '100%', height: '100%', position: 'absolute', opacity: OVERLAY_OPACITY, backgroundColor: 'black', }} />;

export default TabOverlay;