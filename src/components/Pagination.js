function Pagination(props) {
  let { articlesCount, articlesPerPage, activePageIndex } = props;
  let numberOfPages = Math.ceil(articlesCount / articlesPerPage);
  let pagesArray = [];
  for (let i = 1; i <= numberOfPages; i++) {
    pagesArray.push(i);
  }
  return (
    <div className=''>
      <ul className='pagination-holder flex'>
        {pagesArray.map((no) => {
          return (
            <button
              key={no}
              onClick={() => props.updateCurrentPageIndex(no)}
              className={activePageIndex === no ? 'activePageNo' : 'pageNo'}
            >
              {no}
            </button>
          );
        })}
      </ul>
    </div>
  );
}

export default Pagination;
