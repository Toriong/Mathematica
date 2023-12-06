import { Text } from "react-native";
import { IComponentProps, TTxtProps } from '../../globalTypes&Interfaces';

interface IIdsObj {
    id: string | undefined
    testID: string | undefined
}
type TTxt = Omit<IComponentProps, "style">

const FONT_FAMILY_MAIN = "San Francisco"

function getIdsObj(id: string | undefined, testID: string | undefined): IIdsObj | {} {
    let _ids = {};

    if (id) {
        _ids = { id: id }
    };

    if (testID) {
        _ids = { ..._ids, testID: testID }
    }

    return _ids;
}



export const PTxt = ({
    children,
    style,
    id,
    testID,
    txtColor = 'white',
    fontSize = 18,
    fontStyle = 'normal'
}: TTxtProps & TTxt) => {
    const _idsObj = getIdsObj(id, testID);



    return (
        <Text
            {..._idsObj}
            style={{ ...style, fontFamily: FONT_FAMILY_MAIN, fontSize: fontSize, color: txtColor, fontStyle: fontStyle }}
        >
            {children}
        </Text>
    );
}

export const HeadingTxt = ({
    children,
    style,
    id,
    testID,
    fontSize = 22,
    txtColor = 'white',
}: TTxtProps & TTxt) => {
    const _idsObj = getIdsObj(id, testID);

    return (
        <Text
            {..._idsObj}
            style={{ ...style, fontFamily: FONT_FAMILY_MAIN, fontSize: fontSize, color: txtColor }}
        >
            {children}
        </Text>
    );
}