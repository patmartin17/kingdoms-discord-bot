// Load polyfill BEFORE anything else
if (typeof globalThis.ReadableStream === 'undefined') {
    try {
        const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill/ponyfill');
        globalThis.ReadableStream = ReadableStream;
        globalThis.WritableStream = WritableStream;
        globalThis.TransformStream = TransformStream;
        global.ReadableStream = ReadableStream;
        global.WritableStream = WritableStream;
        global.TransformStream = TransformStream;
        console.log('✅ ReadableStream polyfill loaded');
    } catch (e) {
        console.error('❌ Failed to load polyfill:', e.message);
    }
}

