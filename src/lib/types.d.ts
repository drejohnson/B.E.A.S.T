type Dispatch<Msg> = (msg: Msg) => void;
type Sub<Msg> = (emit: Dispatch<Msg>) => void;
type Cmd<Msg> = Sub<Msg>;
type Done<Model> = (model: Model) => void;

type Config<Model, Msg> = {
  init(): UpdateResult<Model, Msg>;
  subscriptions?: Cmd<Msg>;
  update(model: Model, msg: Msg): UpdateResult<Model, Msg>;
  view(model: Model, emit: Dispatch<Msg>): any;
  done?: Done<Model>;
};

type UpdateResult<Model, Msg> = Model | [Model, Cmd<Msg>];
