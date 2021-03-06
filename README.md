# Pebblebed

![Pebblebed Logo - a very literal interpretation](https://github.com/lostpebble/pebblebed/raw/master/pebblebed.png "a very literal interpretation")

## A simple interface for interacting with the Google Cloud Datastore
Using NodeJS and on top of Google's official [`@google-cloud/datastore`](https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-datastore-ga) library.
Heavily inspired by the Java library serving the same purpose, [Objectify](https://github.com/objectify/objectify).

### Prerequisites

* Google Cloud Datastore client. See [here](https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-datastore-ga) for steps on activating your own Datastore client
* NodeJS **>= v6.5.0** _( ES6 support )_
* Promises
* ( _optional_ ) Typescript for auto-complete goodness

### Only one (peer) dependency

* `@google-cloud/datastore`

## Quick Jump

###### Get Going

- [Getting Started](#getting-started)
- [Quick Example](#a-quick-taster-example-of-how-it-works)

###### Creation

- [Creating a Schema](#scroll-creating-an-entity-schema)
- [Creating a Model](#hammer-creating-an-entity-model)

###### Usage

- [**API**](#api)
- [Datastore Operations](#blossom-datastore-operations)
- [API Responses](#api-responses)
- [Saving, Loading or Deleting Operations](#saving-loading-or-deleting-operations)
  - [Saving Entities](#saving-entities)
    - [Accessing Generated IDs on Save](#accessing-generated-ids-on-save)
  - [Loading Entities](#loading-entities)
  - [Deleting Entities](#deleting-entities)
- [Querying Operations](#querying-operations)
- [Transactions](#transactions)
- [Namespaces](#namespaces)

## Getting Started

#### Install the `pebblebed` package in your project:
```
yarn add pebblebed
```
or
```
npm install --save pebblebed
```

#### :electric_plug: Connecting client to Pebblebed

```
// Using example from Datastore documentation

import * as datastore from "@google-cloud/datastore";
import { Pebblebed } from "pebblebed"

const datastoreClient = datastore({
  projectId: 'grape-spaceship-123'
});

Pebblebed.connectDatastore(datastoreClient);
```

#### _And you're all set!_

### Running Datastore locally for development
By default, the above sets up the Datastore Client to connect to your datastore in the cloud. But you can also run a datastore instance locally using the `gcloud` command line tool, specifically:

`gcloud beta emulators datastore start`

You just need to include the created local endpoint (it will show when you start the local datastore emulator) to your configuration like so:
```
const datastoreClient = datastore({
  projectId: 'grape-spaceship-123',
  apiEndpoint: "http://localhost:8081"
});
```

### Next steps

* :scroll: Create a schema for an entity
* :hammer: Generate a model from that schema
* :blossom: Save, Load or Query on that entity

## A quick taster (example) of how it works

```
import { PebblebedModel } from "pebblebed";

// Create a schema for an entity

const schemaDefinition = {
    __excludeFromIndexes: ["testEmbeddedObject"],
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
const entities = await TestEntityModel.load("test-id-one").run();

// Load response always comes back as an array of entities
const entity = entities[0];

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
  __excludeFromIndexes: string[];
  [property: string]: SchemaPropertyDefinition;
}
```

```
interface SchemaPropertyDefinition {
  type: "string" | "int" | "double" | "boolean" | "datetime" | "array" | "object" | "geoPoint";
  required?: boolean;
  role?: "id";
  optional?: boolean;
  onSave?: (value: any) => any;
  default?: any;
}
```

### The `__excludeFromIndexes` schema property

This is a string array which contains the names of the properties that you would like to not be indexed. Example:

```
    __excludeFromIndexes: [
        "embeddedObjectEntityProperty",
        "reallyLongStringProperty",
        "embeddedObject.someProperty"
    ];
```

By default all properties on your entities will be indexed. This can become costly depending on the amount of indexed properties on an entity. To prevent this for certain properties set them in this string array.

Limitations in the way the Datastore library currently works means that you need to set each property that you don't want indexed in an embedded object. See this issue: https://github.com/GoogleCloudPlatform/google-cloud-node/issues/2510

---

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

#### ~~excludeFromIndexes: boolean~~
###### ~~(default false)~~

~~By default all properties on your entities will be indexed. This can become costly depending on the amount of indexed properties on an entity. To prevent this for certain properties set this to true~~

_As of version 0.4.0 This property has be deprecated in favour of setting the `__excludeFromIndexes` property in the root of your schema object._

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
    __excludeFromIndexes: ["testEmbeddedObject"],
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

## :hammer: Creating an Entity Model

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

The base helper module for various tasks.

Connect to a Datastore client instance
```
Pebblebed.connectDatastore(datastoreClient);
```

Get a Datastore transaction object
```
const transaction = Pebblebed.transaction();
```

Set a default namespace for operations

```
Pebblebed.setDefaultNamespace(namespace: string);
```

Create a datastore key using Models and ids

```
Pebblebed.key(...args: any[])

-- example --

const newKey = Pebblebed.key(TestEntityModel, "123abc");
```

Extract datastore keys from an array of objects

```
Pebblebed.keysFromObjectArray(sourceArray: object[], ...args: any[]);

-- example --

const objectArray = [
  {
    first: "king",
    something: "cool",
  },
  {
    first: "king",
    something: "cooler",
  }
]

const newKeys = Pebblebed.keysFromObjectArray(objectArray, TestParentEntityModel, "first", TestEntityModel, "something");
```
Conceptually, this example will return two keys with paths similar to this:
```
["TestParentKind", "king", "TestKind", "cool"]
["TestParentKind", "king", "TestKind", "cooler"]
```

If you have an array of objects but want to extract only keys which are unique in their path,
use this method:

```
const newKeys = Pebblebed.uniqueKeysFromObjectArray(objectArray, TestEntityModel, "first");
```

Even though there are two objects in the array, a single key 
will be returned with a path conceptually similar to this:
```
["TestEntityKind", "king"]
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

// Get a Datastore key for this entity (not really required using Pebblebed)
TestEntityModel.key(id: string | number):
```

## :blossom: Datastore Operations

A Datastore operation is enacted through the Models of your entities.
You create the operation on the Model using a function. One of these:

```
TestEntityModel.save( data: object | object[] )
TestEntityModel.load( ids?: string | number | Array<(string | number)> )
TestEntityModel.delete( data?: object | object[] )

TestEntityModel.query( namespace?: string )
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

## API Responses

Upon using `run()` on any operation, a Promise is returned.

Here is a breakdown of the various responses:

## Save response

```
await TestEntityModel.save(entity).withAncestors(AncestorEntityModel, "test-id").run();
```

Will **throw an error** if something goes wrong
(Schema validation or Datastore operation failure for some reason).
Otherwise, a response is not really required for a save operation,
but on success an object is returned that looks like this _(the response returned
from the official Datastore library)_:

```
{
    generatedIds: [ null ],
    mutationResults: [
      {
        conflictDetected: false,
        key: null,
        version: "12312312232300"
      }
    ],
    indexUpdates: 4
}
```

Pebblebed has augmented this Datastore response with the property `generatedIds`.

If we were using `int` IDs and were **auto-generating** them when saving to the Datastore,
those generated IDs will show up here in the array `generatedIds`.
In this example, we saved an entity with a deliberately set `string` ID, so the array only has one value of
`null` - indicating that the first entity saved did not have a generated ID (we already know what it is).

This array keeps the order of the entities as you passed them to the save operation.
So should you have mixed together auto-generated and deliberately set IDs, they will keep their order here,
for example: (`generateIds` after saving an array of 5 entities, all with auto-generated IDs except the middle entity):

```
generatedIds: [
  '5704726691708928',
  '5141776738287616',
  null,
  '6267676645130240',
  '4860301761576960'
]
```

_Mixing an entity kind with a variation of auto-generated and deliberately set IDs is not really recommended though_

## Delete response

Same as save response (above) - except for the `generatedIds` array.

## Load response

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

## Query response

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

`withAncestors()` : Pass in an array for ancestors **e.g:**

```
withAncestors(TestEntityModel, 123, "AnotherEntityKind", "idstring")
```

`123` and `"idstring"` in the above example represent the IDs for the ancestors. `TestEntityModel` is a `PebblebedModel` and `"AnotherEntityKind"` is a string - they represent the kinds of the ancestors.

## Saving entities
```
// Save an entity / entities of this Model to the Datastore
TestEntityModel.save(data: object | object[])
```

On starting a save operation you must pass in the the JavaScript objects which represent your entities (which should conform to your defined Schema). Either a single entity, or an array of entities.

### Functions unique to `save()` to describe the operation:

If your schema contains an ID property of `int` and you want them to be generated (you are not deliberately setting them), then use this method:
```
generateUnsetIds()
```

When performing load and query operations, entities are returned from the Datastore with meta information containing the ancestors of those entities. If you have previously retrieved an entity from the Datastore and are busy re-saving it - but do not want to use the ancestors that it previously had - use this method:

:warning: This will create a new Entity in the Datastore, the old one will still exist under the previous ancestors

```
ignoreDetectedAncestors()
```

### Accessing Generated IDs on Save

When saving entities for which you would like to generate IDs, you can do so using `generateUnsetIds()` on the save operation, like so:

```
const response = await TestEntityModel.save([testEntity, testEntityTwo]).generateUnsetIds().run();
```

As seen in the **Save Response** section above - `response` will be on object with an
extra property, `generatedIds` containing an array with the generated IDs after this operation.

**_Transactions_** work somewhat differently though.

### Accessing Generated IDs during transaction

Usually transactions only allocate IDs and reconcile all their various operations together during
their final `commit()` method. This makes it difficult to retrieve generated IDs unless we have
run `transaction.allocateIds()` beforehand and manually assigned them to the entities we want to
save (basically, actually deliberately setting their IDs).

While saving with a transaction, you can use a special option only available on save operations, like so:

```
const response = await TestEntityModel.save([testEntity, testEntityTwo])
                             .useTransaction(transaction, { allocateIdsNow: true })
                             .generateUnsetIds()
                             .run();
```

Passing on options object with `allocateIdsNow: true` as a second parameter to `useTransaction()` tells this operation you would
like to allocate IDs during this operation and have them returned. `response` will now be in the same format as a regular
save, containing a `generatedIds` property:

```
{
  generatedIds: [
    '5704726691708928',
    '5141776738287616',
  ]
}
```

This just means that for this operation, unlike a regular transaction operation which doesn't
do much actual work, Pebblebed will run the `allocateIds()` method for you (batched, on the
culmination of all the entities that require it in this operation).

## Loading entities
```
// Load an entity / entities of this Model to the Datastore
TestEntityModel.load(id: string | ids: array[])

OR

TestEntityModel.load(keys: DatastoreKey[])

// See the Pebblebed base module for helper methods to generate keys
```

On starting a load operation you must pass in the the string or integer IDs you wish to load for your Model's kind. Either a single ID, or an array of IDs. You may also pass in an array of keys.

### Functions unique to `load()` to describe the operation:

None required :relaxed:

## Deleting entities

```
// Delete an entity / entities of this Model in the Datastore
TestEntityModel.delete(data?: object | object[])
```

_Optional_ : On starting a delete operation you can pass in the the JavaScript objects which represent the entities you wish to delete (which should conform to your defined Schema - especially in relation to their IDs). Either a single entity, or an array of entities.

### Functions unique to `delete()` to describe the operation:

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

## Querying entities

```
// Query for entities of this Model in the Datastore
TestEnityModel.query(namespace?: string): DatastoreQuery;
```

Queries expose a slightly different API to the save, load and delete operations.

_Optional_ : Namespace to be defined when starting the operation.

### Functions unique to `query()` to describe the operation:

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

## Transactions

You can use the `Pebblebed` class, once connected to your Datastore client, to access transaction objects. They are used like so:

```
const transaction = Pebblebed.transaction();

await transaction.run();

const entities = await TestEntityModel.load("test-id-one", "test-id-two").useTransaction(transaction).run();

// ...do work on entities...
entities[0].amount -= 11.10;
entities[1].amount += 11.10;

await TestEntityModel.save(entities).useTransaction(transaction).run();

await transaction.commit();
```

Transactions ensure that all operations pass successfully - or else non of them do. See more in the official [transaction documentation](https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/1.0.0/datastore/transaction).

## Namespaces

Besides setting your Datastore namespace on the creation of your Datastore client, Pebblebed allows you to easily switch between namespaces, in one of two ways:

### Use the global Pebblebed module
```
Pebblebed.setDefaultNamespace("testing-ground");

// ... do some work on entities on the "testing-ground" namespace ...

Pebblebed.setDefaultNamespace(null);

// ... do some work on entities on the namespace which was set on creation of your client
// ... (or the default base namespace if you didn't set one)
```

This globally set default namespace **will be overridden** by the other method of
setting a namespace on the fly:

### Set namespace on the actual operation

As seen in the API documentation above, you can also set namespace on individual operations:

```
await TestModel.save(testEntity).useNamespace("testing-ground-two").run();
const entities = await TestModel.load("test-id-one").useNamespace("testing-ground-three").run();

// Queries must set namespace on creation
const query = await TestModel.query("testing-ground-two").filter("testTags", "=", "Great").run();
```

All datastore operations can set a namespace in this way and will override the namespaces
set by either the client (when you created your Datastore client), or by the global module
above.
