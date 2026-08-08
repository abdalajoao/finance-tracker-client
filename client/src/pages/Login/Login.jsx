function Login() {

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md bg-white rounded shadow-md p-8">
        <h1 className="mb-4">Finance Tracker</h1>
        <h2 className="mb-6">Welcome Back👋</h2>

        <form className="space-y-4">
          <label htmlFor="email">
            Email
          </label>

          <input className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"id="email" type="email" placeholder="Enter your email"  />

          <label htmlFor="password">
            Password
          </label>

          <input id="password" type="password" placeholder="Enter your password"/>

          <button type="submit">Login</button>

        </form>

      </div>
      
    </div>
  );
  
}

export default Login;