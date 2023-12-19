import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/home/navigation";
import Pagination from "../../components/pagination/pagination";
import Redirect from "../redirectLoading/redirect";
import { routes } from "../../routes/routes";
import axios from "axios";
import "../../styles/pages/allUsers.css";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [usersNo, setUsersNo] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(``);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  //This page is available only if username is admin

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      else {
        axios
          .get(`http://localhost:4000/api/user/allUsers/?page=${page}`, {
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            setUsers(res.data.data);
            setUsersNo(res.data.quantity);
          })
          .catch((err) => {
            if (err?.response?.data?.error) {
              setError(`${err.response.data.error}`);
            } else {
              setError(`Can't get users, please try again later.`);
            }
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          });
      }
    };
    fetchData();
  }, [page, user]);

  const handleUsernameClick = (username) => {
    navigate(`${routes.user}/${username}`);
  };

  const mappedUsers =
    users &&
    users.map((userInfo, i) => {
      return (
        <tr key={i}>
          <td onClick={() => handleUsernameClick(userInfo.username)}>
            {userInfo.username}
          </td>
          <td>{userInfo.email}</td>
          <td>{userInfo.active ? `Yes` : `No`}</td>
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
        <div className="allUsersExplanation">
          For profile details click on username
        </div>
        <Pagination
          totalLength={usersNo}
          itemsPerPage={10}
          page={page}
          setPage={setPage}
        />
      </div>
    );
}
