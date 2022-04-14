import { Link } from 'react-router-dom';

function FeedNav(props) {
  return (
    <div className='feed-toggle'>
      <ul className='flex gap-1'>
        <li key={1} onClick={props.emptyTab}>
          <Link
            to='/'
            className={
              props.activeTab ? 'global-feed' : 'global-feed activeToggle'
            }
          >
            #GlobalFeed
          </Link>
        </li>
        {props.activeTab && (
          <li key={2}>
            <Link to='/' className='global-feed activeToggle'>
              #{props.activeTab}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default FeedNav;

// {props.feedToggle.length > 1 ? (
//   <li key={2} className='global-feed activeToggle'>
//     #{props.feedToggle[1]}
//   </li>
// ) : (
//   ''
// )}
