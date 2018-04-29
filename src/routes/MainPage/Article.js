import React from 'react';
import { Avatar, Layout } from 'antd';
import styles from './Article.less'
const { Content } = Layout;
import { connect } from 'dva';

@connect(({ article }) => ({ article }))
class Article extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'article/fetch',
      payload: {}
    });
  }

  parseContent = (contents) => {
    console.log(contents);
    if (!Array.isArray(contents)) {
      return (<p>{contents}</p>);
    }
    return contents.map((item, index, array)=>{
      return (<p key={index}>{array[index]}</p>);
      });
  }

  render() {
    console.log(this.props);
    const { article, location } = this.props;
    const articles = article.articles;

    let id;
    try {
      id = location.state.id;
    } catch (err) {
      id = 0;
    }
    let content, title, author, date;
    try {
      content = articles[id].content;
      title = articles[id].title;
      author = articles[id].author;
      date = articles[id].date;
    } catch (err) {
      content = title = author = date = "";
    }




    return (
      <Layout style={{background: '#fff', height: '100%'}}>
        <Content>
          <div className={styles.title}><h1>{title}</h1></div>
          <div className={styles.author}><p>{author}</p></div>
          <div className={styles.content}>{this.parseContent(content)}</div>
          <div className={styles.foot}><p>时间:{date}</p></div>
        </Content>
      </Layout>
    );
  }
}
export default Article;
