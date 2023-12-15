import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import Navigation from "../components/navigation";
import DeleteUser from "../components/deleteUser";
import Pagination from "../components/pagination";
import Redirect from "./redirect";
import "../styles/allUsers.css";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [usersNo, setUsersNo] = useState(0);
  const [page, setPage] = useState(1);
  const [deleteUser, setDeleteUser] = useState(null);
  const [error, setError] = useState(``);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      else {
        try {
          const response = await fetch(
            `http://localhost:4000/api/user/allUsers/?page=${page}`,
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`,
              },
            }
          );

          const responseJson = await response.json();

          if (responseJson.status === `success`) {
            setUsers(responseJson.data);
            setUsersNo(responseJson.quantity);
          } else if (responseJson.status === `fail`) {
            setError(`${responseJson.error}`);
          }
        } catch (err) {
          setError(`Something went wrong. Please try again later.`);
        }
      }
    };
    fetchData();
  }, [page, user]);

  const handleDelete = (userObj) => {
    if (deleteUser === userObj.username) setDeleteUser(null);
    else if (userObj.username !== deleteUser) setDeleteUser(userObj);
  };

  const mappedUsers =
    users &&
    users.map((user, i) => {
      return (
        <tr key={i}>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>
            {user.username === `admin` ? null : (
              <button
                onClick={() =>
                  handleDelete({ username: user.username, id: user._id })
                }
              >
                Delete
              </button>
            )}
          </td>
        </tr>
      );
    });

  if (user?.username !== `admin`)
    return <Redirect message={`Only admin have access to this page`} />;
  else
    return (
      <div>
        <Navigation />
        <div className="allUsersTitle">All users list:</div>
        <div className="allUsersError">{error}</div>
        <table className="allUsersTable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {deleteUser && (
              <DeleteUser
                deleteUser={deleteUser}
                setDeleteUser={setDeleteUser}
                setUsers={setUsers}
                setPage={setPage}
                setUsersNo={setUsersNo}
                setError={setError}
              />
            )}
            {mappedUsers}
          </tbody>
        </table>
        <Pagination
          totalLength={usersNo}
          itemsPerPage={10}
          page={page}
          setPage={setPage}
        />
      </div>
    );
}
