import { IComponentProps } from "../../../globalTypes&Interfaces";
import Draggable from "../../../global_components/Draggable"
import { View, TouchableOpacity, GestureResponderEvent } from 'react-native';
import LogicSymbol from "./LogicSymbol";
import Button from "../../../global_components/Button";
import { ScaleDecorator } from "react-native-draggable-flatlist";

// NOTES:
// the user is able to do the following pertaining to the selected logic symbol: 
// -can drag an item to a different place in relation to all of the logical symbols 
// -can delete a selected logical symbol by first clicking on it, then clicking on the delete button


const SelectedLogicSymbol = ({ children }: IComponentProps) => {

    function handleBtnPress(event: GestureResponderEvent) {

    }

    return (
            <LogicSymbol
                backgroundColor="#6B7280"
                width={55}
                height={55}
            >
                {children}
            </LogicSymbol>
    )
};

export default SelectedLogicSymbol;