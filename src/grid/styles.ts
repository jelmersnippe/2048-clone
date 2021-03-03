import {StyleSheet} from 'react-native';
import {theme} from '../theme';

const styles = StyleSheet.create({
    grid: {
        width: theme.GRID_SIZE,
        height: theme.GRID_SIZE
    },
    row: {
        flexDirection: 'row'
    },
    cell: {
        width: theme.CELL_SIZE,
        height: theme.CELL_SIZE,
        borderWidth: 2,
        borderColor: 'brown',
        backgroundColor: '#f0efeb',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default styles;
