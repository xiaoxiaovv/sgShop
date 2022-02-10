import * as React from 'react';
import { create } from 'dva-core';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

// const defaultConfig = {
//   pageReducers: {},
//   // reducers: commonReducers, // import from other files
//   // middlewares: commonMiddlewares, // import from other files
// };

const dva = (options) => {
  const app = create(options);
  // HMR workaround
  // tslint:disable-next-line:curly
  options.models.forEach(model => app.model(model));

  app.start();
  const store = app._store;
  // 外面传进来的组件作为参数放到Provider组件里面
  app.start = container => () => {
    // Log(container);
    return (
      <Provider store={store}>
          {container}
      </Provider>
    );
  }
  app.getStore = () => store;
  return app;
};

const app = (models) => dva({
  initialState: {},
  // 加载maodel
  models,
  onAction: createLogger(),
  onError(e) {
      Log('onError', e);
  },
});

const withDva = config => (Comp) => {
  // const finalConfig = {
  //   ...defaultConfig,
  //   ...config,
  // };

  // const { middlewares, reducers } = finalConfig;

  return class WithDva extends React.Component {
    constructor(props) {
      super(props);
    }

    public render() {
      const DvaComp = app(config).start(<Comp {...this.props} />);
      return (
        <DvaComp />
      );
    }
  };
};

export default withDva;
