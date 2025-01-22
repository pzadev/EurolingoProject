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
      return user.username;
    }
  } catch (error) {
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
  } catch (error) {}
};

export const checkUserProgress = async (username) => {
  try {
    const response = await fetch(
      `https://eurolingo.onrender.com/api/users/${username}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    const { progress } = data;
    return progress;
  } catch (err) {}
};
