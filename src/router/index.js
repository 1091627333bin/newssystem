import Login from "../views/Login"
import NewsSandBox from "../views/NewsSandBox"
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import News from "../views/news/News"
import Detail from "../views/news/Detail"

export default function Router() {
    return (
        <Switch>
            <Route path='/login' component={Login}></Route>
            <Route path='/news' component={News}></Route>
            <Route path='/detail/:id' component={Detail}></Route>
            <Route path='/' render={()=>
            localStorage.getItem('token')?
                <NewsSandBox></NewsSandBox>:<Redirect to="/login"></Redirect>
            }></Route>
        </Switch>
    )
}
