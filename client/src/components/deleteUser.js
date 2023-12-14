import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function DeleteUser({
  deleteUser,
  setDeleteUser,
  setUsers,
  setPage,
  setUsersNo,
  setError,
}) {
  const { user } = useContext(UserContext);

  const handleDelete = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/user/deleteUser`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            username,
          }),
        }
      );

      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        setDeleteUser(``);

        try {
          //Fetching all users data again, info in allUsers menu is instantly updated
          const response = await fetch(
            `http://localhost:4000/api/user/allUsers/?page=1`,
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`,
              },
            }
          );
          const responseJson = await response.json();
          const data = responseJson.data;
          if (responseJson.status === `success`) {
            setPage(1);
            setUsers(data);
            setUsersNo(responseJson.quantity);
            setError(``);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          } else if (responseJson.status === `fail`) {
            setError(`${responseJson.error}`);
          }
        } catch (err) {
          setError(
            `User is deleted but can't update all users info now. Please try again later.`
          );
        }
      } else if (responseJson.status === `fail`) {
        setError(`${responseJson.error}`);
      }
    } catch (err) {
      setError(`Something went wrong. Please try again later.`);
    }
  };

  return (
    <tr>
      <td className="userDeleteQuestion" colSpan="3">
        Do you want to delete user {deleteUser}?
        <button
          className="userDeleteButton"
          onClick={() => handleDelete(deleteUser)}
        >
          Yes
        </button>
        <button className="userDeleteButton" onClick={() => setDeleteUser(``)}>
          No
        </button>
      </td>
    </tr>
  );
}
