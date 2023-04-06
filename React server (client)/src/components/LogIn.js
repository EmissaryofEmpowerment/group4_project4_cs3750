



function LoginForm() {
  

    return (
<div>
      <section>
        <h1>Welcome to Grid Word Finder!</h1>
        <h2>Login or Create a New Account</h2>
        <br />
        <form>
          <label>
            Username:
            <input type="text"  />
          </label>
          <br />
          <label>
            Password:
            <input type="password"   />
          </label>
          <br />
          <br />
          <button type="submit">Login</button>
          <br />          <br />
          <button >Create New Account</button>
        </form>
      </section>
    </div>
  );
}
export default LoginForm;