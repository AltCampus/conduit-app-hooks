import React from 'react';

import Error from './Error';
import Loading from './Loading';
import { tagsURL } from '../utils/constant';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: null,
      error: '',
    };
  }

  componentDidMount() {
    this.getTags();
  }

  getTags = () => {
    fetch(tagsURL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ tags }) => {
        this.setState({ tags });
      })
      .catch((error) => this.setState({ error }));
  };

  render() {
    let { tags, error } = this.state;
    if (tags) {
      tags = this.state.tags.filter((tag) => {
        if (tag) return tag;
        return '';
      });
    }

    if (error) return <Error error={error} />;
    return (
      <aside className='tags'>
        <h3 className='tags-heading'>Popular Tags</h3>
        <ul className='tag-list-holder flex gap-half wrap'>
          {tags ? (
            tags.map((tag) => {
              return (
                <li
                  key={tag}
                  className={
                    this.props.activeTag === tag ? 'tag active-tag' : 'tag'
                  }
                  onClick={() => this.props.addTab(tag)}
                >
                  {tag}
                </li>
              );
            })
          ) : (
            <Loading />
          )}
        </ul>
      </aside>
    );
  }
}

export default Sidebar;
