import React,{useEffect,useState} from "react";
import ReactDOM from "react-dom";
import * as MUI from "@mui/material";

import axios from "axios";
import create from "zustand";

const useStore = create((set,get)=>({
  submitState:false,
  formData:{},
  formElement: null,
  fetchFormData: async()=>{
    const response = await axios.get(process.env.REACT_APP_API);
    const formData = Object.fromEntries(response.data.data.map((item,key)=>[item.fieldName,item.value]))
    set({
      formElement:response.data.data,
      formData:formData
    })

  },
  setFormData: (e)=>{
    set((state)=>{
      let newState = state.formData;
      newState[e.target.name] = e.target.value
      return newState
    });
  },
  setSubmit: ()=>{
    set({
      submitState:true
    })
  },
  sendFormData: async ()=>{
    const data = get().formData
    const response = await axios.post(process.env.REACT_APP_API,data);
    set({
      formData: response.data.data,
      submitState:false
    })
  }
}))

const App = () => {
  const submitState = useStore((state) => state.submitState)
  const setSubmit = useStore((state)=>state.setSubmit)
  const fetchFormData = useStore((state) => state.fetchFormData)
  const formData = useStore((state) => state.formData)
  const formElement = useStore((state) => state.formElement)
  const setFormData = useStore((state)=>state.setFormData)
  const sendFormData = useStore((state)=>state.sendFormData)

  const fetchData = async () => {
    const data = await fetchFormData();
  }

  const submit = () => {
    setSubmit()
    sendFormData()
  }
  useEffect(()=>{
    fetchData()
  },[])
  
  return(
    <MUI.Container>
      <MUI.AppBar position="static">
          <MUI.Toolbar variant="dense">
            <MUI.Typography variant="h6" color="inherit" component="div">
              React Exam - Dynamic Form
            </MUI.Typography>
          </MUI.Toolbar>
      </MUI.AppBar>
      {
        submitState && <MUI.LinearProgress/>
      }
      <MUI.Box
      noValidate
      sx={{ width: '100%' }}>
      <br/>
      <form onSubmit={e => {e.preventDefault(); return false;}}>
        {
          formElement != null && formElement.map((i,k)=>
            <div key={k}>
                <MUI.TextField
                  fullWidth
                  disabled={submitState}
                  required={i.fieldName=="firstName" || i.fieldName=="lastName" || i.fieldName == "emailAddress"}
                  variant="outlined"
                  name={i.fieldName}
                  label={i.fieldName}
                  defaultValue={i.value}
                  multiline={i.type=="multiline"}
                  select={i.type=="select"}
                  type={i.type}
                  onChange={setFormData}
                >
              { i.type == "select" && i.options.map((items,key)=> <MUI.MenuItem value={items} key={key}>{items}</MUI.MenuItem>)}
              </MUI.TextField>
              <br/>
              <br/>
            </div>
          )
        }
        {
          formElement != null && <MUI.Button type="submit" variant="contained" disabled={submitState} onClick={submit}>Submit</MUI.Button>
        }
      </form>
      </MUI.Box>
    </MUI.Container>
    )
}

export default App;