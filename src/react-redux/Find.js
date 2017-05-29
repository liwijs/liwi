import { Component } from 'react';
import PropTypes from 'prop-types';
import type { ReactNodeType, ReduxDispatchType } from 'alp-react-redux/types';
import AbstractQuery from '../store/AbstractQuery';

type ActionType = (result: any) => any;

type PropsType = {
  dispatch: ?ReduxDispatchType,
  action: ActionType,
  query: AbstractQuery,
  children: ReactNodeType,
};

export default class FindComponent extends Component {
  props: PropsType;

  static contextTypes = {
    store: PropTypes.any,
  };

  componentDidMount() {
    const { query, action } = this.props;
    const dispatch = this.props.dispatch || this.context.store.dispatch;
    this._find = query.fetch((result: any) => {
      if (!this._find) return;
      dispatch(action(result));
      delete this._find;
    });
  }

  componentWillUnmount() {
    if (this._find) {
      // this._find.cancel();
      delete this._find;
    }
  }

  render(): ReactNodeType {
    return this.props.children;
  }
}
