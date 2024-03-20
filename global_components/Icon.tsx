import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IComponentProps } from '../globalTypes&Interfaces';

type IIcon = {
    icon: any
    color?: string
    size?: number
} & Omit<IComponentProps, 'children'>

export const Icon = ({ icon, color = 'white', size = 22, style }: IIcon) => {
    return <FontAwesomeIcon icon={icon} color={color} size={size} style={style} />
}
