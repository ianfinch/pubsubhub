/**
 * Simple test of Pub Sub Hub
 *
 * Three agents ...
 *
 *   - Initiator ... sends out two numbers and collects results
 *   - Adder ... takes two numbers and publishes the sum of the two as its result
 *   - Multiplier ... takes two numbers and publishes the product of the two as its result
 *
 * Two topics ...
 *
 *   - problem ... place to listen to for problems to solve
 *   - result ... where to publish the result
 */

import hub from "../pubsubhub.js";

const adderProblemHandler = payload => {
    console.log("Adder received payload:", payload);
    adder.publish("result", payload.x + payload.y);
};

const multiplierProblemHandler = payload => {
    console.log("Multiplier received payload:", payload);
    multiplier.publish("result", payload.x * payload.y);
};

const initiatorResultHandler = payload => {
    console.log("Initiator received payload:", payload);
};

const initiator = hub.register("Initiator");
const adder = hub.register("Adder");
const multiplier = hub.register("Multiplier");

initiator.subscribe("result", initiatorResultHandler);
adder.subscribe("problem", adderProblemHandler);
multiplier.subscribe("problem", multiplierProblemHandler);
initiator.publish("problem", { x: 3, y: 5 });

adder.unsubscribe("problem");
initiator.publish("problem", { x: 6, y: 7 });

adder.subscribe("problem", adderProblemHandler);
initiator.publish("problem", { x: 4, y: 9 });
