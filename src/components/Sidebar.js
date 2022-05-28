import React, { useState, useEffect } from 'react';

import Error from './Error';
import Loading from './Loading';
import { tagsURL } from '../utils/constant';
import useFetch from '../customHooks/useFetch';

function Sidebar(props) {
  let [data, setData] = useState(null);
  let { makeApiCall, isLoading, error } = useFetch();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    let fetchedData = await makeApiCall(tagsURL);
    setData(fetchedData);
  };

  if (data && data.tags) {
    data.tags = data.tags.filter((tag) => {
      if (tag) return tag;
      return '';
    });
  }

  if (error) return <Error error={error} />;

  if (isLoading) return <Loading />;

  return (
    <aside className='tags'>
      <h3 className='tags-heading'>Popular Tags</h3>
      <ul className='tag-list-holder flex gap-half wrap'>
        {data.tags ? (
          data.tags.map((tag) => {
            return (
              <li
                key={tag}
                className={props.activeTag === tag ? 'tag active-tag' : 'tag'}
                onClick={() => props.addTab(tag)}
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

export default Sidebar;
