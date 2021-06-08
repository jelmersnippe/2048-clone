import {StyleSheet} from 'react-native';
import {theme} from '../../../config/theme';

const styles = StyleSheet.create({
    cell: {
        borderWidth: 2,
        borderColor: theme.colors.brown,
        backgroundColor: theme.colors['2'],
        width: theme.CELL_SIZE,
        height: theme.CELL_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        borderRadius: 4
    },
    cellText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: theme.CELL_SIZE / 3
    }
});

export default styles;
