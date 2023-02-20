import 'antd/dist/antd.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import locale from 'antd/es/locale/ru_RU'
import { ConfigProvider } from 'antd'
import { ApolloProvider } from '@apollo/client'
import withLayout from './components/Layout'
import GlobalStyles from './components/GlobalStyles'
import apolloClient from './utils/apollo'
import Main from './containers/main'
import Login from './containers/login'
import Password from './containers/password'
import Freetime from './containers/admins'
import CreateFreetime from './containers/admins/create'
import UpdateFreetime from './containers/admins/update'
import Routes from './containers/routes'
import CreateOneRoute from './containers/routes/create'
import UpdateRoute from './containers/routes/update'
import Charts from './containers/charts'
import Tickets from './containers/routes/tickets'
import PassengerList from './containers/routes/passengerList'
import HistoryRoutes from './containers/history'
import HistoryList from './containers/history/passengerHistoryList'
import HistoryTickets from './containers/history/tickets'
import Roles from './containers/roles'
import CreateRole from './containers/roles/create'
import UpdateRole from './containers/roles/update'

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ConfigProvider locale={locale}>
        <Router>
          <Switch>
            <Route path='/' exact component={(props) => withLayout(props, Main)} />

            <Route path='/routes' exact component={(props) => withLayout(props, Routes)} />
            <Route path='/routes/create' exact component={(props) => withLayout(props, CreateOneRoute)} />
            <Route path='/routes/update/:id' exact component={(props) => withLayout(props, UpdateRoute)} />
            <Route path='/routes/tickets/:id' exact component={(props) => withLayout(props, Tickets)} />
            <Route path='/routes/passengerList/:id' exact component={(props) => withLayout(props, PassengerList)} />
            <Route path='/routes/charts/:id' exact component={(props) => withLayout(props, Charts)} />

            <Route path='/history' exact component={(props) => withLayout(props, HistoryRoutes)} />
            <Route path='/history/historyList/:id' exact component={(props) => withLayout(props, HistoryList)} />
            <Route path='/history/historyTickets/:id' exact component={(props) => withLayout(props, HistoryTickets)} />

            <Route path='/admins' exact component={(props) => withLayout(props, Freetime)} />
            <Route path='/admins/create' exact component={(props) => withLayout(props, CreateFreetime)} />
            <Route path='/admins/update/:id' exact component={(props) => withLayout(props, UpdateFreetime)} />

            <Route path='/admins/roles' exact component={(props) => withLayout(props, Roles)} />
            <Route path='/admins/roles/create' exact component={(props) => withLayout(props, CreateRole)} />
            <Route path='/admins/roles/update/:id' exact component={(props) => withLayout(props, UpdateRole)} />

            <Route path='/password/update' exact component={(props) => withLayout(props, Password)} />
            <Route path='/login' exact component={Login} />
          </Switch>
        </Router>
        <GlobalStyles />
      </ConfigProvider>
    </ApolloProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
