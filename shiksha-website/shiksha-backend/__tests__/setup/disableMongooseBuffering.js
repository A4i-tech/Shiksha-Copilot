// Unit tests must never touch a real database. When a model call is not
// mocked, Mongoose's default buffering queues the operation and waits for a
// connection that never arrives, only failing after a 10s timeout — and
// because that timeout fires on Node's event loop well after the offending
// test has finished, Jest often blames a later, unrelated test for the
// failure instead of the one that actually made the call. Disabling
// buffering makes an unmocked call reject immediately, against the test
// that actually caused it.
const mongoose = require("mongoose");
mongoose.set("bufferCommands", false);
