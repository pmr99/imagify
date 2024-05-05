import Spinner from 'react-bootstrap/Spinner';
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';

const titleText = "Here's your recent listening habits visualized!"
const actionText = "Can you guess your top 5 songs?"

function SuccessState({ imgUrl, imgDescription }) {
    const [displayDescription, setdisplayDescription] = useState(false)
    return (
    <div>
        <h4 style = {{textAlign: "center", margin: "16px"}}> {titleText} </h4>
        <h5 style = {{textAlign: "center", margin: "16px"}}> {actionText} </h5>
        <img style = {{maxWidth: "98%"}} src={imgUrl}></img>
        {displayDescription? 
        <div style = {{margin: "4%"}}>
        <p> {imgDescription}</p>
        <Button onClick={() => setdisplayDescription(false)}>Hide Description</Button>
        </div>:
        <Button style = {{margin: "2%"}} onClick={() => setdisplayDescription(true)}>Reveal Image Description</Button>

    
    }
        
    </div>
    )
}

function LoadingState() {
    return (
        <div className="text-center" style={{ marginTop: "24%", marginBottom: "24%", marginLeft: "20%", marginRight: "20%" }}>
            <Spinner animation="border" style={{ margin: "auto" }} />
            <h2 style={{ textAlign: "center" }}> Image Generating... </h2>
        </div>
    )
}

function ErrorState() {
    return (
        <div style={{ marginTop: "24%", marginBottom: "24%", marginLeft: "20%", marginRight: "20%" }}>
            <h1 style={{ textAlign: "center" }}> Oopsie, try loading again </h1>
            <p style={{ textAlign: "center" }}> If your top 5 songs contains a name of a real person (eg: "(feat. Post Malone)"), OpenAI will deny the Image Generation Request :(</p>
        </div>
    )
}

export  {ErrorState, LoadingState, SuccessState}