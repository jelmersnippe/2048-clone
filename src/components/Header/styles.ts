import {StyleSheet} from 'react-native';
import {theme} from '../../config/theme';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        width: theme.GRID_SIZE
    },
    appName: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: theme.colors['2'],
        color: theme.colors.lightText,
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        height: theme.CELL_SIZE,
        width: theme.CELL_SIZE,
        margin: 10,
        borderRadius: 4
    },
    headerDetails: {
        flex: 2
    },
    scoreContainer: {
        flexDirection: 'row'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10
    },
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: theme.colors['8'],
        width: 24,
        height: 24,
        marginLeft: 5
    }
});

export default styles;
