import React from 'react';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';import VideoDetail from './components/VideoDetails';
import YTSearch from 'youtube-api-search';
import dotenv from 'dotenv'
import { Icon,notification } from 'antd';
import 'antd/dist/antd.css';

dotenv.config();
const API_KEY = process.env.REACT_APP_API_KEY;
// const API_KEY = 'AIzaSyA-mlfmeVjROWsc4AwYrB0LAqkut5Q0vgo';


class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			videos: [],
			search: true,
			selectedVideo: {}
		};

		this.welcome();
	}

	welcome = ()=>{
		notification.open({
			message: 'Hey nice to see you here',
			description: 'Let us start by searching for some videos',
      icon: <Icon type="smile" style={{ color: '#108ee9' }} />
		})
	};

	videoSearch(term){
		if(this.state.search){
				YTSearch({key:API_KEY,term}, (data) =>{
					try{
						if(data && data.data && data.data.eror.message){
							console.log(data);
							throw ('error');
						}
						this.setState((prevState) => {
							let newState = {};
							newState.videos = data;
							newState.selectedVideo = data[0];
							return newState;
						});
					}
					catch(err){
						notification['error']({
							message:'daily limit exceeded',
							description:'Youtube data API daily limit have exceeded. Quota will be recharged at 1:30pm IST. Wait till then.'
						});
					}
				});
		}
	}

	handleChange = (value)=>{
		console.log(value);
		setTimeout(()=>{
			if(value === ''){
				this.setState((prevState)=>{
					let newState = {};
					newState.videos = [];
					newState.selectedVideo = null;
				});
				return;
			}
			if(this.state.search)
				this.videoSearch(value);
			setTimeout( ()=> {
				this.setState({search: true});
			},5000);
		},2000);
	}

	render() {
    return (
      <div style={{ "display": "flex", "flexDirection": "column"  }}>
        <div style={{ "display": "flex", "justifyContent": "space-between", "background": "#123456"}}>
            <h1 style={{ "color": "#fff", "alignSelf": "center", "flexBasis": "4", "paddingTop": "20px", "paddingLeft": "30px" }}>YTSearch <Icon type={"search"}/></h1>

						<SearchBar 
							videos={ this.state.videos } 
							video={ this.state.selectedVideo } 
							onChange={ this.handleChange } 
							handleSearch={ (video) => { this.setState({ selectedVideo:this.state.videos[video], search:false })}}
						/>

        </div>
        <div style={{ "display" : "flex" }}>
          <VideoDetail video={ this.state.selectedVideo }/>
          <VideoList
              videos={ this.state.videos }
              onVideoSelect={ ( userSelected ) => { this.setState({ selectedVideo: this.state.videos[ userSelected ] }) }}
          />
        </div>
      </div>
    );
	}
};

export default App;