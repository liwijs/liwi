import { Component } from 'react';
import PropTypes from 'prop-types';
import type { ReactNodeType, ReduxDispatchType } from 'alp-react-redux/types';
import type AbstractQuery from '../store/AbstractQuery';

type ActionType = (result: any) => any;

type PropsType = {
  dispatch: ?ReduxDispatchType,
  action: ActionType,
  query: AbstractQuery,
  children: ReactNodeType,
};

export default class FindAndSubscribeComponent extends Component {
  props: PropsType;

  static contextTypes = {
    store: PropTypes.any,
  };

  componentDidMount() {
    const { query, action } = this.props;
    const dispatch = this.props.dispatch || this.context.store.dispatch;
    this._subscribe = query.fetchAndSubscribe((err, result) => {
      if (err) {
        // eslint-disable-next-line no-alert
        alert(`Unexpected error: ${err}`);
        return;
      }

      dispatch(action(result, true));
    });
  }

  componentWillUnmount() {
    if (this._subscribe) {
      this._subscribe.stop();
      delete this._subscribe;
    }
  }

  render(): ReactNodeType {
    return this.props.children;
  }
}
