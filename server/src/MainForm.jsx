import React,{Component} from 'react';
import io from 'socket.io-client';
import DataGrid from 'react-data-grid';
// import React, { useState, useEffect } from 'react';

const socket = io("localhost:3002");

class MainForm extends Component {
    constructor(props){
        super(props);
        this.state= {
            search:'',
            isConnected:socket.connected,
            lastPong:'',
            results:{},
            rows:'ASC'
        }
    }

    componentDidMount(){
        socket.on('connect', () => {
            this.setState({isConnected:true})
            // setIsConnected(true);
          });
      
          socket.on('disconnect', () => {
            this.setState({isConnected:false})
            // setIsConnected(false);
          });
      
        //   socket.on('pong', () => {
        //     this.setState({lastPong:new Date().toISOString()})
        //     // setLastPong(new Date().toISOString());
        //   });

          socket.on('results', (data) => {
            // console.log('results',data)
            this.setState({results:data})
            // setLastPong(new Date().toISOString());
          });
        }

    componentWilUnmount(){
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
    };
    

    handleChange=(event)=>{
        this.setState({search:event.target.value})
    }

    doit=()=>{
        console.log('pong')
        socket.emit('pong',this.state.search)


    }
    
    render() {


        const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
            const comparer = (a, b) => {
              if (sortDirection === "ASC") {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
              } else if (sortDirection === "DESC") {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
              }
            };
            return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer);
          };
        
        

        var table = []
        const columns = [
            {key:'title', sortable:true, resizable: true, name:'Title'},
            {key:'price', sortable:true, resizable: true, name:'Price'},
            {key: 'unit', sortable:true, resizable: true, name:'Unit'},
            {key:'discount', sortable:true, resizable: true, name:'Discount'},
            {key:'rating', sortable:true, resizable: true, name:'Rating'},
            {key:'reviews', sortable:true, resizable: true, name:'Reviews'},
            {key:'prime', sortable:true, resizable: true, name:'Prime'},
          ];
        if(Object.keys(this.state.results).length>0){
            console.log(this.state.results['result'])
            // table = <DataGrid columns={columns} rows={this.state.results['result']}/>
            table = this.state.results['result'].map(function(item,i){
                return {'title':<a href={item.url} target='_blank'>{item.title}</a>,
                'price':item.price.current_price,
                'unit': item.price.base,
                'discount':item.price.discounted ? 'Yes' : '',
                'rating':item.reviews.rating,
                'reviews':item.reviews.total_reviews,
                'prime':item.amazonPrime ? 'Yes' : '',
                 }
            })
            console.log('table',table)
        }
        return (
            <div className='inputparams'>

           <input
               type="text"
               value={this.state.search}
               onChange={this.handleChange}
            />
            <button onClick={this.doit}>Search</button>
            <DataGrid  rows={table} 
                  columns={columns}
                  onGridSort={(sortColumn, sortDirection) =>
                        this.setState({rows:sortRows(100, sortColumn, sortDirection)})}
                    minHeight={1000}
            />

            </div>
        );
   
    }
}

export default MainForm;