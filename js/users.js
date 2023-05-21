// async function fetchUsers() {
//   try {
//     const response = await fetch("https://randomuser.me/api/?results=5");
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     return data.results;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     throw error;
//   }
// }

// fetchUsers()
//   .then((users) => {
//     const userListElement = document.getElementById("userList");
//     const ul = document.createElement("ul");

//     users.forEach((user) => {
//       const li = document.createElement("li");
//       li.textContent = `${user.name.first} ${user.name.last}`;
//       ul.appendChild(li);
//     });

//     userListElement.appendChild(ul);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
