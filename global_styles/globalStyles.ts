import { StyleSheet } from 'react-native'

export const btnStyles = StyleSheet.create({
    main: {
        backgroundColor: '#A1B0FD',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50, height: 50, borderRadius: 10
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
    }
})
