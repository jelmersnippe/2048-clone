import {StyleSheet} from 'react-native';
import {theme} from '../../config/theme';

const styles = StyleSheet.create({
    grid: {
        width: theme.GRID_SIZE,
        height: theme.GRID_SIZE,
        backgroundColor: theme.colors.brown,
        borderRadius: 4
    },
    row: {
        flexDirection: 'row'
    },
    cell: {
        width: theme.CELL_SIZE,
        height: theme.CELL_SIZE,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: theme.colors.brown,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default styles;
