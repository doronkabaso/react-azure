import React from 'react';
import ReactDOM from 'react-dom';
import storeFactory from './store'
import {Provider} from 'react-redux';

//components:
import MediaPlayer from './components/Player/MediaPlayer.js';
import SlateEditorFrame from './components/TextEditor/SlateEditorFrame.js'
import PrimaryToolbar from './components/Toolbars/PrimaryToolbar.jsx'
import SecondaryToolbar from './components/Toolbars/SecondaryToolbar.jsx'
import SubtitlesDisplayLabel from './components/Player/SubtitlesDisplayLabel.js'
import {UIDirection, Directions} from './Root/config'
import 'semantic-ui-css/semantic.css'
import {fetchWrapper} from './js/ServerCommunication'

//state:
import initialState from './Root/initialState';

//Utils
const store = storeFactory(initialState)

let directionClass = UIDirection == Directions.RTL ? ' rtl ' : ' ltr ';
let audioPosition = 0;

let getPosition = () => {
    return audioPosition;
};

let updatePosition = (newPosition) => {
    audioPosition = newPosition;
};

const App = () => (
    <Provider store={store}>
        <div className={"fit-height root-div" + directionClass}>
            <section className="fit-height-row">
                <div className="fit-height-row-content">
                    <PrimaryToolbar/>
                </div>
            </section>

            <section className="fit-height-row-expanded">
                <SlateEditorFrame id="slateEditorFrame"
                    positionGetter={getPosition}/>

            </section>

            <section className="fit-height-row alwaysLtr">
                <div className="fit-height-row-content">
                    <SubtitlesDisplayLabel/>
                    <MediaPlayer
                        onPositionUpdate={updatePosition}/>
                </div>
            </section>
        </div>
    </Provider>
);

ReactDOM.render(<App/>, document.getElementById('app'));
