import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { render } from "react-dom";
import PropTypes from 'prop-types';

;(function(w, d, s, g, js, fjs) {
  g = w.gapi || (w.gapi = {})
  g.analytics = {
    q: [],
    ready: function(cb) {
      this.q.push(cb)
    }
  }
  js = d.createElement(s)
  fjs = d.getElementsByTagName(s)[0]
  js.src = "https://apis.google.com/js/platform.js"
  fjs.parentNode.insertBefore(js, fjs)
  js.onload = function() {
    g.load("analytics")
  }
})(window, document, "script")

// dont wait for auth twice, even after unmounts
let isLoaded = false;

// wait for auth to display children
export class GoogleProvider extends React.Component {
  state = {
    ready: false
  };
  componentDidMount() {
    this.init();
  }
  init = () => {
    const doAuth = () => {
      const authObj = this.props.accessToken ?
        {serverAuth: {access_token: this.props.accessToken}} :
        {clientid: this.props.clientId};
      window.gapi.analytics.auth &&
        window.gapi.analytics.auth.authorize({
          ...authObj,
          container: this.authButtonNode
        });
    };
    window.gapi.analytics.ready(a => {
      if (isLoaded) {
        this.setState({
          ready: true
        });
        return;
      }
      const authResponse = window.gapi.analytics.auth.getAuthResponse();
      if (!authResponse) {
        window.gapi.analytics.auth.on("success", response => {
          this.setState({
            ready: true
          });
        });
      } else {
        this.setState({
          ready: true
        });
      }
      doAuth();
    });
  };
  render() {
    console.log(this.props.children);
    return (
      <div>
        {this.props.clientId && <div ref={node => (this.authButtonNode = node)} />}
        {this.state.ready && this.props.children}
      </div>
    );
  }
}
GoogleProvider.propTypes = {
  clientId: PropTypes.string,
  accessToken: PropTypes.string,
}

// single chart
export class GoogleDataChart extends React.Component {
  componentDidMount() {
    this.loadChart();

  }
  componentWillUpdate() {
    this.loadChart();
  }
  componentWillUnmount() {
    // TODO: cleanup
  }
  loadChart = () => {
    const config = {
      ...this.props.config,
      chart: {
        ...this.props.config.chart,
        container: this.chartNode
      }
    };
    this.chart = new window.gapi.analytics.googleCharts.DataChart(config);
    this.chart.set(this.props.views).execute();
  };
  render() {
    console.log(this.props.config);
    return (
      <div
        className={this.props.className}
        style={this.props.style}
        ref={node => (this.chartNode = node)}
      />
    );
  }
}


const CLIENT_ID = 

// graph 1 config
const last30days = {
  reportType: "ga",
  query: {
    dimensions: "ga:date",
    metrics: "ga:pageviews",
    "start-date": "30daysAgo",
    "end-date": "yesterday"
  },
  chart: {
    type: "LINE",
    options: {
      // options for google charts
      // https://google-developers.appspot.com/chart/interactive/docs/gallery
      title: "Last 30 days pageviews"
    }
  }
}



// graph 2 config
const last7days = {
  reportType: "ga",
  query: {
    dimensions: "ga:date",
    metrics: "ga:pageviews",
    "start-date": "7daysAgo",
    "end-date": "yesterday"
  },
  chart: {
    type: "LINE"
  }
}

const test = {
  reportType: "ga",
  query: {
    dimensions: "ga:date",
    metrics: "ga:sessions",
    "start-date": "7daysAgo",
    "end-date": "yesterday"
  },
  chart: {
    type: "LINE"
  }
}

// analytics views ID
const views = {
  query: {
    ids:
  }
}

export class Example extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      test: test
    }
  }

  changeConfig(){
    this.setState({
      test: last30days
    })
    this.forceUpdate()
    console.log(this.forceUpdate);
  }
  render () {
    console.log(this.state);
    console.log(<GoogleProvider clientId={CLIENT_ID}/>);
    return(
      <GoogleProvider clientId={CLIENT_ID}>
        <GoogleDataChart views={views} config={last30days} />
        <div onClick={()=>this.changeConfig()}>
          <GoogleDataChart  views={views} config={this.state.test} />
        </div>

      </GoogleProvider>
    )
  }
}





ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
