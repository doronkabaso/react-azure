export function InitMediaPlayerShortcuts(props){
    window.onkeydown = function (e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (e.ctrlKey) {
            //Ctrl events are for Text editor shortcuts
            return;
        }

        // Play or pause - 0
        if (key == 96) {
            event.preventDefault();
            props.onPlayPause();
        }

        //Slow down Audio Rate - 1
        if (key === 97 ) {
            event.preventDefault();
            props.onRateChange(-props.rateSteps);
        }

        // Original audio rate - 2
        if (key === 98 ) {
            event.preventDefault();
            props.onRateChange(0)
        }

        //Speed up Audio Rate - 3
        if (key === 99 ) {
            event.preventDefault();
            props.onRateChange(props.rateSteps);
        }

        //Rewind 3 seconds - 4
        if (key === 100) {
            event.preventDefault();
            props.onPositionChange(-3)
        }

        //Rewind 0.75 seconds - 5
        if (key === 101) {
            event.preventDefault();
            props.onPositionChange(-0.75)
        }

        //Fast forward 3 seconds - 6
        if (key === 102) {
            event.preventDefault();
            props.onPositionChange(3)
        }

        //Rewind 10 seconds - 7
        if (key === 103) {
            event.preventDefault();
            props.onPositionChange(-10)
        }

        //Fast forward 10 seconds - 9
        if (key === 105) {
            event.preventDefault();
            props.onPositionChange(10)
        }

        // Page down - volume down
        if (key === 34) {
            event.preventDefault();
            props.onVolumeChange(-0.05)
        }

        // Page up - volume up
        if (key === 33) {
            event.preventDefault();
            props.onVolumeChange(0.05)
        }
    }
}