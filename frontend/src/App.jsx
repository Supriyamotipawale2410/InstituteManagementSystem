// import Login from "./pages/Login";

// function App(){
//   return(
//     <Login/>
//   );
// }

// export default App;

import { useState } from "react";

function App(){

  function handleLogin(){

    
      console.log("Logged in successfully")

    
  }

return(
<div className="Login-container">
  <div className="Login-card">
    <h1>Institute Management System</h1>
    <label>Email</label>
    <input type="email" 
            value={email}
            onChange={}/>
    <br></br>
    <label>Password</label>
    <input type="password" />
    <br></br>
    <button onClick={handleLogin}>Submit</button>
  </div>
</div>
);

}

export default App;