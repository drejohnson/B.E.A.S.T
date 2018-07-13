export type Dispatch<Msg> = (msg: Msg) => void;
export type Sub<Msg> = (emit: Dispatch<Msg>) => void;
export type Cmd<Msg> = Sub<Msg>;
export type Done<Model> = (model: Model) => void;

export type Config<Model, Msg> = {
  init(): UpdateResult<Model, Msg>;
  subscriptions?: Cmd<Msg>;
  update(model: Model, msg: Msg): UpdateResult<Model, Msg>;
  view(model: Model, emit: Dispatch<Msg>): any;
  done?: Done<Model>;
};

export type UpdateResult<Model, Msg> = Model | [Model, Cmd<Msg>];

export const program = <Model, Msg>(
  config: Config<Model, Msg>,
  render?: any,
  container?: Element
) => {
  const { init, subscriptions, update, view, done } = config;

  let model: any = null;
  let isRunning = true;

  model === null
    ? (handleUpdate(init()), subscriptions && subscriptions(emit))
    : handleUpdate(model);

  function emit(msg: Msg) {
    isRunning ? handleUpdate(update(model, msg)) : null;
  }

  function handleUpdate(result: UpdateResult<Model, Msg>) {
    let sideEffect: Cmd<Msg>;
    Array.isArray(result)
      ? ((model = result[0]), (sideEffect = result[1]), sideEffect(emit))
      : (model = result);
    render ? render(view(model, emit), container) : view(model, emit);
  }

  return function end() {
    isRunning ? (isRunning = false) : done ? done(model) : null;
  };
};
