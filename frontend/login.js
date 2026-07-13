document.getElementById("loginForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await res.json();

    if (data.success) {

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", data.user.username);

        window.location.href = "index.html";

    } else {

        showToast("❌ Invalid Username or Password","error");
    }
});