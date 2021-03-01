import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    cell: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: 'brown',
        backgroundColor: '#999',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cellText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    }
});

export default styles;
