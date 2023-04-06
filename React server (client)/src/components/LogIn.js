import { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import sha256 from 'js-sha256';

function LoginForm(props) {
  

    return (
<div>
      <section>
        <h1>Welcome to Hangman!</h1>
        <h2>Login or Create a New Account</h2>
        <br />
        <form>
          <label>
            Username:
            <input type="text" value={UserName} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" value={password}  />
          </label>
          <br />
          <br />
          <button type="submit">Login</button>
          <br />          <br />
          <button onClick={handleClick}>Create New Account</button>
        </form>
      </section>
    </div>
  );
}
export default LoginForm;