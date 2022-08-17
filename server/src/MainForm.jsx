import React,{Component} from 'react';
import io from 'socket.io-client';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import {GridToolbar} from '@mui/x-data-grid-pro';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';



// import React, { useState, useEffect } from 'react';

const socket = io("localhost:3000");

class MainForm extends Component {
    constructor(props){
        super(props);
        this.state= {
            search:'',
            isConnected:socket.connected,
            lastPong:'',
            isAntDesign:true,
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

    keyPress=(e)=>{
      if(e.keyCode === 13){
        //  console.log('value', e.target.value);
         this.doit()
         // put the login here
      }
   }
    
    render() {

      

      const StyledBox = styled(Box)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        height: 600,
        width: '100%',
        '& .MuiFormGroup-options': {
          alignItems: 'center',
          paddingBottom: theme.spacing(1),
          '& > div': {
            minWidth: 100,
            margin: theme.spacing(2),
            marginLeft: 0,
          },
        },
      }));


        

        var table = []
        const columns = [
            {field:'title', headerName:'Title',renderCell: (params)=>{ return <a target='_blank'  rel='noreferrer' href={params.row.url}>{params.row.title}</a>},flex:150,resizable:true},
            {field:'price', headerName:'Price',flex:50,resizable:true},
            {field: 'unit', headerName:'Unit',flex:70,resizable:true},
            {field:'discount', headerName:'Discount',flex:50,resizable:true},
            {field:'rating', headerName:'Rating',flex:50,resizable:true},
            {field:'reviews', headerName:'Reviews',flex:50,resizable:true},
            {field:'score', headerName:'Score',flex:50,resizable:true},
            {field:'ad', headerName:'Ad',flex:25,resizable:true},
            {field:'prime', headerName:'Prime',flex:25,resizable:true},
          ];
        if(Object.keys(this.state.results).length>0){
            // console.log(this.state.results['result'])
            // table = <DataGrid columns={columns} rows={this.state.results['result']}/>
            table = this.state.results['result'].map(function(item,i){
                return {
                'id':i,
                'title':item.title,
                'price':item.price.current_price,
                'unit': item.price.base,
                'discount':item.price.discounted ? 'Yes' : '',
                'rating':Number(item.reviews.rating),
                'reviews':Number(item.reviews.total_reviews),
                'prime':item.amazonPrime ? 'Yes' : '',
                'url':item.url,
                'ad':item.sponsered ? 'Yes' : '',
                'score':Number(item.score)
                 }
            })
            // console.log('table',table)
            // console.log('columns',columns)
        }
        return (
            <div className='inputparams' style={{ height:1000, width: '100%' }}>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '90%',textAlign:'center' },
                }}
                noValidate
                autoComplete="off"
              >
              <TextField
                id="outlined-name"
                label="Product search"
                value={this.state.search}
                onChange={this.handleChange}
                onKeyDown={this.keyPress}
                fullWidth={true}
              />

              <div style={{ display: 'flex',height:900 }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      rows={table} 
                      columns={columns}
                      components={{
                        Toolbar: GridToolbar,
                      }}
                      componentsProps={{
                        toolbar: { showQuickFilter: true },
                      }}
                      rowThreshold={0}
                    />
                  </div>
              </div>
          </Box>
        </div>
        );
   
    }
}

export default MainForm;