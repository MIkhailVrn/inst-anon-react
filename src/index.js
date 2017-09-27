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
      isBusyVisible: false
    }
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
      isBusyVisible: true
    });

    //refresh stories
    var storiesArray = getStoriesArrayForUser(this);

  }

  render() {
    var busyIndicatorClass = "busyIndicator col-md-1 col-md-offset-5 " + (this.state.isBusyVisible ? 'active' : 'inactive');
    return (
      <div>
        <div id="Search" className="container text-center appWrapper">
          <div className="row text-center">
            <SearchControl onSearch={() => this.handleSearch()} classSearch={this.state.searchWrapperClass} onChange={this.handleChange.bind(this)} searchValue={this.state.searchValue}/>
          </div>
          <div className="row text-center">
            <div className="col-md-6 col-md-offset-3 mediaCarousel">
              <div className={busyIndicatorClass}>
                <Spinner name="ball-spin-fade-loader" />
              </div>
              <MediaCarousel media={this.state.carouselMedia} isVisible={this.state.carouselVisible} isNoDataVisible={this.state.noDataVisible}
                             isNoUserVisible={this.state.noUserVisible}/>
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
          <FormControl className="searchInput" value={searchValue} onChange={this.onChange.bind(this)}/>
          <Button bsStyle="success" className="searchBtn" onClick={() => this.props.onSearch()}>
            Search
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
      var className = this.props.isNoDataVisible || this.props.isNoUserVisible ? 'active' : 'inactive';
      var text;
      if (this.props.isNoDataVisible){
          text = "User doesn't have active stories";
      } else if (this.props.isNoUserVisible) {
          text = "User doesn't exist";
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
     var sUrl = "http://inst-anon.herokuapp.com/userStories?userName=" + oControl.state.searchValue;

     $.ajax({
      url: sUrl,
      dataType: 'json',
      crossDoamin: true,
      cache: false,
      success: function(data) {

        oControl.setState({carouselMedia: data});
        if (data.length === 0){
          oControl.setState({noDataVisible: true});
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
