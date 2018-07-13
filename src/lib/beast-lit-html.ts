import { program } from './beast';
import { render } from 'lit-html';

export function litProgram<Model, Msg>(
  createApp: Config<Model, Msg>,
  container: HTMLElement
) {
  let killProgram: any;
  let app = createApp;
  let _view = app.view;
  let _model: Model;
  let _emit: Dispatch<Msg>;

  killProgram = program<Model, Msg>({
    ...app,
    view: (model, emit) => {
      return _view ? render(_view(model, emit), container) : null;
    }
  });

  killProgram = () => {
    if (killProgram) {
      killProgram();
      killProgram = undefined;
    }
  };
}
