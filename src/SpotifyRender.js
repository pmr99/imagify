import { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import {PromptEngineering, PromptEngineeringExplanation} from "./PromptEngineering";
import { SuccessState, LoadingState, ErrorState } from "./OpenAiEndPoint";
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/logo.png'

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.REACT_APP_APIKEY, dangerouslyAllowBrowser: true });

function SpotifyRender() {
    const CLIENT_ID = '1fdbc817eca146c593ad41c217f4f1db'
    const REDIRECT_URI = "https://imagify-pmr99s-projects.vercel.app"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = 'user-read-private user-read-email user-top-read'

    const [token, setToken] = useState("")
    const [songs, setSongs] = useState([])
    const [displaySongs, setdisplaySongs] = useState(false)
    const [imgURL, setimgURL] = useState(null);
    const [imgDescription, setimgDescription] = useState("")
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const getSongs = async (e) => {
        const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        setSongs(data.items)
        fetchImage(PromptEngineering(data.items))
        fetchImageDescription(PromptEngineeringExplanation(data.items))
    }

    async function fetchImageDescription(inputData) {
        console.log(inputData)
        try {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: inputData }],
                model: "gpt-3.5-turbo-1106",
            });
            setimgDescription(completion.choices[0].message.content);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchImage(inputData) {
        console.log(inputData)
        try {
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: inputData,
                n: 1,
            });
            setimgURL(response.data[0].url);
            setLoading(false);
        } catch (error) {
            setError(error);
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            getSongs()
        }
    }, [token])


    const renderSongs = () => {
        return (
        <div> 
        <h5 style = {{margin: "16px"}}> Here are your Top Songs</h5>
        {songs.map(song => 
            <div style = {{display: "flex", justifyContent: "flex-start"}}>
                <div style = {{width: "30%"}}>
                    <img style = {{width: "100%", padding: "8px", borderRadius: "12px"}} src={song.album.images[0].url}></img>
                </div>
                <div style = {{margin: "8px", width: "70%"}}>
                    <p style = {{paddingBottom: "4px", margin: "0px", textAlign: "start"}}> <b>{song.name} </b></p> 
                    <p style = {{padding: "0px", margin: "0px", textAlign: "start"}}>{song.artists[0].name}</p>
                </div>
            </div>
        )}
        </div>
        )
    }

    const RenderImage = () => {
        if (error) {
            return (<ErrorState />)

        }
        if (loading) {
            return (<LoadingState />)
        }

        return (
            <SuccessState imgUrl={imgURL} imgDescription = {imgDescription}/>
        )

    }

    function LoginPage() {
        return (
            <div>
            <div className = "box"> 
            <h1 style = {{paddingTop: "16px", paddingBottom: "16px"}}> Imagify</h1>
            </div> 
            <div className= "box" style = {{height: "80%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "Column", padding: "5%"}}>
                <h1 style = {{paddingTop: "4px", paddingBottom: "12px"}}> <img className = "logoplacement" src  = {logo}></img></h1>
                <h3 style ={{paddingBottom: "8px"}}>Your Listening Pattern Visualized</h3>
                <p style = {{width: "40%", minWidth: "300px"}}> Using DALL·E 3 and Spotify's Developer tools, Imagify transforms your top listened songs into an illustration. Can you guess your favorite songs? </p>
                <Button>  <a style = {{color: "white"}} href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login
                    to Spotify Here</a>
                </Button>
            </div>
            </div>
        )
    }

    function FeaturePage() {
        return (
            <> 
            <div className = "box"> 
            <h1 style = {{paddingTop: "8px", paddingBottom: "16px"}}> <img src  = {logo} height = "100px"></img></h1>
            </div> 

            <div style={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", width: "100%"}}>
                <div className = "box image">
                    <RenderImage />
                </div>
                <div className = "box song">  
                <Button className = {displaySongs? "buttonviewclicked": "buttonviewunclicked"} variant="primary" size="lg" onClick={() => setdisplaySongs(!displaySongs)}>
                        Reveal Your Top Songs
                    </Button>  
                    {displaySongs ? renderSongs() : null}
                </div>
            </div>
            <Button onClick={logout}>Logout</Button>
            </>
        )

    }

    return (
        <div className = "App">
                
                {!token ?
                    <LoginPage />
                    :
                    <FeaturePage />
                }


        </div>
    );
}


export { SpotifyRender }