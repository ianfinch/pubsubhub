const participants = {};
const topics = {};
const subscribers = {};
let logging = false;

/**
 * Futureproofing for logging, if we want to swap something else in later
 */
function log () {
    if (logging) {
        console.log.apply(null, arguments);
    }
};

/**
 * Generate a GUID to identify pub/sub participants
 */
const guid = () => {

    const s4 = () => {
       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
}

/**
 * Subscribe to a topic, by supplying a callback to handle any published events
 *
 * Pass an optional offset to use (otherwise, default to new messages)
 */
const subscribe = id => {

    const name = participants[id];

    return (topic, callback, initialOffset = false) => {

        if (!topics[topic]) {
            topics[topic] = [];
        }

        if (!subscribers[name]) {
            subscribers[name] = {};
        }

        if (initialOffset === false) {
            initialOffset = topics[topic].length;
        }

        subscribers[name][topic] = { callback, offset: initialOffset };
        log("[SUBSCRIBE]", topic, "->", name);
        sendToSubscribers(topic);
    };
};

/**
 * Unsubscribe from a topic
 */
const unsubscribe = id => {

    const name = participants[id];

    return topic => {
        delete subscribers[name][topic];
        log("[UNSUBSCRIBE]", topic, "--X-->", name);
    };
};

/**
 * Notify subscribers of new messages
 */
const sendToSubscribers = topic => {

    Object.values(subscribers).forEach(subscriber => {

        if (subscriber[topic] && subscriber[topic].callback) {
            while(subscriber[topic].offset < topics[topic].length) {
                subscriber[topic].callback(topics[topic][subscriber[topic].offset]);
                subscriber[topic].offset = subscriber[topic].offset + 1;
            }
        }
    });
};

/**
 * Publish a payload to a topic
 */
const publish = id => {

    const name = participants[id];

    return (topic, payload) => {

        if (typeof payload !== "object") {
            payload = { _body: payload };
        }

        payload = Object.assign({ _time: new Date() }, payload);

        log("[PUBLISH]", name, "->", topic, "//", payload);

        if (!topics[topic]) {
            topics[topic] = [];
        }

        topics[topic].push(payload);
        sendToSubscribers(topic);
    };
};

/**
 * Register as a participant to either publish or subscribe to events (or both)
 */
const register = name => {

    const id = guid();
    participants[id] = name;
    log("[REGISTER]", name, "as", id);

    return {
        publish: publish(id),
        subscribe: subscribe(id),
        unsubscribe: unsubscribe(id)
    };
};

export default {
    log: targetState => { logging = targetState; },
    register
};
