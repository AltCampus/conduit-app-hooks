import { Link } from 'react-router-dom';

function FeedNav(props) {
  let isUserLoggedIn = props.isUserLoggedIn;
  return (
    <div className='feed-toggle'>
      <ul className='flex gap-1'>
        {!isUserLoggedIn ? (
          ''
        ) : (
          <li key={1} onClick={props.emptyTab}>
            <Link
              to='/'
              onClick={() => props.changeFeedSelected('myFeed')}
              className={
                props.feedSelected === 'myFeed' && !props.activeTag
                  ? 'global-feed activeToggle'
                  : 'global-feed'
              }
            >
              YourFeed
            </Link>
          </li>
        )}
        <li key={2} onClick={props.emptyTab}>
          <Link
            to='/'
            onClick={() => props.changeFeedSelected('globalFeed')}
            className={
              props.feedSelected === 'globalFeed' && !props.activeTag
                ? 'global-feed activeToggle'
                : 'global-feed'
            }
          >
            GlobalFeed
          </Link>
        </li>
        {props.activeTag && (
          <li key={3}>
            <Link to='/' className='global-feed activeToggle'>
              #{props.activeTag}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default FeedNav;
