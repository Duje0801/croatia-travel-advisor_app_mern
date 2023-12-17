import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/home/navigation";
import Pagination from "../../components/pagination/pagination";
import Redirect from "../redirectLoading/redirect";
import { routes } from "../../routes/routes";
import "../../styles/pages/allUsers.css";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [usersNo, setUsersNo] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(``);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

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

  const handleUsernameClick = (username) => {
    navigate(`${routes.user}/${username}`);
  };

  const mappedUsers =
    users &&
    users.map((user, i) => {
      return (
        <tr key={i}>
          <td onClick={() => handleUsernameClick(user.username)}>
            {user.username}
          </td>
          <td>{user.email}</td>
          <td>{user.active ? `Yes` : `No`}</td>
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
              <th>Active</th>
            </tr>
          </thead>
          <tbody>{mappedUsers}</tbody>
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
