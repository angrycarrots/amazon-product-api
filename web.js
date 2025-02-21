const AmazonScraper = require('./lib/Amazon');
const { geo, defaultItemLimit } = require('./lib/constant');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const INIT_OPTIONS = {
    bulk: true,
    number: defaultItemLimit,
    filetype: '',
    rating: [1, 5],
    page: 1,
    category: '',
    cookie: '',
    asyncTasks: 5,
    sponsored: false,
    category: 'aps',
    cli: false,
    sort: false,
    discount: false,
    reviewFilter: {
        // Sort by recent/top reviews
        sortBy: 'recent',
        // Show only reviews with verified purchase
        verifiedPurchaseOnly: false,
        // Show only reviews with specific rating or positive/critical
        filterByStar: '',
        formatType: 'all_formats',
    },
};



app.use(express.static(__dirname + '/build'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
    
    });

function productsearch(keyword){
      var options = { ...INIT_OPTIONS };
      options.geo = geo[options.country] ? geo[options.country] : geo['US'];
      options.scrapeType = 'products';
      options.keyword = keyword
      const results = new AmazonScraper(options).startScraper();
      results.then( function(result){
        // console.log(result)
        io.emit('results',result)
      })
      return results
}

io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
        socket.on('pong', (msg) => {
            console.log('search keyword: ' + msg);
            // io.emit('results', productsearch(msg));
            productsearch(msg)
          });

        
      });


var port = 3030;
server.listen(port, () => {
    console.log('listening on *:',port);
    });