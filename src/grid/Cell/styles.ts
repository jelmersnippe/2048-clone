import {StyleSheet} from 'react-native';
import {theme} from '../../theme';

const styles = StyleSheet.create({
    cell: {
        borderWidth: 2,
        borderColor: 'brown',
        backgroundColor: 'orange',
        width: theme.CELL_SIZE,
        height: theme.CELL_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    },
    cellText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    }
});

export default styles;
