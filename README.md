# Pebblebed

![Pebblebed Logo - a very literal interpretation](https://github.com/lostpebble/pebblebed/raw/master/pebblebed.png "a very literal interpretation")

### A simple interface for interacting with the Google Cloud Datastore
Using NodeJS and on top of Google's official [`@google-cloud/datastore`](https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-datastore-ga) library.

#### Prerequisites

* Google Cloud Datastore client. See [here](https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-datastore-ga) for steps on activating your own Datastore client
* NodeJS **v7.6.0** _( async / await support )_
* Promises
* ( _optional_ ) Typescript for auto-complete goodness

#### Only one (peer) dependency

* `@google-cloud/datastore`

## Getting Started

##### Install the `pebblebed` package in your project:
```
yarn add pebblebed
```
or
```
npm install --save pebblebed
```

##### :electric_plug: Connecting client to Pebblebed

```
// Using example from Datastore documentation

import * as datastore from "@google-cloud/datastore";
import { Pebblebed } from "pebblebed"

const datastoreClient = datastore({
  projectId: 'grape-spaceship-123'
});

Pebblebed.connectDatastore(datastoreClient);
```

##### _And you're all set!_

###### Running Datastore locally for development
By default, the above sets up the Datastore Client to connect to your datastore in the cloud. But you can also run a datastore instance locally using the `gcloud` command line tool, specifically:

`gcloud beta emulators datastore start`

You just need to include the created local endpoint (it will show when you start the local datastore emulator) to your configuration like so:
```
const datastoreClient = datastore({
  projectId: 'grape-spaceship-123',
  apiEndpoint: "http://localhost:8081"
});
```

#### Next steps

* :scroll: Create a schema for an entity
* :hammer: Generate a model from that schema
* :blossom: Save, Load or Query on that entity

## Creating an Entity schema

Inspired by another Datastore library (gstore-node), we need to create schemas to let Pebblebed know how our entities are structured. Because JavaScript is weakly typed, this ensures that we make no mistakes about what we intend to save / load / query.

A **schema definition** consists of an object of property names and definitions for each of those properties, conforming to this interface:

```
interface SchemaDefinition {
  [property: string]: SchemaPropertyDefinition;
}
```

And the **schema property definition** interface:

```
interface SchemaPropertyDefinition {
  type: "string" | "int" | "double" | "boolean" | "datetime" | "array" | "object" | "geoPoint";
  required?: boolean;
  role?: "id";
  excludeFromIndexes?: boolean;
  optional?: boolean;
  onSave?: (value: any) => any;
  default?: any;
}
```

Schemas are contracts between your JavaScript objects and the eventual stored objects in the datastore. In that sense, you need to pay close attention to how you define each property in the schema. Let's go over the options for each property on the schema:

#### `type` : The type of the value to be stored in the datastore for this property

Our JavaScript entity objects can contain certain types which are converted by our schema on storage / retrieval from the Datastore:
  * `string`, `int`, `double`, `boolean`, `array` - self explanatory
  * `datetime` converted to / from JavaScript `Date` object
  * `object` for embedded JavaScript objects
  * `geoPoint` 
    * Will be automatically converted to / from an object with a structure of:
      * `{ latitude: number, longitude: number }`
    * Can be deliberately set to datastore type `geoPoint` using the client library before save if you want



#### `role` : Define which property is our entity `id` (see next)

### :key: Entity ID

There can only be one property on the schema definition that is defined with `role: "id"` - this property represents the Entity's ID.

:warning: **N.B. This property is not persisted as an Entity property - it is only used as the ID**

When saving an entity to the datastore, it can have an id value type of either `string` or `int`.

* `int` IDs can be deliberately set or, if omitted, auto-generated by the datastore.
* `string` IDs must always be deliberately set.

* It will contain the string or integer ID of the entity whenever it is **loaded** or **queried**
* It should also be set to whatever ID you would like for the entity when you **save** it (or if it is an `int`, can be left unset to auto-generate an ID).

:warning:

If there is no property in the schema definition which has a `role: "id"` set, then the ID will be auto-generated on save. For ease of use and better control, **this is not recommended though** (even if all your ids are auto-generated).

### An example schema definition might look like this:
```
const schemaDefinition = {
    testId: {
        type: "string",
        role: "id",
        required: false,
    },
    amount: {
        type: "double",
    },
    tags: {
        type: "array",
        required: true,
    },
    embeddedObject: {
        type: "object",
        required: true,
        excludeFromIndexes: true,
    },
    testDate: {
        type: "datetime",
        required: true,
    },
};
```

This creates an entity with 4 properties: `amount`, `tags`, `embeddedObject`, `testDate`