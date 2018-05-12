/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import "./css/bootstrap.min.css";
import $ from 'jquery';
import {Carousel} from 'react-bootstrap';
import {FormControl} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import './css/index.css';
import Spinner from 'react-spinkit';

export default class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      carouselMedia: [],
      carouselVisible: false,
      searchWrapperClass: "searchWrapper searchWrapperInitial vertical-center-row",
      searchValue: "",
      noDataVisible: false,
      noUserVisible: false,
      isBusyVisible: false,
      isPrivate: false
    }
  }

  componentDidMount() { 
    document.title = "Inst Anon";
  }

  handleChange(event) {
    this.setState({searchValue: event.target.value});
  }

  handleSearch() {
    this.setState({
      searchWrapperClass: this.state.searchWrapperClass.replace("Initial", "Searched"),
      carouselMedia: [],
      carouselVisible: true,
      noDataVisible: false,
      isBusyVisible: true,
      isPrivate: false
    });

    //refresh stories
    var storiesArray = getStoriesArrayForUser(this);

  }

  render() {
    var busyIndicatorClass = "busyIndicator col-md-1 col-md-offset-5 " + (this.state.isBusyVisible ? 'active' : 'inactive');
    return (
      <div>
        <div id="Search" className="container text-center appWrapper">

          <a className="tgCont" href="t.me/inst_anon_bot" >
            <div className="tgInfo">
              <div className="tgLabel">Наш телеграм бот</div>    
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1200px-Telegram_logo.svg.png" width="40" height="40"/>
            </div>
          </a>  

          <div className="row text-center">
            <SearchControl onSearch={() => this.handleSearch()} classSearch={this.state.searchWrapperClass} onChange={this.handleChange.bind(this)} searchValue={this.state.searchValue}/>
          </div>
          <div className="row text-center">
            <div className="col-md-6 col-md-offset-3 mediaCarousel">
              <div className={busyIndicatorClass}>
                <Spinner name="ball-spin-fade-loader" />
              </div>
              <MediaCarousel media={this.state.carouselMedia} isVisible={this.state.carouselVisible} isNoDataVisible={this.state.noDataVisible}
                             isNoUserVisible={this.state.noUserVisible} isPrivate={this.state.isPrivate}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class SearchControl extends React.Component {
  constructor() {
    super();
  }

  onChange(event) {
    this.props.onChange(event);
  }

  render() {
    var searchValue = this.props.searchValue;
    return (
      <div className={this.props.classSearch}>
        <div className="col-md-4 col-md-offset-4">
          <FormControl className="searchInput" value={searchValue} onChange={this.onChange.bind(this)} onEnter={() => this.props.onSearch()}/>
          <Button bsStyle="success" className="searchBtn" onClick={() => this.props.onSearch()}>
              Поиск
          </Button>
        </div>
      </div>
    );
  }
}

class MediaCarousel extends React.Component {
  render() {

    if (this.props.media.length > 0){
      var className = 'mediaCarousel ' + ((this.props.isVisible && this.props.media.length > 0) ? 'active' : 'inactive');
      return (
        <div className={className}>
          <Carousel interval={null}>
            {
              this.props.media.map(function(item) {

                var mediaContainer;
                if (item.type === 'image') {
                  mediaContainer = <img className="imageCarousel" src={item.url[0].url}/>;
                } else {
                  mediaContainer = <video className="videoCarousel" controls><source src={item.url} type="video/mp4"/></video>;
                }
                  return <Carousel.Item className="carouselItem">
                    {mediaContainer}
                    <Carousel.Caption>
                      <h3></h3>
                      <p></p>
                  </Carousel.Caption>
                </Carousel.Item>
              })
            }
          </Carousel>
        </div>);
    } else {
      var className = this.props.isNoDataVisible || this.props.isNoUserVisible || this.props.isPrivate ? 'active' : 'inactive';
      var text;
      if (this.props.isNoDataVisible){
          text = "У Пользователя нет активных историй(";
      } else if (this.props.isNoUserVisible) {
          text = "Такого пользователя не существует";
      } else if (this.props.isPrivate) {
          text = "Данный пользователь скрыл свой аккаунт. В настоящий момент возможность просмотра приватных аккаунтов находится в разработке...";
      };
      return (
        <div className={className}>
          {text}
        </div>);
    }
  }
}

ReactDOM.render(
 <Search/ >, document.getElementById('root'));

   /* ------additional functions----- */




   function getStoriesArrayForUser (oControl)
   { 
     //var sUrl = "https://inst-anon.herokuapp.com/userStories?userName=" + oControl.state.searchValue.toLowerCase();
     //var sUrl = "https://inst-anon3-mikhail36.c9users.io/userStories?userName=" + oControl.state.searchValue;
     var sUrl = "https://inst-anon3-mikhail36.c9users.io/userStories?userName=" + oControl.state.searchValue.toLowerCase();


     $.ajax({
      url: sUrl,
      dataType: 'json',
      crossDoamin: true,
      cache: false,
      success: function(data, status, xhr) {

        oControl.setState({carouselMedia: data});
        if (data.length === 0){
          if (xhr.status === 202){ // is private
            oControl.setState({noDataVisible: false});
            oControl.setState({isPrivate: true});
          } else {
            oControl.setState({noDataVisible: true});
            oControl.setState({isPrivate: false});
          }
        } else {
          oControl.setState({noDataVisible: false});
        }
        oControl.setState({noUserVisible: false});
        oControl.setState({isBusyVisible: false});
      }.bind(this),
      error: function(xhr, status, err) {
        oControl.setState({noUserVisible: true});
        oControl.setState({isBusyVisible: false});
      }.bind(this)
    });
}
