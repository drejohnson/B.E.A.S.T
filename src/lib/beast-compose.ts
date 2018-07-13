export function mapEffect<MsgIn, MsgOut>(
  effect: Cmd<MsgIn> | undefined,
  map: (msg: MsgIn | undefined) => MsgOut
) {
  return effect
    ? (emit: Dispatch<MsgOut>) => effect(msg => emit(map(msg)))
    : undefined;
}

export function batchEffects<Msg>(effects: Array<Cmd<Msg> | undefined>) {
  return (emit: Dispatch<Msg>) =>
    effects.map(effect => (effect ? effect(emit) : undefined));
}

export function mapProgram<Model, Msg>(
  program: Config<Model, Msg>,
  callback: any
) {
  const start = program.init();
  const init = [start[0], mapEffect(start[1], callback)];

  function update(model: Model, msg: Msg) {
    const change = program.update(model, msg);
    return [change[0], mapEffect(change[1], callback)];
  }

  function view(model: Model, emit: Dispatch<Msg>) {
    return program.view(model, msg => emit(callback(msg)));
  }

  return { init, update, view, done: program.done };
}

export function batchPrograms<Model, Msg>(
  programs: Config<Model, Msg>[],
  containerView: any
) {
  const embeds: any[] = [];
  const models: Model[] = [];
  const effects: Cmd<Msg>[] = [];
  const programCount = programs.length;
  // for (let i = 0; i < programCount; i++) {
  //   const index = i;
  //   const program = programs[index];

  //   const embed = mapProgram(program, (data: any) => ({ index, data }));
  //   embeds.push(embed);
  //   models.push(embed.init[0]);
  //   effects.push(embed.init[1]);
  // }

  programs.map((program, index) => {
    const embed = mapProgram(program, (data: any) => ({ index, data }));
    embeds.push(embed);
    models.push(embed.init[0]);
    effects.push(embed.init[1]);
  });

  const init = [models, batchEffects(effects)];

  function update(model: Model[], msg: any) {
    const { index, data } = msg;
    const change = embeds[index].update(data, model[index]);
    const newState = model.slice(0);
    newState[index] = change[0];
    return [newState, change[1]];
  }

  function view(model: Model, emit: Dispatch<Msg>) {
    const programViews = embeds.map((embed, index) => () =>
      embed.view(model[index], emit)
    );

    return containerView(programViews);
  }

  function done(model: Model) {
    // for (let i = 0; i < programCount; i++) {
    //   const done = embeds[i].done;
    //   if (done) {
    //     done(model[i]);
    //   }
    // }
    programs.map(program => {
      const done = program.done;
      if (done) {
        done(model);
      }
      return done;
    });
  }

  return { init, update, view, done };
}
