var module = (function() {
    return {
        fetch_data: function(project, sheet_key, worksheet_id) {
            const self = this;

            return new Promise(function(resolve, reject) {
                var url = self.get_feed_url(project, sheet_key, worksheet_id);
        
                fetch(url)
                    .then(function(response) {
                        if(response.ok) {
                            return response.json();
                        } else {
                            return Promise.reject({ "status": response.status });
                        }
                    })
                    .then(function(feed) {
                        resolve(self.feed_to_data(feed));
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        feed_to_data: function(feed) {
            var rows = feed["fields"]["rows"]["arrayValue"]["values"];
            var data = []
        
            rows.forEach(function(row) {
                datum = {}, fields = row["mapValue"]["fields"]
                for (var key in fields) {
                    datum[key] = fields[key]["stringValue"];
                }
                data.push(datum);
            })
        
            return data;
        },
     
        get_feed_url: function(project, sheet_key, worksheet_id) {
            var url = "https://firestore.googleapis.com/v1/projects/" 
            
            url += project;
            url += '/databases/(default)/documents/sheets/';
            url += sheet_key;
            url += "/worksheets/";
            url += worksheet_id;
            
            return url;
        },        
    }
})();

__MODULE__ = module;
