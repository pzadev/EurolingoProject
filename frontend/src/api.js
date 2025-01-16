export const createUser = async (username, password) => {
  try {
    const response = await fetch("https://eurolingo.onrender.com/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    console.log(data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findUser = async (username, password) => {
  try {
    const response = await fetch("https://eurolingo.onrender.com/api/users", {
      method: "GET",
    });

    const data = await response.json();
    const user = data.find((user) => user.username === username);
    if (user && user.password === password) {
      return user;
    } else if (user && user.password !== password) {
      console.log(user.username);
      return user.username;
    } else {
      console.log("Invalid name/pw");
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    console.log(error, "caught err");
    throw new Error(error.message);
  }
};

export const checkIfUserExists = async (username) => {
  try {
    const response = await fetch("https://eurolingo.onrender.com/api/users", {
      method: "GET",
    });
    const listOfUsers = await response.json();
    const user = listOfUsers.find((user) => user.username === username);

    if (user) {
      return user;
    } else {
      user = null;
      return user;
    }
  } catch (error) {
    console.log(error.message);
  }
};
