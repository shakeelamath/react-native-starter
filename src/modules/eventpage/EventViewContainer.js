import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import GalleryScreen from './EventView';
import { loadImages, refreshImages } from './EventState';

export default compose(
  connect(
    state => ({
      isLoading: state.gallery.isLoading,
      images: state.gallery.images,
    }),
    dispatch => ({
      loadImages: () => dispatch(loadImages()),
      refreshImages: () => dispatch(refreshImages()),
    }),
  ),
  lifecycle({
    componentDidMount() {
      this.props.loadImages();
    },
  }),
)(GalleryScreen);
