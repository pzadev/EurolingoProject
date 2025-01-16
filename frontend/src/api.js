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
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findUser = async (username, password) => {
  try {
    const response = await fetch(
      `https://eurolingo.onrender.com/api/users/${username}`,
      {
        method: "GET",
      }
    );

    const user = await response.json();

    if (user.password === password) {
      return user;
    } else {
      console.log(user.username);
      return user.username;
    }
  } catch (error) {
    console.log(error, "catch err");
    throw new Error(error.message);
  }
};

export const checkIfUserExists = async (username) => {
  try {
    const response = await fetch(
      `https://eurolingo.onrender.com/api/users/${username}`,
      {
        method: "GET",
      }
    );
    const user = await response.json();
    if (user.msg) {
      return null;
    }
    return user;
  } catch (error) {
    console.log(error.message);
  }
};
