import React from 'react';
import { singleArticleURL } from '../utils/constant';
import Loading from './Loading';
import Error from './Error';
import { Link, withRouter } from 'react-router-dom';
import AddComment from './AddComment';
class SingleArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: '',
      error: '',
    };
  }

  componentDidMount() {
    this.getArticle(this.props.match.params.slug);
  }

  getArticle = (slug) => {
    fetch(singleArticleURL + slug)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          article: data.article,
          error: '',
        });
      })
      .catch((err) => this.setState({ error: err }));
  };

  handleDeleteArticle = () => {
    let slug = this.props.match.params.slug;
    let token = this.props.user.token;
    fetch(singleArticleURL + slug, {
      method: 'DELETE',
      headers: {
        authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          article: '',
          error: '',
        });
        this.props.history.push(`/profiles/${this.props.user.username}`);
      })
      .catch((err) => this.setState({ error: err }));
  };

  handleEdit = () => {
    let { slug } = this.state.article;
    this.props.history.push({
      pathname: `/article/edit/${slug}`,
    });
  };

  updatedDate = (val) => {
    let newDate = new Date(val);
    return newDate.toDateString();
  };

  render() {
    let { article, error } = this.state;
    if (!article) return <Loading />;
    if (error) return <Error error={error} />;
    return (
      <div className=''>
        <section id='single-art-hero'>
          <div className='container'>
            <h1 className='hero-heading single-art-heading'>{article.title}</h1>
            <div className='flex gap-2 align-center'>
              <div className='img-author-holder padd-1 flex gap-half align-center'>
                <img
                  className='author-img'
                  src={article.author.image}
                  alt={article.author.username}
                />
                <div className=''>
                  <Link to={`/profiles/${article.author.username}`}>
                    <h3 className='author-name author-single-art'>
                      {article.author.username}
                    </h3>
                  </Link>
                  <span className='date'>
                    {this.updatedDate(article.updatedAt)}
                  </span>
                </div>
              </div>
              {this.state.article.author.username ===
              this.props.user.username ? (
                <div>
                  <button onClick={this.handleEdit} className='edit-article'>
                    <i className='ion-edit'></i>
                    Edit Article
                  </button>
                  <button
                    onClick={this.handleDeleteArticle}
                    className='delete-article'
                  >
                    <i className='ion-trash-a'></i>
                    Delete Article
                  </button>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </section>
        <div className='container'>
          <section className='single-art-holder'>
            <p className='single-art-description'>{article.body}</p>
            <ul className='flex gap-half'>
              {article.tagList.map((tag) => {
                return (
                  <li className='single-art-tag' key={tag}>
                    {tag}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
        <section className='comment-section'>
          <div className='container'>
            {!this.props.isUserLoggedIn ? (
              <p className='padd-1'>
                <Link to='/login'>Sign in</Link> or{' '}
                <Link to='/register'>Sign up</Link> to add comments on this
                article
              </p>
            ) : (
              <AddComment user={this.props.user} slug={article.slug} />
            )}
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(SingleArticle);
