// import React, { useState } from 'react'
// import { Layout, Menu, theme } from "antd"
// import { Navigate, NavLink, Route, Routes } from "react-router-dom"
// import LandingPage from './LandingPage';
// import Profile from './Profile';

// export default function LayoutComponent({ AuthContext }) {

//     function getItem(label, key, icon, children) {
//         return {
//             key,
//             icon,
//             children,
//             label,
//         };
//     }

//     const items = [
//         getItem(
//             <NavLink to={`/dashboard`}>
//                 Dashboard
//             </NavLink>,
//             'dashboard'
//         ),
//         getItem(
//             <NavLink to={`/profile`}>
//                 Profile
//             </NavLink>,
//             'profile'
//         ),
//     ];

//     const { Header, Content, Footer, Sider } = Layout;
//     const [collapsed, setCollapsed] = useState(false);
//     const {
//         token: { colorBgContainer },
//     } = theme.useToken();

//     const mainPathSplit = window.location.pathname.split('/');
//     return (
//         <div>
//             <Layout
//                 style={{
//                     minHeight: '100vh',
//                 }}
//             >
//                 <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
//                     <div className="" >
//                         <h1 style={{ color: '#fff', textAlign: 'center' }}>OAuth</h1>
//                     </div>
//                     <Menu theme="dark" defaultSelectedKeys={mainPathSplit && mainPathSplit[1] ? mainPathSplit[1] : 'dashboard'} mode="inline" items={items} />
//                 </Sider>
//                 <Layout>
//                     {/* <Header
//                         style={{
//                             padding: 0,
//                             background: colorBgContainer,
//                         }}
//                     /> */}
//                     <Content
//                         style={{
//                             margin: '0 16px',
//                         }}
//                     >
//                         <Routes>
//                             <Route index path="/" element={<Navigate to="/dashboard" />} />
//                             <Route path="/dashboard" element={<LandingPage AuthContext={AuthContext} />} />
//                             <Route path="/profile" element={<Profile AuthContext={AuthContext} />} />
//                         </Routes>
//                     </Content>
//                     <Footer
//                         style={{
//                             textAlign: 'center',
//                             background: colorBgContainer,
//                             padding: 15
//                         }}
//                     >
//                         Teleparadigm ©{new Date().getFullYear()}
//                     </Footer>
//                 </Layout>
//             </Layout>
//         </div>
//     )
// }




import React, {
    useState,
    useEffect,
    useContext,
    useReducer,
    useCallback,
  } from "react";
  import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
  } from "react-router-dom";
  import axios from "axios";
  
  // Counter context
  const CounterContext = React.createContext();
  
  // Reducer function for managing counter state
  const counterReducer = (state, action) => {
    switch (action.type) {
      case "SET":
        return { ...state, count: action.count };
      case "INCREMENT":
        return { ...state, count: state.count + 1 };
      case "DECREMENT":
        return { ...state, count: state.count - 1 };
      case "SET_MY_COUNT":
        return { ...state, myCount: action.myCount };
      case "INCREMENT_MY_COUNT":
        return { ...state, myCount: state.myCount + 1 };
      case "DECREMENT_MY_COUNT":
        return { ...state, myCount: state.myCount - 1 };
      default:
        return state;
    }
  };
  
  const Home = () => {
    const { state } = useContext(CounterContext);
  
    return (
      <div>
        <h1>Counter Value: {state.count}</h1>
        <h1>My Counter Value: {state.myCount}</h1>
        <Link to="/counter">Counter</Link>
        <Link to="/mycounter">My Counter</Link>
      </div>
    );
  };
  
  const Counter = () => {
    const { state, dispatch } = useContext(CounterContext);
    const navigate = useNavigate();
  
    const fetchCounter = useCallback(async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/counter");
        dispatch({ type: "SET", count: response.data.count });
      } catch (err) {
        console.error(err);
      }
    }, [dispatch]);
  
    useEffect(() => {
      fetchCounter();
    }, [fetchCounter]);
  
    const incrementCounter = useCallback(async () => {
      try {
        await axios.post("http://localhost:5000/api/counter/increment");
        dispatch({ type: "INCREMENT" });
      } catch (err) {
        console.error(err);
      }
    }, [dispatch]);
  
    const decrementCounter = useCallback(async () => {
      try {
        await axios.post("http://localhost:5000/api/counter/decrement");
        dispatch({ type: "DECREMENT" });
      } catch (err) {
        console.error(err);
      }
    }, [dispatch]);
  
    return (
      <div>
        <h2>Counter</h2>
        <p>Count: {state.count}</p>
        <p>My Count: {state.myCount}</p>
        <button onClick={incrementCounter}>Increment</button>
        <button onClick={decrementCounter}>Decrement</button>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  };
  
  const App = () => {
    const [state, dispatch] = useReducer(counterReducer, {
      count: 0,
      myCount: 0,
    });
  
    return (
      <CounterContext.Provider value={{ state, dispatch }}>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/counter">Counter</Link>
                </li>
                <li>
                  <Link to="/mycounter">My Counter</Link>
                </li>
              </ul>
            </nav>
  
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/counter" element={<Counter />} />
              <Route path="/mycounter" element={<MyCounter />} />
            </Routes>
          </div>
      </CounterContext.Provider>
    );
  };
  
  // New MyCounter component
  const MyCounter = () => {
    const { state, dispatch } = useContext(CounterContext);
    const navigate = useNavigate();
  
    const fetchMyCounter = useCallback(async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/mycounter");
        dispatch({ type: "SET_MY_COUNT", myCount: response.data.myCount });
      } catch (err) {
        console.error(err);
      }
    }, [dispatch]);
  
    useEffect(() => {
      fetchMyCounter();
    }, [fetchMyCounter]);
  
    const incrementMyCount = async () => {
      try {
        await axios.post("http://localhost:5000/api/mycounter/increment");
        dispatch({ type: "INCREMENT_MY_COUNT" });
      } catch (err) {
        console.error(err);
      }
    };
  
    const decrementMyCount = async () => {
      try {
        await axios.post("http://localhost:5000/api/mycounter/decrement");
        dispatch({ type: "DECREMENT_MY_COUNT" });
      } catch (err) {
        console.error(err);
      }
    };
  
    return (
      <div>
        <h2>My Counter</h2>
        <p>Count: {state.count}</p>
        <p>My Count: {state.myCount}</p>
        <button onClick={incrementMyCount}>Increment My Count</button>
        <button onClick={decrementMyCount}>Decrement My Count</button>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  };
  
  export default App;
  
  
