# A Javascript Pub/Sub Hub

A pub/sub hub implemented in Javascript, intended to allow event-based implementation for a UI.

## Files

The code is contained within the file `pubsubhub.js`, with example code available in the `examples` folder.

## Usage

Import using a package manager such as `npm`:

```
npm install --save @guzo/pubsubhub
```

Then import the package in your code:

```
import hub from "@guzo/pubsubhub";
```

If you just want to import the file directly, you can also do that:

```
import hub from "./pubsubhub.js";
```

Register with the hub to be able to start using it:

```
const widget = hub.register("My Widget");
```

Then you can publish to a topic using from your widget:

```
widget.publish("updated", { data: "new data" });
```

You can subscribe to topics by supplying a function:

```
widget.subscribe("request", myRequestHander);
```

By default, the subscription will start from when you subscribe.  If you want
to get earlier messages which have been published, you can pass in an offset.
As an example, this will pick up all published messages:

```
widget.subscribe("request", myRequestHander, 0);
```

The function you supply will receive a single argument, which contains the data
passed in the published event, for example:

```
const myRequestHandler = payload => {

    console.log("PAYLOAD FROM EVENT", payload);
};
```
