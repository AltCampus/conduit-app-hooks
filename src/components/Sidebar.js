import React from 'react';
import { tagsURL } from '../utils/constant';
import Error from './Error';
import Loading from './Loading';
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: null,
    };
  }

  componentDidMount() {
    this.getArticles();
  }

  getArticles = () => {
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
      .catch((err) => <Error error={err} />);
  };
  render() {
    let allTags = this.state.tags;
    if (!allTags) return <Loading />;
    return (
      <aside className='tags'>
        <h3 className='tags-heading'>Popular Tags</h3>
        <ul className='tag-list-holder flex gap-half wrap'>
          {allTags.length ? (
            allTags.map((tag) => {
              return (
                <li
                  key={tag}
                  className={'tag'}
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
