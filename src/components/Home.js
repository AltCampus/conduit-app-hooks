import React from 'react';
// import Loading from './Loading';
// import { FaHeart } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';
import Error from './Error';
import Posts from './Posts';
import Sidebar from './Sidebar';
import FeedNav from './FeedNav';
import Pagination from './Pagination';
import { articlesURL } from '../utils/constant';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: null,
      articlesCount: 0,
      articlesPerPage: 10,
      activePageIndex: 1,
      activeTab: '',
    };
  }

  emptyTab = () => {
    this.setState({ activeTab: '' });
  };
  addTab = (val) => {
    this.setState({ activeTab: val });
  };

  componentDidMount() {
    this.getArticles();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.activeTab !== this.state.activeTab) {
      this.getArticles();
    }
  }

  getArticles = () => {
    let limit = this.state.articlesPerPage;
    let offset = (this.state.activePageIndex - 1) * 10;
    let tag = this.state.activeTab;
    fetch(
      articlesURL + `/?offset=${offset}&limit=${limit}` + (tag && `&tag=${tag}`)
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
        });
      })
      .catch((err) => <Error error={err} />);
  };

  updateCurrentPageIndex = (val) => {
    this.setState({ activePageIndex: val }, this.getArticles);
  };

  render() {
    let {
      articles,
      articlesCount,
      articlesPerPage,
      activePageIndex,
      activeTab,
    } = this.state;
    return (
      <main>
        <Banner />
        <section id='main'>
          <div className='container'>
            <div className='row flex space-btw'>
              <div className='feed'>
                <FeedNav activeTab={activeTab} emptyTab={this.emptyTab} />
                <Posts articles={articles || []} />
              </div>
              <Sidebar addTab={this.addTab} />
            </div>
            <Pagination
              articlesCount={articlesCount}
              articlesPerPage={articlesPerPage}
              activePageIndex={activePageIndex}
              updateCurrentPageIndex={this.updateCurrentPageIndex}
            />
          </div>
        </section>
      </main>
    );
  }
}

function Banner() {
  return (
    <section id='hero-section'>
      <h1 className='hero-heading'>conduit</h1>
      <h2 className='hero-subheading'>A place to share your knowledge.</h2>
    </section>
  );
}

// function Pagination(props) {
//   return (
//     <div className=''>
//       <ul className='pagination-holder flex'>
//         {props.totalPages.map((no) => {
//           return (
//             <button
//               key={no}
//               onClick={() => props.handleChangePageNo(no)}
//               className={props.pageNo === no ? 'activePageNo' : 'pageNo'}
//             >
//               {no}
//             </button>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }

// class Article extends React.Component {
//   updatedDate = (val) => {
//     let newDate = new Date(val);
//     return newDate.toDateString();
//   };

//   render() {
//     let { article } = this.props;
//     return !article ? (
//       <Loading />
//     ) : (
//       <li className='single-article'>
//         <div className='flex space-btw'>
//           <div className='img-author-holder flex gap-half'>
//             <img
//               className='author-img'
//               src={article.author.image}
//               alt={article.author.username}
//             />
//             <div className=''>
//               <h3 className='author-name'>{article.author.username}</h3>
//               <span className='date'>
//                 {this.updatedDate(article.updatedAt)}
//               </span>
//             </div>
//           </div>
//           <div className='likes-count-holder'>
//             <FaHeart className='heart' />
//             <span className='likes'>{article.favoritesCount}</span>
//           </div>
//         </div>
//         <div className='padd-1'>
//           <h2
//             onClick={() => this.props.handleClick(article.slug)}
//             className='article-title'
//           >
//             {article.title}
//           </h2>
//           <p
//             onClick={() => this.props.handleClick(article.slug)}
//             className='article-description'
//           >
//             {article.description.substring(0, 100)}...
//           </p>
//         </div>
//         <div className='flex space-btw'>
//           <button
//             onClick={() => this.props.handleClick(article.slug)}
//             className='read-more'
//           >
//             Read more...
//           </button>
//           <div className='flex gap-half'>
//             {article.tagList.map((tag) => {
//               return (
//                 <button
//                   key={tag}
//                   className='test'
//                   onClick={() => this.props.handleClick(article.slug)}
//                 >
//                   {tag}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </li>
//     );
//   }
// }

// *///////************* */

// componentDidMount() {
//   this.getAllArticles();
// }

// getAllArticles = () => {
//   fetch('https://mighty-oasis-08080.herokuapp.com/api/articles')
//     .then((res, err) => {
//       if (err) return <Error error={err} />;
//       return res.json();
//     })
//     .then((data) => {
//       this.setState({ allArticles: data.articles }, this.setArticles);
//       this.getAllTags(data.articles);
//     });
// };

// getAllTags = (allArticles) => {
//   let { allTags } = this.state;
//   if (allArticles) {
//     allTags = allArticles.reduce((a, b) => {
//       a = a.concat(b.tagList);
//       return a;
//     }, []);
//     let all = [...allTags].sort();
//     let final = [...allTags].sort().filter((tag, i) => {
//       if (tag !== all[i + 1]) {
//         return tag;
//       }
//     });
//     allTags = final;
//   }
//   this.setState({ allTags });
// };

// setArticles = () => {
//   let { articles, allArticles, totalPages } = this.state;
//   articles = allArticles;
//   if (this.state.feedToggle[1]) {
//     articles = articles.filter((article) => {
//       return article.tagList.includes(this.state.feedToggle[1]);
//     });
//     if (articles.length > 10) {
//       totalPages = this.getPaginationArray(articles);
//     } else {
//       totalPages = [1];
//     }
//   }
//   if (articles.length > 10) {
//     articles = this.handleArticlesOnPage(allArticles);
//     totalPages = this.getPaginationArray(allArticles.length);
//   }

//   this.setState(
//     {
//       articles,
//       allArticles,
//       totalPages,
//     },
//     this.getAllTags
//   );
// };

// handleGlobalToggle = () => {
//   let { feedToggle } = this.state;
//   feedToggle.splice(1, 1);
//   this.setState({ feedToggle }, this.setArticles);
// };

// handleFeedToggle = (val) => {
//   let { feedToggle } = this.state;
//   feedToggle[1] = val;
//   this.setState({ feedToggle }, this.setArticles);
// };

// handleClick = (slug) => {
//   this.props.history.push(`/article/${slug}`);
// };

// getPaginationArray = (length) => {
//   let index = Math.ceil(length / 10);
//   let pageArray = [];
//   for (let i = 1; i <= index; i++) {
//     pageArray.push(i);
//   }
//   return pageArray;
// };

// handleArticlesOnPage = (articles) => {
//   return articles.filter((article, index) => {
//     if (
//       index < this.state.pageNo * 10 &&
//       index >= this.state.pageNo * 10 - 10
//     ) {
//       return article;
//     }
//   });
// };

// handleChangePageNo = (val) => {
//   this.setState({ pageNo: val }, this.setArticles);
// };

export default withRouter(Home);
