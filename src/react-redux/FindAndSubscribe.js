import { PropTypes, Component } from 'react';
import AbstractQuery from '../store/AbstractQuery';

export default class FindAndSubscribeComponent extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    action: PropTypes.func.isRequired,
    query: PropTypes.instanceOf(AbstractQuery).isRequired,
    children: PropTypes.node,
  };

  componentDidMount() {
    // console.log('FindAndSubscribe: did mount');
    const { query, action, dispatch } = this.props;
    this._subscribe = query.fetchAndSubscribe((err, result) => {
      if (err) {
        // eslint-disable-next-line no-undef, no-alert
        alert(`Unexpected error: ${err}`);
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
