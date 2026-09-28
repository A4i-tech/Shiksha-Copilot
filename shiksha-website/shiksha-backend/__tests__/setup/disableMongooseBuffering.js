// Disabling buffering makes a call to an unmocked model reject immediately, instead of timing out later and having Jest blame the wrong test.
const mongoose = require("mongoose");
mongoose.set("bufferCommands", false);
