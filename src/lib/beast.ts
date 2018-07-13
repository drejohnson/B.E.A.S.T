export type Dispatch<Msg> = (msg: Msg) => void;
export type Cmd<Msg> = (emit: Dispatch<Msg>) => void;
export type Shutdown<Model> = (model: Model) => void;

export type Config<Model, Msg> = {
  init(): UpdateResult<Model, Msg>;
  subscriptions?: Cmd<Msg>;
  update(model: Model, msg: Msg): UpdateResult<Model, Msg>;
  view(model: Model, emit: Dispatch<Msg>): any;
  shutdown?: Shutdown<Model>;
};

export type UpdateResult<Model, Msg> = Model | [Model, Cmd<Msg>];

export function program<Model, Msg>(
  config: Config<Model, Msg>,
  render?: any,
  container?: Element
) {
  const { init, subscriptions, update, view, shutdown } = config;

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

  return function kill() {
    isRunning ? (isRunning = false) : shutdown ? shutdown(model) : null;
  };
}
