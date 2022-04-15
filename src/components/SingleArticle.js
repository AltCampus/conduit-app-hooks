import React from 'react';
import { singleArticleURL } from '../utils/constant';
import Loading from './Loading';
import Error from './Error';

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
            <div className='img-author-holder padd-1 flex gap-half align-center'>
              <img
                className='author-img'
                src={article.author.image}
                alt={article.author.username}
              />
              <div className=''>
                <h3 className='author-name author-single-art'>
                  {article.author.username}
                </h3>
                <span className='date'>
                  {this.updatedDate(article.updatedAt)}
                </span>
              </div>
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
      </div>
    );
  }
}

export default SingleArticle;
