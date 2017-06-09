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

### Quick Jump

- [Getting Started](#getting-started)
- [Quick Example](#a-quick-taster-example-of-how-it-works)

###### Creation

- [Creating a Schema](#scroll-creating-an-entity-schema)
- [Creating a Model](#hammer-creating-an-entity-model)

###### Usage

- [API](#api)
- [Datastore Operations](#blossom-datastore-operations)
- [API Responses](#api-responses)
- [Saving, Loading or Deleting Operations](#saving-loading-or-deleting-operations)
- [Querying Operations](#querying-operations)

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

## :scroll: Creating an Entity schema

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

### Entity Property Definition

#### `type`: string

The type of value to be stored in the Datastore for this property.

Our JavaScript entity objects can contain certain types which are converted by our schema on storage / retrieval from the Datastore:
  * `string`, `int`, `double`, `boolean`, `array` - self explanatory, easy JavaScript counterparts
  * `datetime` converted to / from JavaScript `Date` object
  * `object` for embedded objects (converted to / from JavaScript objects)
  * `geoPoint` 
    * Will be automatically converted to / from an object with a structure of:
      * `{ latitude: number, longitude: number }`
    * Can be deliberately set to datastore type `geoPoint` using the client library before save if you want

#### `required`: boolean
###### (default `false`)

If this property is required to be set in the entity (not `null`), then mark this `true`

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

#### `role: "id"`

Define which property represents our entity ID. Which brings us to:

### :key: Entity ID

There can only be one property on the schema definition that is defined with `role: "id"`. This property will represent the Entity's ID.

:warning: **N.B. This property is not persisted as an entity property in the Datastore - it is only used as the ID**

* It will contain the string or integer ID of an entity whenever it is **loaded** or **queried**
* It should also be set to whatever ID you would like for the entity when you **save** it (or if it is an `int` type property, can be left unset to auto-generate an ID).

If there is no property in the schema definition which has a `role: "id"` set, then the ID will be auto-generated on save. For ease of use and better control, **this is not recommended though** (even if all your ids are auto-generated - rather create an ID property of `int` type and omit the value when saving).

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

## :hammer: Create an Entity Model

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

# API

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

## :blossom: Datastore Operations

A Datastore operation is enacted through the Models of your entities. You create the operation on the Model using a function, one of these:

```
TestEntityModel.save(data: object | object[]): DatastoreSave;
TestEntityModel.load(ids?: string | number | Array<(string | number)>): DatastoreLoad;
TestEntityModel.delete(data?: object | object[]): DatastoreDelete;

TestEntityModel.query(namespace?: string): DatastoreQuery;
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

### API Responses

Upon using `run()` on any operation, a Promise is returned.

Here is a breakdown of the various responses:

#### Save response

```
await TestEntityModel.save(entity).withAncestors(AncestorEntityModel, "test-id").run();
```

Will **throw an error** if something goes wrong
(Schema validation or Datastore operation failure for some reason).
Otherwise, a response is not really required for a save operation,
but on success an object is returned that looks like this _(the response returned
from the official Datastore library)_:

```
[
  {
    mutationResults: [
      {
        conflictDetected: false,
        key: null,
        version: "12312312232300"
      }
    ],
    indexUpdates: 4
  }
]
```

#### Delete response

Same as save response (above).

#### Load response

```
const response = await TestEntityModel.load("test-id-one").run();
```

Will **throw an error** if something goes wrong. Otherwise, returns an empty array (if no entity found), or an array with the result entity objects:

```
[
  {
    testDate: 2017-06-08T10:16:58.591Z,
    testEmbeddedObject: { who: 'let the dogs out' },
    testTags: [ 'Great', 'Again' ],
    testAmount: null,
    testID: 'test-id-one'
  }
]
```

As you can see, the ID of the entity in the datastore, `test-id-one`, has been populated
on the resulting entity at `testID` as defined in the schema.

In order to re-save using a different ID just change the value at `testID` accordingly before saving.

:warning: **Even though its not shown in the response here, ancestors are remembered after
loads and queries (in a hidden object property) - so upon re-saving (under the same ID or a different ID), the same ancestors will apply unless
`ignoreDetectedAncestors()` is used during the save operation or new ancestors are set deliberately
using `withAncestors()`.**

#### Query response

```
const query = await TestEntityModel
                      .query()
                      .filter("testTags", "=", "Great")
                      .withAncestors(TestAncestorEntityModel, "test-id")
                      .run();
```

Will **throw an error** if something goes wrong.
Otherwise, returns an object like so:

```
{
  entities: [
    { 
      testDate: 2017-06-08T11:09:37.170Z,
      testEmbeddedObject: { who: 'let the dogs out' },
      testTags: [ 'Great', 'Again' ],
      testAmount: null,
      testID: 'test-id-one'
    }
  ],
  info: { 
    moreResults: 'NO_MORE_RESULTS',
    endCursor: 'lc3QtYnJhbmQtdHdvDAsSClRlc3RFbnRpdHkiC3Rlc3QtaWQtb25lDBgAIAA='
  }
}
```

The `entities` array will be empty if there are no results. [See here](https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/master/datastore/query?method=run) for more info about the `info` object and the various values for `moreResults`.

**Same warning applies about ancestors (see load response)**

## Saving, Loading or Deleting Operations

These operations all expose the following functions to describe the operation:

```
withAncestors(...args: any[])
useTransaction(transaction: any)
useNamespace(namespace: string)
```

`withAncestors()` : Pass in an array for ancestors **e.g.**

```
withAncestors(TestEntityModel, 123, "AnotherEntityKind", "idstring")
```

`123` and `"idstring"` in the above example represent the IDs for the ancestors. `TestEntityModel` is a `PebblebedModel` and `"AnotherEntityKind"` is a string - they represent the kinds of the ancestors.

### **In addition to specific functions on each:**

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

None required :relaxed:

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

## Querying Operations

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
//  ---    OR    ---
withAncestors(...args: any[]);

end(cursorToken: string);

limit(amount: number);

groupBy(properties: string[]);

start(nextPageCursor: any);

select(property: string | string[]);
```

To get a key for `ancestorKey`, you can use the `key()` method defined on the Model for that ancestor e.g.:

```
hasAncestor(AncestorEntityModel.key("test-id"));
```

**:herb: `withAncestors()` method has been added for convenience, which is in line with the rest of the Pebblebed library operations**

Upon running a Query the result will be returned with the following interface:

```
interface DatastoreQueryResponse {
    entities: any[];
    info?: {
        endCursor?: string;
        moreResults?: string;
    };
}
```

You can find out more about this operation and response in the [official documentation](https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/master/datastore/query?method=run).
