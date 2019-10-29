var G_processHtmlWorker;

function fn_processHtmlWorker(_paramObj) {
    var changeContentEditable = false;
    if (_iframeDoc) {
        if (_iframeDoc.body.contentEditable == "true") {
            _iframeDoc.body.contentEditable = "false";
            changeContentEditable = true;
        }
    }

    G_processHtmlWorker = new Worker(_paramObj.editorConfig.htmlProcessWorkerJSUrl + "?ver=" + DEXTTOP.DEXT5.ReleaseVer);

    try {
        G_processHtmlWorker.onmessage = function (e) {
            var result = "";
            if (e.data.errorMessage) {
                result = _paramObj.callFnParam[0];
            } else {
                result = e.data.htmlResult;
            }

            releaseProcessHtmlWorker();

            if (changeContentEditable == true) {
                _iframeDoc.body.contentEditable = "true";
            }

            if (_paramObj && _paramObj.callBackFn) {
                if (_paramObj.callFn == "SetCorrectOfficeHtml") {
                    _paramObj.callBackFn(result, undefined, e.data.wordProcessorType);
                } else {
                    _paramObj.callBackFn(result);
                }
            }
        };

        G_processHtmlWorker.onerror = function (e) {

            releaseProcessHtmlWorker();

            if (changeContentEditable == true) {
                _iframeDoc.body.contentEditable = "true";
            }

            if (_paramObj && _paramObj.callBackFn) {
                _paramObj.callBackFn(_paramObj.callFnParam[0]);
            }
        };

        G_processHtmlWorker.postMessage({
            editorBrowser: _paramObj.editorBrowser,
            editorConfig: _paramObj.editorConfig,
            callFn: _paramObj.callFn,
            callFnParam: _paramObj.callFnParam
        });
    } catch (ex) {
        releaseProcessHtmlWorker();

        if (_paramObj && _paramObj.callBackFn) {
            _paramObj.callBackFn(_paramObj.callFnParam[0]);
        }
    }
}

function releaseProcessHtmlWorker() {
    if (typeof (G_processHtmlWorker) != "undefined") {
        try {
            G_processHtmlWorker.terminate();
        } catch (ex) { }
    }
}

function destoryWebWorkerVar() {
    if (typeof (G_processHtmlWorker) != "undefined") {
        try {
            G_processHtmlWorker = null;
            delete G_processHtmlWorker;
        } catch (e) { }
    }
}