var fetchWrapper = function (props) {
    var checkForErrors = (response) => {
        if (!response.ok) {
            return response.json().then((responseJson) => {
                throw Error(responseJson.Message)
            })
        }
        return response;
    };

    fetch(props.url, {
        headers: props.headers,
        method: props.method,
        body: props.body
    }, {mode:'no-cors'})
        .then(checkForErrors)
        .then(function (response) {
            response.json().then(props.onReceive);
        }).catch(props.onError);
};

export {fetchWrapper}