define(['logger', 'forms', 'forms/box-pane'], function (Logger, Forms, BoxPane, ModuleName) {

    function wsUrl() {
        var location = window.location;
        return (location.protocol === 'https:' ? 'wss:' : 'ws:')
                + '//'
                + location.host
                + location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
    }

    function mc() {
        var self = this
                , form = Forms.loadForm(ModuleName);

        var wsProxy;

        form.onWindowOpened = function () {
            /**
             * Note that Web Socket endpoint's module should have a solid name.
             * (e.g. 3 argument define should be used or such module should be placed in the root folder - 'app')
             * @see 'ChatEndpoint' module itself.
             */
            wsProxy = new WebSocket(wsUrl() + 'ChatEndpoint');
            
            wsProxy.onopen = function () {
                Logger.info('Subscribed');
            };

            wsProxy.onerror = function (evt) {
                Logger.info('Web scket error occured');
            };

            wsProxy.onmessage = function (evt) {
                Logger.info('Message - ' + evt.data);
                var msgBox = new BoxPane();
                msgBox.element.innerHTML = evt.data;
                form.panel.add(msgBox);
            };

            wsProxy.onclose = function () {
                Logger.info('Unsubscribed');
            };
        };

        form.onWindowClosed = function (evt) {
            wsProxy.close();
        };

        self.show = function () {
            form.show();
            form.txtMessage.focus();
        };

        form.btnSend.onActionPerformed = function (event) {
            wsProxy.send(form.txtMessage.value);
            form.txtMessage.value = '';
        };
    }
    return mc;
});
