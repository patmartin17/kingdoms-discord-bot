// Load polyfill BEFORE anything else - MUST be first
if (typeof globalThis.ReadableStream === 'undefined') {
    try {
        const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill/ponyfill');
        // Set on multiple globals to ensure compatibility
        globalThis.ReadableStream = ReadableStream;
        globalThis.WritableStream = WritableStream;
        globalThis.TransformStream = TransformStream;
        global.ReadableStream = ReadableStream;
        global.WritableStream = WritableStream;
        global.TransformStream = TransformStream;
        // Also set on window if it exists (for browser-like environments)
        if (typeof window !== 'undefined') {
            window.ReadableStream = ReadableStream;
            window.WritableStream = WritableStream;
            window.TransformStream = TransformStream;
        }
        console.log('✅ ReadableStream polyfill loaded successfully');
    } catch (e) {
        console.error('❌ Failed to load polyfill:', e.message);
        process.exit(1);
    }
} else {
    console.log('✅ ReadableStream already available');
}

