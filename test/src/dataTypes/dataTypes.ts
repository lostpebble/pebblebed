import { PebbleDateTime } from "pebblebed";

export const DefaultDateTimeNow = PebbleDateTime({
  onSave: (value = null) => {
    if (value == null) {
      return new Date();
    }

    return value;
  }
}).required();

export interface ICoordinates {
  latitude: number;
  longitude: number;
}
