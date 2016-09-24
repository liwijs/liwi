import { PropTypes, Component } from 'react';
import AbstractQuery from '../store/AbstractQuery';

export default class FindAndSubscribeComponent extends Component {

  componentDidMount() {
    // console.log('FindAndSubscribe: did mount');
    var _props = this.props;
    var query = _props.query;
    var action = _props.action;
    var dispatch = _props.dispatch;

    this._subscribe = query.fetchAndSubscribe((err, result) => {
      if (err) {
        // eslint-disable-next-line no-undef, no-alert
        alert(`Unexpected error: ${ err }`);
        return;
      }

      dispatch(action(result, true));
    });
  }

  componentWillUnmount() {
    // console.log('FindAndSubscribe: will unmount');
    if (this._subscribe) {
      this._subscribe.stop();
      delete this._subscribe;
    }
  }

  render() {
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