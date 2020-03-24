import { EventActions } from "@drizzle/store"

export const contractEventNotifier = store => next => action => {
  if (action.type === EventActions.EVENT_FIRED) {
    const contract = action.name
    const contractEvent = action.event.event
    const contractMessage = action.event.returnValues._message
    const display = `${contract}(${contractEvent}): ${contractMessage}`

    // interact with your service
    console.log("Contract event fired", display)
  }
  return next(action)
}

export const contractAddNotifier = store => next => action => {
  if (action.type === "CONTRACT_INITIALIZED") {
    // interact with your service
    console.log("Contract initialized fired", action)
  } else if (action.type === "CONTRACT_INITIALIZING") {
    // interact with your service
    console.log("Contract initializing fired", action)
  } else {
    console.log(action.type)
  }
  return next(action)
}
