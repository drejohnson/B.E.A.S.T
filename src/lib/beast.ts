export function program<Model, Msg>(config: Config<Model, Msg>) {
  const { init, subscriptions, update, view, done } = config;

  let model: any = null;
  let isRunning = true;

  if (model === null) {
    handleUpdate(init());
    subscriptions && subscriptions(emit);
  } else {
    handleUpdate(model);
  }

  function emit(msg: Msg) {
    if (isRunning) {
      handleUpdate(update(model, msg));
    }
  }

  function handleUpdate(result: UpdateResult<Model, Msg>) {
    if (Array.isArray(result)) {
      model = result[0];
      let sideEffect = result[1];
      sideEffect(emit);
    } else {
      model = result;
    }
    view(model, emit);
  }

  return function end() {
    if (isRunning) {
      isRunning = false;
      if (done) {
        done(model);
      }
    }
  };
}
