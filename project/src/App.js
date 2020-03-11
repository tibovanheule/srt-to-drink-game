import React from 'react';
import parser from 'subtitles-parser';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.srt = this.srt.bind(this);
    }


    srt(event) {
        if (event.target.files[0]!== undefined) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = (e.target.result);
                let result = parser.fromSrt(text, false);
                let count = {};
                result.forEach((e) => {
                    let sentence = e.text.replace("'s", '').replace(/[!.?\-\*\$"']+/gi, '').replace('<i>', '').replace('</i>', '').toLowerCase().split(/[\s,\n]+/);
                    sentence.forEach((e) => {
                        if (count.hasOwnProperty(e)) count[e] += 1;
                        else count[e] = 1;
                    })
                });
                // Create items array
                let countarray = Object.keys(count).map((key) => [key, count[key]]);
                // Sort the array based on the second element
                countarray.sort((first, second) => second[1] - first[1]);
                this.setState({count: countarray});
            };
            reader.readAsText(event.target.files[0]);
        }
    }

    state = {count: undefined};

    render() {
        return (
            <div className={"centerdiv"}>
                <h1>Upload your srt file</h1>
                <input type={"file"} onChange={this.srt}/>
                {this.state.count !== undefined && <div id={"result"}>
                    {this.state.count.map((key) =>
                        <p>{key[0] + ": " + key[1]}</p>
                    )}
                </div>}
            </div>
        );
    }


}
