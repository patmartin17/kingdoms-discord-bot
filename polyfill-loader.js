// CRITICAL: Load polyfill BEFORE anything else - MUST be absolute first thing
// This patches ReadableStream before undici or any other module loads it

const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill/ponyfill');

// Set on ALL possible global objects
globalThis.ReadableStream = ReadableStream;
globalThis.WritableStream = WritableStream;
globalThis.TransformStream = TransformStream;
global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.TransformStream = TransformStream;

// Patch module cache to inject ReadableStream into undici if it tries to load
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    const result = originalRequire.apply(this, arguments);
    // If undici is being loaded, ensure ReadableStream is available
    if (id.includes('undici') || id.includes('fetch')) {
        if (typeof globalThis.ReadableStream === 'undefined') {
            globalThis.ReadableStream = ReadableStream;
            global.ReadableStream = ReadableStream;
        }
    }
    return result;
};

console.log('✅ ReadableStream polyfill loaded and patched');

