define(function () {

    var $ = {
        
        XHR : function() {
                return new XMLHttpRequest();
        },

        Get : function(url, callback) {
            var xhr = this.XHR();
            
            xhr.open("GET", url);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    var status = xhr.status;

                    if ((status >= 200 && status < 300) || status === 304) {
                        callback(xhr.responseText);
                    } else {
                        alert("An error occurred,");
                    }
                }
            };

            xhr.send(null);
        }
    }    
    return $;
});