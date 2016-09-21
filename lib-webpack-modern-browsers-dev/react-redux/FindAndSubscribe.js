import { PropTypes, Component } from 'react';
import AbstractQuery from '../store/AbstractQuery';

export default class FindAndSubscribeComponent extends Component {

  componentDidMount() {
    var _props = this.props;
    var query = _props.query;
    var action = _props.action;
    var dispatch = _props.dispatch;

    this._find = query.fetch(result => {
      if (!this._find) return;
      dispatch(action(result));
      delete this._find;
    });
    this._subscribe = query.subscribe(result => dispatch(action(result, true)));
  }

  componentWillUnmount() {
    if (this._find) {
      // this._find.cancel();
      delete this._find;
    }
    if (this._subscribe) {
      this._subscribe.stop();
      delete this._subscribe;
    }
  }

  render() {
    throw new Error('Will be implemented next minor');
    return this.props.children;
  }
}
FindAndSubscribeComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  query: PropTypes.instanceOf(AbstractQuery).isRequired,
  children: PropTypes.node
};
//# sourceMappingURL=FindAndSubscribe.js.map