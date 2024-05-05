
function PromptEngineering(input) {
    var words = ""
    
    input.map((song)=> words = words.concat(song.name, ", "))
    return "Generate an image decribing these key words such that the user can guess the words from the image. Single coherent image, not combining different images. Image should not contain any words: ".concat(words)

}

function PromptEngineeringExplanation(input) {
    var words = ""

    input.map((song)=> words = words.concat(song.name, ", "))
    return "Dalle-3 generated an image decribing these key words such that the user can guess the words from image: ".concat(words).concat(" Write an explanation for how the keywords are illustrated in that image, succintly in one paragraph.")
}

export {PromptEngineering, PromptEngineeringExplanation}