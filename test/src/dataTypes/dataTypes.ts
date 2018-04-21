// import { PebbleDateTime } from "pebblebed";

import { types } from "pebblebed";

export const DefaultDateTimeNow = types.dateTime({
  onSave: (value = null) => {
    if (value == null) {
      return new Date();
    }

    return value;
  }
});

export interface ICoordinates {
  latitude: number;
  longitude: number;
}
