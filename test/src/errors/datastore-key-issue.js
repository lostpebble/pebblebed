const Datastore = require("@google-cloud/datastore");

const ds = new Datastore();

const intId = ds.int(123123);

const key = ds.key({
  namespace: "test-namespace",
  path: ["MyEntity", intId],
});

console.log(key);
