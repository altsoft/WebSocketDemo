/**
 * @resident
 */
define(function () {
    
    var sessions = {};
    
    function mc() {
        
        this.add = function (aSessionId, aOnMessage) {
            sessions[aSessionId] = aOnMessage;
        };
        this.remove = function (aSessionId) {
            delete sessions[aSessionId];
        };
        this.broadcast = function (aData) {
            for (var s in sessions) {
                sessions[s](aData);// Always async call because of LPC mechanism.
            }
        };
    }
    return mc;
});