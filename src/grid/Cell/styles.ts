import {StyleSheet} from 'react-native';
import {theme} from '../../theme';

export const colors = {
    2: '#bc8a5f',
    4: '#c89f9c',
    8: '#f07167',
    16: '#f5cb5c',
    32: '#ff9f1c',
    64: '#d08c60',
    128: '#82c0cc',
    256: '#03045e',
    512: '#c77dff',
    1024: '#7b2cbf',
    2048: '#55a630'
};

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
        fontSize: theme.CELL_SIZE / 3
    }
});

export default styles;
