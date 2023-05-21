const fetchUsers = async () => {
  try {
    const response = await fetch("https://randomuser.me/api/?results=5");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const userListElement = document.getElementById("userList");

try {
  const users = await fetchUsers();

  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");

    const userImage = document.createElement("img");
    userImage.classList.add("user-image");
    userImage.src = user.picture.medium;
    userImage.alt = "User Image";
    userCard.appendChild(userImage);

    const userName = document.createElement("span");
    userName.classList.add("user-name");
    userName.textContent = `${user.name.first} ${user.name.last}`;
    userCard.appendChild(userName);

    userListElement.appendChild(userCard);
  });
} catch (error) {
  console.error("Error:", error);
}
