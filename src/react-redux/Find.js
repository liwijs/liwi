import { PropTypes, Component } from 'react';
import AbstractQuery from '../store/AbstractQuery';

export default class FindComponent extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    action: PropTypes.func.isRequired,
    query: PropTypes.instanceOf(AbstractQuery).isRequired,
    children: PropTypes.node,
  };

  componentDidMount() {
    const { query, action, dispatch } = this.props;
    this._find = query.run().then((result) => {
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

  render() {
    return this.props.children;
  }
}
