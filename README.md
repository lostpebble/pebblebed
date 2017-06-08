# Pebblebed

![Pebblebed Logo - a very literal interpretation](https://github.com/lostpebble/pebblebed/raw/master/pebblebed.png "a very literal interpretation")

### A simple interface for interacting with the Google Cloud Datastore
Using NodeJS and on top of Google's official [`@google-cloud/datastore`](https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-datastore-ga) library.
Heavily inspired by the Java library serving the same purpose, [Objectify](https://github.com/objectify/objectify).

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

## A quick taster (example) of how it works

```
import { PebblebedModel } from "pebblebed";

// Create a schema for an entity

const schemaDefinition = {
    testID: {
        type: "string",
        role: "id",
    },
    testAmount: {
        type: "double",
    },
    testTags: {
        type: "array",
        required: true,
    },
    testEmbeddedObject: {
        type: "object",
        required: true,
        excludeFromIndexes: true,
    },
    testDate: {
        type: "datetime",
        required: true,
    },
};

// Create the model for our entity, of kind "TestEntity", using the schema

const TestEntityModel = new PebblebedModel("TestEntity", schemaDefinition);

// Create an entity object

const entity = {
  testID: "test-id-one",
  testTags: ["Great", "Again"],
  testEmbeddedObject: {
    who: "let the dogs out",
  },
  testDate: new Date(),
  testAmount: 123.123,
};

// Save it

await TestEntityModel.save(entity).run();
```

###### _After some time_

```
// Query for our entity by tag
const query = await TestEntityModel.query().filter("testTags", "=", "Great").run();

// OR load our entity directly with its string ID
const entity = await TestEntityModel.load("test-id-one").run();

// ...do work on entity...
entity.testAmount = 35.50;

// save it again
await TestEntityModel.save(entity).run();
```

###### _After some time_

```
// Delete the unwanted entity
await TestEntityModel.delete().id("test-id-one").run();
```

## Creating an Entity schema

Inspired by another Datastore library ([gstore-node](https://github.com/sebelga/gstore-node)), we need to create schemas to let Pebblebed know how our entities are structured. Because JavaScript is weakly typed, this ensures that we make no mistakes about what we intend to save / load / query.

A **schema definition** consists of an object of property names and definitions for each of those properties, conforming to this interface:

```
interface SchemaDefinition {
  [property: string]: SchemaPropertyDefinition;
}
```

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

#### `type`: string
The type of value to be stored in the datastore for this property.

Our JavaScript entity objects can contain certain types which are converted by our schema on storage / retrieval from the Datastore:
  * `string`, `int`, `double`, `boolean`, `array` - self explanatory
  * `datetime` converted to / from JavaScript `Date` object
  * `object` for embedded objects (converted to / from JavaScript objects)
  * `geoPoint` 
    * Will be automatically converted to / from an object with a structure of:
      * `{ latitude: number, longitude: number }`
    * Can be deliberately set to datastore type `geoPoint` using the client library before save if you want

#### `required`: boolean
###### (default `false`)

If this property is required to be set upon save, then mark this `true`

#### `role: "id"`

Define which property represents our entity ID. (see next section)

#### `excludeFromIndexes`: boolean
###### (default `false`)

By default all properties on your entities will be indexed. This can become costly depending on the amount of indexed properties on an entity. To prevent this for certain properties set this to `true`.

#### `optional`: boolean
###### (default `false`)

By default, if you have defined a property in your schema but you don't provide it when saving an entity - the property in the Datastore will be set to `null` or whatever value you have set as a default.

If you have not provided a default, and want properties which are not provided to not be saved at all, then set this to `true`.

#### `onSave`: (value: any) => any;

Transform this property before saving. `OnSave()` is a function which will run on save, with the current value of the property as a parameter. Whatever value you return will end up being saved.

#### `default`: any

If you save an entity without setting a value at this property - this value will be used as the default.

### :key: Entity ID

There can only be one property on the schema definition that is defined with `role: "id"`. This property will represent the Entity's ID.

:warning: **N.B. This property is not persisted as an Entity property in the Datastore - it is only used as the ID**

When saving an entity to the datastore, it can have an id value type of either `string` or `int`.

* `int` IDs can be deliberately set or, if omitted, auto-generated by the datastore.
* `string` IDs must always be deliberately set.

* It will contain the string or integer ID of the entity whenever it is **loaded** or **queried**
* It should also be set to whatever ID you would like for the entity when you **save** it (or if it is an `int`, can be left unset to auto-generate an ID).

If there is no property in the schema definition which has a `role: "id"` set, then the ID will be auto-generated on save. For ease of use and better control, **this is not recommended though** (even if all your ids are auto-generated).

### An example schema definition might look like this:
```
const schemaDefinition = {
    testID: {
        type: "string",
        role: "id",
    },
    testAmount: {
        type: "double",
    },
    testTags: {
        type: "array",
        required: true,
    },
    testEmbeddedObject: {
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

This defines an entity with a `string` ID on property `testId`, 

Along with four properties to be persisted in the datastore:
* `testAmount` _(optional)_
* `testTags`
* `testEmbeddedObject`
* `testDate`

## Create an Entity Model

Entity Models are used to do all our interactions with the Datastore. They are created using the structure defined in your schema and allow operations on your Entities such as load, save or query.

They are very simply created like so:

```
import { PebblebedModel } from "pebblebed";

const TestEntityModel = new PebblebedModel("TestEntity", schemaDefinition);
```

In this example, `TestEntity` will be the entity's kind in the Datastore

After which, you can now use that model to perform operations like so (**save** operation for example):

```
const entity = {
  testID: "test-id-one",
  testTags: ["Great", "Again"],
  testEmbeddedObject: {
    who: "let the dogs out",
  },
  testDate: new Date(),
  testAmount: 123.123,
};

await TestEntityModel.save(entity).run();
```

This will validate and convert all the entity data from the JavaScript object according to our schema, and save the entity in the Datastore as a `TestEntity` kind with the id `test-id-one`, it would end up like this in your Cloud Datastore Console:

![Google Cloud Console view](https://github.com/lostpebble/pebblebed/raw/master/resources/entity-save-console.jpg "Google Cloud Console view")

**Note that the `testID` property has been used as the ID, and NOT persisted as a property**

This entity can later be retrieved from the Datastore using a **query** or a **load** operation, like so:

```
const query = await TestEntityModel.query().filter("testTags", "=", "Great").run();
const entity = await TestEntityModel.load("test-id-one").run();

console.dir(JSON.stringify(query.entities));
console.dir(JSON.stringify(entity));
```

Both of those `console.dir` outputs will show the following (neatened up a bit):
```
[
  {
    "testDate": "2017-06-07T15:52:14.109Z",
    "testEmbeddedObject": {"who":"let the dogs out"},
    "testTags": ["Great","Again"],
    "testAmount":123.123,
    "testID":"test-id-one"
  }
]
```

In this example, an array with a single element.

All load or query operations will return an array in this way to represent results. An empty array indicates no results. The property `testDate` is an actual JavaScript `Date` object, but in our `console.dir()` has been converted to a string by `JSON.stringify()`.

## API

### `Pebblebed`

```
// Connect to a Datastore client instance
Pebblebed.connectDatastore: (datastoreClient) => void;
```

### `PebblebedModel`

```
// Create a new Model for a Datastore Entity
new PebblebedModel(entityKind: string, entitySchema: SchemaDefinition);
```

### Using a created Model

```
// Create Model, using above constructor
const TestEnityModel = new PebblebedModel(entityKind: string, entitySchema: SchemaDefinition);
```

### Datastore Operations

A Datastore operation is enacted through the Models of your entities. You create the operation on the Model using a function, one of these:

```
TestEntityModel.save(data: object | object[]): DatastoreSave;
TestEntityModel.load(ids?: string | number | Array<(string | number)>): DatastoreLoad;
TestEntityModel.delete(data?: object | object[]): DatastoreDelete;

TestEnityModel.query(namespace?: string): DatastoreQuery;
```

An operation is performed by stringing together functions which describe the operation **e.g.**:

```
TestEntityModel.save(entity).withAncestors(AncestorEntityModel, "test-id").run();

TestEntityModel.delete().ids("test-one", "test-two").useTransaction(transaction).run();

TestEntityModel
    .load("test-three")
    .useNamespace("different-namespace")
    .withAncestors(AncestorEntityModel, "test-id")
    .run();
```

Upon using `run()` on any operation, a Promise is returned.

### Saving, Loading or Deleting Operations

These operations all expose the following functions to describe the operation:

```
withAncestors(...args: any[])
useTransaction(transaction: any)
useNamespace(namespace: string)
```

**In addition to specific methods on each:**

### Saving entities
```
// Save an entity / entities of this Model to the Datastore
TestEntityModel.save(data: object | object[]): DatastoreSave;
```

On starting a save operation you must pass in the the JavaScript objects which represent your entities (which should conform to your defined Schema). Either a single entity, or an array of entities.

#### `DatastoreSave` allows further functions to describe the operation:

If your schema contains an ID property of `int` and you want them to be generated (you are not deliberately setting them), then use this method:
```
generateUnsetId()
```

When performing load and query operations, entities are returned from the Datastore with meta information containing the ancestors of those entities. If you have previously retrieved an entity from the Datastore and are busy re-saving it - but do not want to use the ancestors that it previously had - use this method:

:warning: This will create a new Entity in the Datastore, the old one will still exist under the previous ancestors

```
ignoreDetectedAncestors()
```

### Loading entities
```
// Load an entity / entities of this Model to the Datastore
TestEntityModel.load(ids?: string | number | Array<(string | number)>): DatastoreLoad;
```

On starting a load operation you must pass in the the string or integer IDs you wish to load for your Model's kind. Either a single ID, or an array of IDs.

#### `DatastoreLoad` allows further functions to describe the operation:

None required :grin:

### Deleting entities

```
// Delete an entity / entities of this Model in the Datastore
TestEntityModel.delete(data?: object | object[]): DatastoreDelete;
```

_Optional_ : On starting a delete operation you can pass in the the JavaScript objects which represent the entities you wish to delete (which should conform to your defined Schema - especially in relation to their IDs). Either a single entity, or an array of entities.

#### `DatastoreDelete` allows further functions to describe the operation:

If you did not pass any entities to the initial operation, you should be providing IDs that you wish to delete:

```
id(id: string | number);
ids(ids: Array<(string | number)>);
```

When performing load and query operations, entities are returned from the Datastore with meta information containing the ancestors of those entities. If you have previously retrieved an entity from the Datastore and want to delete it - but do not want to use the ancestors that it previously had - use this method:

:warning: This will delete a different entity in the Datastore, the old one will still exist under the previous ancestors
```
ignoreDetectedAncestors()
```

### Querying entities

```
// Query for entities of this Model in the Datastore
TestEnityModel.query(namespace?: string): DatastoreQuery;
```

Queries expose a slightly different API to the save, load and delete operations.

_Optional_ : Namespace to be defined when starting the operation.

#### `DatastoreQuery` allows further functions to describe the operation:

_These maintain parity with the official Datastore's querying API_

```
filter(property: string, comparator: "=" | "<" | ">" | "<=" | ">=", value: string | number | boolean | Date);

order(property: string, options?: {
    descending: boolean;
});

hasAncestor(ancestorKey: DatastoreEntityKey);

end(cursorToken: string);

limit(amount: number);

groupBy(properties: string[]);

start(nextPageCursor: any);

select(property: string | string[]);
```

Upon running a Query, the result will be returned with the following interface:

```
interface DatastoreQueryResponse {
    entities: any[];
    info?: {
        endCursor?: string;
        moreResults?: string;
    };
}
```

You can find out more in about this response and operation the [official documentation](https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/master/datastore/query?method=run).
