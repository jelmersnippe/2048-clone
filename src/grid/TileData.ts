import {Animated} from 'react-native';

export class TileData {
    value = (Math.random() * 100) > 90 ? 4 : 2;
    location = new Animated.ValueXY();

    doubleValue() {
        this.value = this.value * 2;
    }
}
