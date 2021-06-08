import {StyleSheet} from 'react-native';
import {theme} from '../../config/theme';

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors['8'],
        padding: 10,
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    label: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: theme.colors.lightText
    },
    score: {
        fontWeight: 'bold',
        fontSize: 18,
        color: theme.colors.lightText
    }
});

export default styles;
